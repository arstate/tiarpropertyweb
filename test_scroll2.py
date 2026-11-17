import asyncio
import base64
import http.server
import json
import subprocess
import threading
import time
import urllib.request
import websockets

PORT = 8090

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="/mnt/HDD-2/BACKUP LINUX/FILE DATA/TIAR.PROPERTY/website/tiar-property-website/out", **kwargs)

server = http.server.HTTPServer(('127.0.0.1', PORT), Handler)
t = threading.Thread(target=server.serve_forever)
t.daemon = True
t.start()

chrome_proc = subprocess.Popen([
    "/home/arya/.local/bin/google-chrome",
    "--headless=new",
    "--remote-debugging-port=9223",
    "--no-sandbox",
    "--window-size=390,844",
    f"http://127.0.0.1:{PORT}"
])

time.sleep(2)

tabs = json.loads(urllib.request.urlopen("http://127.0.0.1:9223/json").read())
ws_url = tabs[0]["webSocketDebuggerUrl"]

async def run():
    async with websockets.connect(ws_url) as ws:
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

        # Emulate iPhone 14 (390 x 844)
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 390,
            "height": 844,
            "deviceScaleFactor": 2,
            "mobile": True,
            "hasTouch": True
        })
        await send_cmd("Emulation.setTouchEmulationEnabled", {"enabled": True})
        
        await asyncio.sleep(1)

        # Click property card
        click_res = await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const card = document.querySelector('.group.cursor-pointer');
                    if (card) {
                        card.click();
                        return "card clicked";
                    }
                    return "card not found";
                })()
            """,
            "returnByValue": True
        })
        print("Click result:", click_res)
        await asyncio.sleep(0.5)

        # Screenshot initial modal
        s1 = await send_cmd("Page.captureScreenshot", {"format": "png"})
        with open("/tmp/modal_mobile_top.png", "wb") as f:
            f.write(base64.b64decode(s1["data"]))
        print("Saved /tmp/modal_mobile_top.png")

        state1 = await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const scrollContainer = document.querySelector('.md\\\\:hidden.flex-1.overflow-y-auto');
                    const gallery = document.querySelector('.md\\\\:hidden.relative.w-full.aspect-\\\\[4\\\\/3\\\\]');
                    const bottomBar = document.querySelector('.md\\\\:hidden.shrink-0');
                    const closeBtn = document.querySelector('button[aria-label="Tutup"]');
                    return {
                        scrollTop: scrollContainer ? scrollContainer.scrollTop : -1,
                        scrollHeight: scrollContainer ? scrollContainer.scrollHeight : -1,
                        clientHeight: scrollContainer ? scrollContainer.clientHeight : -1,
                        galleryRect: gallery ? gallery.getBoundingClientRect() : null,
                        bottomBarRect: bottomBar ? bottomBar.getBoundingClientRect() : null,
                        closeBtnRect: closeBtn ? closeBtn.getBoundingClientRect() : null
                    };
                })()
            """,
            "returnByValue": True
        })
        print("State at top:\n", json.dumps(state1["result"]["value"], indent=2))

        # Now scroll the container down by 250px
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const scrollContainer = document.querySelector('.md\\\\:hidden.flex-1.overflow-y-auto');
                    if (scrollContainer) scrollContainer.scrollTop = 250;
                })()
            """
        })
        await asyncio.sleep(0.5)

        s2 = await send_cmd("Page.captureScreenshot", {"format": "png"})
        with open("/tmp/modal_mobile_scrolled.png", "wb") as f:
            f.write(base64.b64decode(s2["data"]))
        print("Saved /tmp/modal_mobile_scrolled.png")

        state2 = await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const scrollContainer = document.querySelector('.md\\\\:hidden.flex-1.overflow-y-auto');
                    const gallery = document.querySelector('.md\\\\:hidden.relative.w-full.aspect-\\\\[4\\\\/3\\\\]');
                    const bottomBar = document.querySelector('.md\\\\:hidden.shrink-0');
                    const closeBtn = document.querySelector('button[aria-label="Tutup"]');
                    return {
                        scrollTop: scrollContainer ? scrollContainer.scrollTop : -1,
                        galleryRect: gallery ? gallery.getBoundingClientRect() : null,
                        bottomBarRect: bottomBar ? bottomBar.getBoundingClientRect() : null,
                        closeBtnRect: closeBtn ? closeBtn.getBoundingClientRect() : null
                    };
                })()
            """,
            "returnByValue": True
        })
        print("State after scroll:\n", json.dumps(state2["result"]["value"], indent=2))

asyncio.run(run())
chrome_proc.terminate()
server.shutdown()
