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

DEBUG_PORT = 9226
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

        # ----------------------------------------------------
        # TEST 1: Desktop Homepage to /properti navigation & scroll cut
        # ----------------------------------------------------
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 1440,
            "height": 900,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000"})
        await asyncio.sleep(1.5)

        # Scroll to katalog section
        await send_cmd("Runtime.evaluate", {
            "expression": "document.querySelector('#katalog')?.scrollIntoView({ behavior: 'instant' });"
        })
        await asyncio.sleep(0.5)

        # Click "Lihat Semua Rumah" button
        click_res = await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const btn = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Lihat Semua Rumah'));
                    if (btn) {
                        btn.click();
                        return "Clicked: " + btn.href;
                    }
                    return "Button not found";
                })()
            """,
            "returnByValue": True
        })
        print("Nav test:", click_res["result"]["value"])
        await asyncio.sleep(1.5)

        # Check URL and scroll position
        url_and_scroll = await send_cmd("Runtime.evaluate", {
            "expression": "({ url: window.location.href, scrollY: window.scrollY, scrollX: window.scrollX })",
            "returnByValue": True
        })
        print("After nav URL & scroll:", url_and_scroll["result"]["value"])
        await capture_screen("/tmp/rev_1_desktop_properti_top.png")

        # ----------------------------------------------------
        # TEST 2: URL Query Param Sync with Filters
        # ----------------------------------------------------
        # Type search 'Rungkut'
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const inp = document.querySelector('input[placeholder*="Cari klaster"]');
                    if (inp) {
                        // simulate typing via React setter
                        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
                        nativeInputValueSetter.call(inp, 'Rungkut');
                        inp.dispatchEvent(new Event('input', { bubbles: true }));
                        inp.dispatchEvent(new Event('change', { bubbles: true }));
                        return "Typed Rungkut";
                    }
                    return "Input not found";
                })()
            """,
            "returnByValue": True
        })
        await asyncio.sleep(0.5)

        url_after_search = await send_cmd("Runtime.evaluate", {
            "expression": "({ url: window.location.href })",
            "returnByValue": True
        })
        print("URL after search query:", url_after_search["result"]["value"])
        await capture_screen("/tmp/rev_2_search_rungkut.png")

        # Click city filter 'Surabaya'
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const btns = Array.from(document.querySelectorAll('button'));
                    const sbyBtn = btns.find(b => b.textContent.trim() === 'Surabaya');
                    if (sbyBtn) {
                        sbyBtn.click();
                        return "Clicked Surabaya";
                    }
                    return "Surabaya button not found";
                })()
            """,
            "returnByValue": True
        })
        await asyncio.sleep(0.5)

        url_after_city = await send_cmd("Runtime.evaluate", {
            "expression": "({ url: window.location.href })",
            "returnByValue": True
        })
        print("URL after city filter:", url_after_city["result"]["value"])

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

        # ----------------------------------------------------
        # TEST 3: Modal Deep Linking & Back Button handling
        # ----------------------------------------------------
        # Click first property card
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const firstCard = document.querySelector('a[href*="/properti/"]');
                    if (firstCard) {
                        firstCard.click();
                        return "Clicked first card: " + firstCard.href;
                    }
                    return "No property card found";
                })()
            """,
            "returnByValue": True
        })
        await asyncio.sleep(0.8)

        modal_url_check = await send_cmd("Runtime.evaluate", {
            "expression": "({ url: window.location.href, hasModal: Boolean(document.querySelector('div[role=\"dialog\"], [class*=\"fixed inset-0\"]')) })",
            "returnByValue": True
        })
        print("Modal opened & URL check:", modal_url_check["result"]["value"])
        await capture_screen("/tmp/rev_3_modal_open_url_sync.png")

        # Now test BROWSER BACK button
        await send_cmd("Runtime.evaluate", {
            "expression": "window.history.back();"
        })
        await asyncio.sleep(0.8)

        back_res = await send_cmd("Runtime.evaluate", {
            "expression": "({ url: window.location.href, modalStillVisible: Boolean(document.querySelector('[class*=\"fixed inset-0\"]')) })",
            "returnByValue": True
        })
        print("After browser BACK button check:", back_res["result"]["value"])

        # ----------------------------------------------------
        # TEST 4: Direct Deep-Link to unit (?unit=merr-surabaya-cluster-3)
        # ----------------------------------------------------
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti?unit=merr-surabaya-cluster-3"})
        await asyncio.sleep(1.2)
        deep_link_check = await send_cmd("Runtime.evaluate", {
            "expression": "({ url: window.location.href, modalVisible: Boolean(document.querySelector('[class*=\"fixed inset-0\"]')), title: document.querySelector('h3.font-black, h3.text-xl')?.textContent })",
            "returnByValue": True
        })
        print("Deep-link test result:", deep_link_check["result"]["value"])
        await capture_screen("/tmp/rev_4_deeplink_unit.png")

        # ----------------------------------------------------
        # TEST 5: Standalone Dedicated Property Page (/properti/sukodono-cluster-1)
        # ----------------------------------------------------
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti/sukodono-cluster-1"})
        await asyncio.sleep(1.2)
        standalone_check = await send_cmd("Runtime.evaluate", {
            "expression": "({ url: window.location.href, h1: document.querySelector('h1')?.textContent, hasWaBtn: Boolean(document.querySelector('a[href*=\"wa.me\"]')) })",
            "returnByValue": True
        })
        print("Standalone /properti/sukodono-cluster-1:", standalone_check["result"]["value"])
        await capture_screen("/tmp/rev_5_standalone_property_page.png")

        # ----------------------------------------------------
        # TEST 6: Standalone Dedicated /produk route
        # ----------------------------------------------------
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/produk"})
        await asyncio.sleep(1.2)
        produk_check = await send_cmd("Runtime.evaluate", {
            "expression": "({ url: window.location.href, h1: document.querySelector('h1')?.textContent, count: document.querySelectorAll('a[href*=\"/produk/\"], a[href*=\"/properti/\"]').length })",
            "returnByValue": True
        })
        print("/produk route check:", produk_check["result"]["value"])
        await capture_screen("/tmp/rev_6_produk_page.png")

        # ----------------------------------------------------
        # TEST 7: Tablet Layout (768 x 1024)
        # ----------------------------------------------------
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 768,
            "height": 1024,
            "deviceScaleFactor": 1,
            "mobile": True
        })
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti"})
        await asyncio.sleep(1.2)
        await capture_screen("/tmp/rev_7_tablet_properti.png")

        # ----------------------------------------------------
        # TEST 8: Mobile Layout (iPhone 14, 390 x 844)
        # ----------------------------------------------------
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 390,
            "height": 844,
            "deviceScaleFactor": 3,
            "mobile": True
        })
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti"})
        await asyncio.sleep(1.2)

        # Check horizontal overflow
        mobile_overflow = await send_cmd("Runtime.evaluate", {
            "expression": "({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth })",
            "returnByValue": True
        })
        print("Mobile 390px overflow check:", mobile_overflow["result"]["value"])
        await capture_screen("/tmp/rev_8_mobile_top.png")

        # Scroll to inspect sticky bar and cards on mobile
        await send_cmd("Runtime.evaluate", { "expression": "window.scrollBy(0, 400);" })
        await asyncio.sleep(0.5)
        await capture_screen("/tmp/rev_9_mobile_sticky_and_cards.png")

        # Open modal on mobile
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const card = document.querySelector('a[href*="/properti/"]');
                    if (card) card.click();
                })()
            """
        })
        await asyncio.sleep(0.8)
        await capture_screen("/tmp/rev_10_mobile_modal.png")

        # ----------------------------------------------------
        # TEST 9: Mobile iPhone SE (375 x 667)
        # ----------------------------------------------------
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 375,
            "height": 667,
            "deviceScaleFactor": 2,
            "mobile": True
        })
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti"})
        await asyncio.sleep(1.2)
        mobile_se_overflow = await send_cmd("Runtime.evaluate", {
            "expression": "({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth, hasHorizontalOverflow: document.documentElement.scrollWidth > document.documentElement.clientWidth })",
            "returnByValue": True
        })
        print("Mobile SE 375px overflow check:", mobile_se_overflow["result"]["value"])
        await capture_screen("/tmp/rev_11_mobile_se.png")

    chrome_proc.terminate()
    shutil.rmtree(tmp_dir, ignore_errors=True)
    print("\nALL AUTOMATED QUALITY ASSURANCE TESTS COMPLETED!")

asyncio.run(run_tests())
