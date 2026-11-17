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

DEBUG_PORT = 9225
tmp_dir = tempfile.mkdtemp()

cmd = [
    "/home/arya/.local/bin/google-chrome",
    "--headless=new",
    f"--remote-debugging-port={DEBUG_PORT}",
    f"--user-data-dir={tmp_dir}",
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=1440,900",
    "http://127.0.0.1:3000"
]

chrome_proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

ws_url = None
for _ in range(25):
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
    print("Error: Could not connect to Chrome debugger")
    chrome_proc.terminate()
    shutil.rmtree(tmp_dir, ignore_errors=True)
    exit(1)

print("Connected to Chrome via CDP:", ws_url)

async def run_tests():
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

        async def capture_screen(filename):
            s = await send_cmd("Page.captureScreenshot", {"format": "png"})
            with open(filename, "wb") as f:
                f.write(base64.b64decode(s["data"]))
            print(f"Saved screenshot: {filename}")

        # 1. Desktop Homepage Inspection
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 1440,
            "height": 900,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000"})
        await asyncio.sleep(1.5)

        # Scroll down to see the "Lihat Semua Rumah" CTA card
        await send_cmd("Runtime.evaluate", {
            "expression": "document.querySelector('#katalog')?.scrollIntoView({ behavior: 'instant' });"
        })
        await asyncio.sleep(0.5)
        await capture_screen("/tmp/1_desktop_homepage_katalog.png")

        # Scroll to the bottom of #katalog to see the CTA banner
        await send_cmd("Runtime.evaluate", {
            "expression": "window.scrollBy(0, 800);"
        })
        await asyncio.sleep(0.5)
        await capture_screen("/tmp/2_desktop_homepage_cta_banner.png")

        # Click "Lihat Semua Rumah" button
        nav_res = await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const btn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Lihat Semua Rumah'));
                    if (btn) {
                        btn.click();
                        return "Clicked button: " + btn.href;
                    }
                    return "Button not found";
                })()
            """,
            "returnByValue": True
        })
        print("Click CTA result:", nav_res["result"]["value"])
        await asyncio.sleep(1.5)

        current_url = await send_cmd("Runtime.evaluate", {
            "expression": "window.location.href",
            "returnByValue": True
        })
        print("Current URL after click:", current_url["result"]["value"])
        await capture_screen("/tmp/3_desktop_properti_landing.png")

        # Check scroll position on /properti
        scroll_pos = await send_cmd("Runtime.evaluate", {
            "expression": "({ scrollY: window.scrollY, scrollX: window.scrollX })",
            "returnByValue": True
        })
        print("Scroll position at /properti:", scroll_pos["result"]["value"])

        # Test search filter on /properti: type "Rungkut"
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const input = document.querySelector('input[type="text"]');
                    if (input) {
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                        setter.call(input, "Rungkut");
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                        return "Typed Rungkut";
                    }
                    return "Input not found";
                })()
            """,
            "returnByValue": True
        })
        await asyncio.sleep(0.8)
        await capture_screen("/tmp/4_desktop_properti_search_rungkut.png")

        # Clear search and click "Surabaya" filter pill
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const input = document.querySelector('input[type="text"]');
                    if (input) {
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                        setter.call(input, "");
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === 'Surabaya');
                    if (btn) {
                        btn.click();
                        return "Clicked Surabaya filter";
                    }
                    return "Surabaya button not found";
                })()
            """,
            "returnByValue": True
        })
        await asyncio.sleep(0.8)
        await capture_screen("/tmp/5_desktop_properti_filter_surabaya.png")

        # Click "2 Lantai" filter pill
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.trim() === '2 Lantai');
                    if (btn) {
                        btn.click();
                        return "Clicked 2 Lantai filter";
                    }
                    return "2 Lantai button not found";
                })()
            """,
            "returnByValue": True
        })
        await asyncio.sleep(0.8)
        await capture_screen("/tmp/6_desktop_properti_filter_2lantai.png")

        # Click first property card to open Modal
        card_res = await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const card = document.querySelector('.group.cursor-pointer');
                    if (card) {
                        card.click();
                        return "Clicked card: " + (card.querySelector('h3')?.textContent || "");
                    }
                    return "No card found";
                })()
            """,
            "returnByValue": True
        })
        print("Open modal result:", card_res["result"]["value"])
        await asyncio.sleep(0.8)
        await capture_screen("/tmp/7_desktop_modal_open.png")

        # Close modal
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const closeBtn = document.querySelector('button[aria-label="Tutup"]');
                    if (closeBtn) closeBtn.click();
                })()
            """
        })
        await asyncio.sleep(0.5)

        # Reset all filters
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset Semua Filter'));
                    if (resetBtn) resetBtn.click();
                })()
            """
        })
        await asyncio.sleep(0.5)

        # 2. Tablet Inspection (768x1024)
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 768,
            "height": 1024,
            "deviceScaleFactor": 1,
            "mobile": True
        })
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti"})
        await asyncio.sleep(1)
        await capture_screen("/tmp/8_tablet_properti_top.png")

        # 3. Mobile Inspection (390x844 - iPhone 14)
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 390,
            "height": 844,
            "deviceScaleFactor": 2,
            "mobile": True,
            "hasTouch": True
        })
        await send_cmd("Emulation.setTouchEmulationEnabled", {"enabled": True})
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti"})
        await asyncio.sleep(1)

        # Check mobile horizontal overflow
        overflow = await send_cmd("Runtime.evaluate", {
            "expression": """
                ({
                    scrollWidth: document.documentElement.scrollWidth,
                    clientWidth: document.documentElement.clientWidth,
                    hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth
                })
            """,
            "returnByValue": True
        })
        print("Mobile overflow check:", overflow["result"]["value"])
        await capture_screen("/tmp/9_mobile_properti_top.png")

        # Scroll down on mobile to see property cards
        await send_cmd("Runtime.evaluate", {
            "expression": "window.scrollBy(0, 350);"
        })
        await asyncio.sleep(0.5)
        await capture_screen("/tmp/10_mobile_properti_cards.png")

        # Click a card on mobile to test modal
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const card = document.querySelector('.group.cursor-pointer');
                    if (card) {
                        card.click();
                        return "Clicked card on mobile";
                    }
                    return "No card";
                })()
            """,
            "returnByValue": True
        })
        await asyncio.sleep(0.8)
        await capture_screen("/tmp/11_mobile_modal_open.png")

        # Close modal
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const closeBtn = document.querySelector('button[aria-label="Tutup"]');
                    if (closeBtn) closeBtn.click();
                })()
            """
        })
        await asyncio.sleep(0.5)

        # Test Empty state on mobile
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const input = document.querySelector('input[type="text"]');
                    if (input) {
                        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                        setter.call(input, "zzzzz999tidakada");
                        input.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                })()
            """
        })
        await asyncio.sleep(0.5)
        await capture_screen("/tmp/12_mobile_empty_state.png")

asyncio.run(run_tests())
chrome_proc.terminate()
shutil.rmtree(tmp_dir, ignore_errors=True)
print("Visual inspection script completed successfully!")
