import asyncio
import base64
import http.server
import json
import os
import shutil
import subprocess
import tempfile
import threading
import time
import urllib.request
import websockets

PORT = 8091
DEBUG_PORT = 9224
tmp_dir = tempfile.mkdtemp()

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory="/mnt/HDD-2/BACKUP LINUX/FILE DATA/TIAR.PROPERTY/website/tiar-property-website/out", **kwargs)

server = http.server.HTTPServer(('127.0.0.1', PORT), Handler)
t = threading.Thread(target=server.serve_forever)
t.daemon = True
t.start()

cmd = [
    "/home/arya/.local/bin/google-chrome",
    "--headless=new",
    f"--remote-debugging-port={DEBUG_PORT}",
    f"--user-data-dir={tmp_dir}",
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=390,844",
    f"http://127.0.0.1:{PORT}"
]

chrome_proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

for _ in range(20):
    time.sleep(0.3)
    try:
        tabs = json.loads(urllib.request.urlopen(f"http://127.0.0.1:{DEBUG_PORT}/json").read())
        if tabs and "webSocketDebuggerUrl" in tabs[0]:
            ws_url = tabs[0]["webSocketDebuggerUrl"]
            break
    except Exception:
        pass
else:
    print("Could not connect to Chrome debugger")
    chrome_proc.terminate()
    server.shutdown()
    shutil.rmtree(tmp_dir, ignore_errors=True)
    exit(1)

print("Connected to ws_url:", ws_url)

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

        # Emulate iPhone 14
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 390,
            "height": 844,
            "deviceScaleFactor": 2,
            "mobile": True,
            "hasTouch": True
        })
        
        await asyncio.sleep(1)

        # Click property card
        res = await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const card = document.querySelector('.group.cursor-pointer');
                    if (card) {
                        card.click();
                        return "clicked card: " + (card.querySelector('h3')?.textContent || "");
                    }
                    return "card not found";
                })()
            """,
            "returnByValue": True
        })
        print("Click result:", res)
        await asyncio.sleep(1)

        # Get initial state
        state1 = await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const scrollContainer = document.querySelector('.md\\\\:hidden.flex-1.overflow-y-auto');
                    const gallery = document.querySelector('.md\\\\:hidden.relative.w-full.aspect-\\\\[4\\\\/3\\\\]');
                    return {
                        scrollTop: scrollContainer ? scrollContainer.scrollTop : -1,
                        scrollHeight: scrollContainer ? scrollContainer.scrollHeight : -1,
                        clientHeight: scrollContainer ? scrollContainer.clientHeight : -1,
                        galleryRect: gallery ? gallery.getBoundingClientRect() : null
                    };
                })()
            """,
            "returnByValue": True
        })
        print("Initial state:", json.dumps(state1["result"]["value"], indent=2))

        # Take top screenshot
        s1 = await send_cmd("Page.captureScreenshot", {"format": "png"})
        with open("/tmp/modal_mobile_top.png", "wb") as f:
            f.write(base64.b64decode(s1["data"]))
        print("Screenshot 1 saved: /tmp/modal_mobile_top.png")

        # Scroll down 300px
        await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const scrollContainer = document.querySelector('.md\\\\:hidden.flex-1.overflow-y-auto');
                    if (scrollContainer) scrollContainer.scrollTop = 300;
                })()
            """
        })
        await asyncio.sleep(0.5)

        # Take scrolled screenshot
        s2 = await send_cmd("Page.captureScreenshot", {"format": "png"})
        with open("/tmp/modal_mobile_scrolled.png", "wb") as f:
            f.write(base64.b64decode(s2["data"]))
        print("Screenshot 2 saved: /tmp/modal_mobile_scrolled.png")

        state2 = await send_cmd("Runtime.evaluate", {
            "expression": """
                (() => {
                    const scrollContainer = document.querySelector('.md\\\\:hidden.flex-1.overflow-y-auto');
                    const gallery = document.querySelector('.md\\\\:hidden.relative.w-full.aspect-\\\\[4\\\\/3\\\\]');
                    return {
                        scrollTop: scrollContainer ? scrollContainer.scrollTop : -1,
                        galleryRect: gallery ? gallery.getBoundingClientRect() : null
                    };
                })()
            """,
            "returnByValue": True
        })
        print("Scrolled state:", json.dumps(state2["result"]["value"], indent=2))

asyncio.run(run())
chrome_proc.terminate()
server.shutdown()
shutil.rmtree(tmp_dir, ignore_errors=True)
