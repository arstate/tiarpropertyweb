import asyncio
import base64
import json
import os
import shutil
import subprocess
import tempfile
import time
import urllib.request
import websockets

HTTP_PORT = 3457
DEBUG_PORT = 9229

# 1. First build the Next.js project
print("--- Running Next.js build ---")
build_res = subprocess.run(["node", "./node_modules/next/dist/bin/next", "build"], capture_output=True, text=True)
if build_res.returncode != 0:
    print("Build failed:", build_res.stderr)
    exit(1)
print("Build succeeded!")

# 2. Start HTTP server
http_proc = subprocess.Popen(
    ["python3", "-m", "http.server", str(HTTP_PORT), "--directory", "./out"],
    stdout=subprocess.DEVNULL,
    stderr=subprocess.DEVNULL
)

tmp_dir = tempfile.mkdtemp()
chrome_cmd = [
    "/home/arya/.local/bin/google-chrome",
    "--headless=new",
    f"--remote-debugging-port={DEBUG_PORT}",
    f"--user-data-dir={tmp_dir}",
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=1280,950",
    f"http://127.0.0.1:{HTTP_PORT}/properti/merr-surabaya-cluster-3.html"
]

chrome_proc = subprocess.Popen(chrome_cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

try:
    ws_url = None
    for _ in range(30):
        time.sleep(0.3)
        try:
            tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{DEBUG_PORT}/json").read())
            for tab in tabs:
                if tab.get("type") == "page" and "webSocketDebuggerUrl" in tab:
                    ws_url = tab["webSocketDebuggerUrl"]
                    break
            if ws_url:
                break
        except Exception:
            pass

    if not ws_url:
        print("Failed to connect to Chrome")
        exit(1)

    async def run():
        async with websockets.connect(ws_url, max_size=50_000_000) as ws:
            msg_id = 0
            async def send_cmd(method, params=None):
                nonlocal msg_id
                msg_id += 1
                payload = {"id": msg_id, "method": method, "params": params or {}}
                await ws.send(json.dumps(payload))
                while True:
                    resp = json.loads(await ws.recv())
                    if resp.get("id") == msg_id:
                        return resp.get("result")

            async def screenshot(path):
                res = await send_cmd("Page.captureScreenshot", {"format": "png"})
                with open(path, "wb") as f:
                    f.write(base64.b64decode(res["data"]))
                print(f"Captured: {path}")

            async def eval_js(expression):
                res = await send_cmd("Runtime.evaluate", {
                    "expression": expression,
                    "returnByValue": True
                })
                if res and "result" in res:
                    return res["result"].get("value")
                return None

            async def get_counter():
                val = await eval_js("""
                    (() => {
                        const span = Array.from(document.querySelectorAll('span')).find(s => s.textContent.trim().match(/^\\d+ \\/ \\d+$/));
                        return span ? span.textContent.trim() : 'not found';
                    })()
                """)
                return val

            # ------------------------------------------------------------------
            # PART A: Desktop Verification (1280x950)
            # ------------------------------------------------------------------
            print("\n=== A. Desktop Verification (1280x950) ===")
            await send_cmd("Emulation.setDeviceMetricsOverride", {
                "width": 1280, "height": 950, "deviceScaleFactor": 1, "mobile": False
            })
            await send_cmd("Page.navigate", {"url": f"http://127.0.0.1:{HTTP_PORT}/properti/merr-surabaya-cluster-3.html"})
            await asyncio.sleep(2)

            await screenshot("/tmp/verified_desktop_hero.png")

            # Check 1: Section 6 redundant consultant card deleted
            sec6_text = await eval_js("""
                (() => {
                    const text = document.body.innerText;
                    return {
                        hasOldQuote: text.includes('Senior Property Consultant (Spesialis Surabaya) — Spesialis Area Surabaya') ||
                                     text.includes('Lihat Tim Konsultan Kami'),
                        h1Title: document.querySelector('h1')?.textContent.trim()
                    };
                })()
            """)
            print("Section 6 deleted check:", sec6_text)
            assert not sec6_text["hasOldQuote"], "Section 6 should be deleted!"

            # Check 2: Desktop Arrow buttons exist and are visible
            btn_check = await eval_js("""
                (() => {
                    const prevBtn = document.querySelector('button[aria-label=\"Foto sebelumnya\"]');
                    const nextBtn = document.querySelector('button[aria-label=\"Foto selanjutnya\"]');
                    return {
                        hasPrev: !!prevBtn,
                        hasNext: !!nextBtn,
                        prevVisible: prevBtn ? window.getComputedStyle(prevBtn).display : 'none',
                        nextVisible: nextBtn ? window.getComputedStyle(nextBtn).display : 'none'
                    };
                })()
            """)
            print("Desktop Arrow buttons check:", btn_check)
            assert btn_check["prevVisible"] == "flex", "Prev arrow should be visible on desktop"
            assert btn_check["nextVisible"] == "flex", "Next arrow should be visible on desktop"

            # Check 3: Desktop Arrow button navigation
            c1 = await get_counter()
            print("Initial counter:", c1)
            assert c1 == "1 / 3"

            # Click next button
            await send_cmd("Runtime.evaluate", {
                "expression": "document.querySelector('button[aria-label=\"Foto selanjutnya\"]').click()"
            })
            await asyncio.sleep(0.3)
            c2 = await get_counter()
            print("Counter after next arrow click:", c2)
            assert c2 == "2 / 3", "Counter should advance to 2 / 3"

            # Click prev button
            await send_cmd("Runtime.evaluate", {
                "expression": "document.querySelector('button[aria-label=\"Foto sebelumnya\"]').click()"
            })
            await asyncio.sleep(0.3)
            c3 = await get_counter()
            print("Counter after prev arrow click:", c3)
            assert c3 == "1 / 3", "Counter should return to 1 / 3"

            # Check 4: Mouse Drag Gesture Support on Desktop
            print("Testing Desktop Mouse Drag Gesture...")
            r = await eval_js("""
                (() => {
                    const el = document.querySelector('img[alt*=\"Foto\"]').parentElement.parentElement;
                    const r = el.getBoundingClientRect();
                    return { x: r.x, y: r.y, width: r.width, height: r.height };
                })()
            """)
            start_x = r["x"] + r["width"] * 0.7
            start_y = r["y"] + r["height"] * 0.5
            end_x = r["x"] + r["width"] * 0.2

            # Drag Left (swiping to next photo)
            await send_cmd("Input.dispatchMouseEvent", {
                "type": "mousePressed", "x": start_x, "y": start_y, "button": "left", "buttons": 1
            })
            for i in range(1, 11):
                cur_x = start_x + (end_x - start_x) * (i / 10.0)
                await send_cmd("Input.dispatchMouseEvent", {
                    "type": "mouseMoved", "x": cur_x, "y": start_y, "button": "left", "buttons": 1
                })
                await asyncio.sleep(0.015)
            await send_cmd("Input.dispatchMouseEvent", {
                "type": "mouseReleased", "x": end_x, "y": start_y, "button": "left", "buttons": 0
            })
            await asyncio.sleep(0.4)

            c4 = await get_counter()
            print("Counter after mouse drag left:", c4)
            assert c4 == "2 / 3", f"Mouse drag should advance image to 2 / 3, got: {c4}"

            # Drag Right (swiping back to previous photo)
            await send_cmd("Input.dispatchMouseEvent", {
                "type": "mousePressed", "x": end_x, "y": start_y, "button": "left", "buttons": 1
            })
            for i in range(1, 11):
                cur_x = end_x + (start_x - end_x) * (i / 10.0)
                await send_cmd("Input.dispatchMouseEvent", {
                    "type": "mouseMoved", "x": cur_x, "y": start_y, "button": "left", "buttons": 1
                })
                await asyncio.sleep(0.015)
            await send_cmd("Input.dispatchMouseEvent", {
                "type": "mouseReleased", "x": start_x, "y": start_y, "button": "left", "buttons": 0
            })
            await asyncio.sleep(0.4)

            c5 = await get_counter()
            print("Counter after mouse drag right:", c5)
            assert c5 == "1 / 3", f"Mouse drag right should return image to 1 / 3, got: {c5}"

            # Check 5: Thumbnail row borders and clipping
            thumb_info = await eval_js("""
                (() => {
                    const thumbs = Array.from(document.querySelectorAll('button[aria-label*=\"Pilih foto\"]'));
                    return thumbs.map((t, idx) => {
                        const r = t.getBoundingClientRect();
                        const cs = window.getComputedStyle(t);
                        return {
                            index: idx,
                            width: r.width,
                            height: r.height,
                            borderRadius: cs.borderRadius,
                            borderWidth: cs.borderWidth,
                            borderColor: cs.borderColor,
                            opacity: cs.opacity
                        };
                    });
                })()
            """)
            print("Thumbnails info:", json.dumps(thumb_info, indent=2))

            # Click thumbnail 3
            await eval_js("document.querySelectorAll('button[aria-label*=\"Pilih foto\"]')[2].click()")
            await asyncio.sleep(0.3)
            c6 = await get_counter()
            print("Counter after thumbnail 3 click:", c6)
            assert c6 == "3 / 3"

            # Check 6: Click on image opens lightbox
            await eval_js("document.querySelector('img[alt*=\"Foto\"]').parentElement.parentElement.click()")
            await asyncio.sleep(0.4)
            lightbox_open = await eval_js("!!document.querySelector('div[role=\"dialog\"]')")
            print("Lightbox open after click:", lightbox_open)
            assert lightbox_open, "Clicking image should open lightbox"

            # Close lightbox
            await eval_js("document.querySelector('button[aria-label=\"Tutup galeri\"]').click()")
            await asyncio.sleep(0.3)

            # ------------------------------------------------------------------
            # PART B: Mobile Verification (390x844)
            # ------------------------------------------------------------------
            print("\n=== B. Mobile Verification (390x844) ===")
            await send_cmd("Emulation.setDeviceMetricsOverride", {
                "width": 390, "height": 844, "deviceScaleFactor": 2, "mobile": True
            })
            await send_cmd("Page.navigate", {"url": f"http://127.0.0.1:{HTTP_PORT}/properti/merr-surabaya-cluster-3.html"})
            await asyncio.sleep(2)

            await screenshot("/tmp/verified_mobile_top.png")

            # Check 7: Arrow buttons hidden on mobile
            mobile_btn_check = await eval_js("""
                (() => {
                    const prevBtn = document.querySelector('button[aria-label=\"Foto sebelumnya\"]');
                    const nextBtn = document.querySelector('button[aria-label=\"Foto selanjutnya\"]');
                    return {
                        prevVisible: prevBtn ? window.getComputedStyle(prevBtn).display : 'none',
                        nextVisible: nextBtn ? window.getComputedStyle(nextBtn).display : 'none'
                    };
                })()
            """)
            print("Mobile Arrow buttons check:", mobile_btn_check)
            assert mobile_btn_check["prevVisible"] == "none", "Prev arrow should be hidden on mobile"
            assert mobile_btn_check["nextVisible"] == "none", "Next arrow should be hidden on mobile"

            # Check 8: Mobile Touch swipe gesture
            print("Testing Mobile Touch Swipe Gesture...")
            mr = await eval_js("""
                (() => {
                    const el = document.querySelector('img[alt*=\"Foto\"]').parentElement.parentElement;
                    const r = el.getBoundingClientRect();
                    return { x: r.x, y: r.y, width: r.width, height: r.height };
                })()
            """)
            m_start_x = mr["x"] + mr["width"] * 0.8
            m_start_y = mr["y"] + mr["height"] * 0.5
            m_end_x = mr["x"] + mr["width"] * 0.2

            await send_cmd("Input.dispatchTouchEvent", {
                "type": "touchStart",
                "touchPoints": [{"x": m_start_x, "y": m_start_y, "id": 0}]
            })
            for i in range(1, 11):
                cur_x = m_start_x + (m_end_x - m_start_x) * (i / 10.0)
                await send_cmd("Input.dispatchTouchEvent", {
                    "type": "touchMove",
                    "touchPoints": [{"x": cur_x, "y": m_start_y, "id": 0}]
                })
                await asyncio.sleep(0.015)
            await send_cmd("Input.dispatchTouchEvent", {
                "type": "touchEnd",
                "touchPoints": []
            })
            await asyncio.sleep(0.4)

            mc = await get_counter()
            print("Mobile counter after touch swipe:", mc)
            assert mc == "2 / 3", f"Touch swipe should advance image to 2 / 3, got: {mc}"

            # Scroll down to inspect hero right card on mobile
            await eval_js("window.scrollBy(0, 320);")
            await asyncio.sleep(0.4)
            await screenshot("/tmp/verified_mobile_card.png")

            print("\nALL VERIFICATION CHECKS PASSED PERFECTLY!")

    asyncio.run(run())

finally:
    chrome_proc.terminate()
    http_proc.terminate()
    shutil.rmtree(tmp_dir, ignore_errors=True)
