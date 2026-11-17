import asyncio
import json
import os
import shutil
import subprocess
import tempfile
import time
import urllib.parse
import urllib.request
import websockets

DEBUG_PORT = 9227
tmp_dir = tempfile.mkdtemp()

cmd = [
    "/home/arya/.local/bin/google-chrome",
    "--headless=new",
    f"--remote-debugging-port={DEBUG_PORT}",
    f"--user-data-dir={tmp_dir}",
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=1440,900",
    "http://127.0.0.1:3000/agen"
]

chrome_proc = subprocess.Popen(cmd, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

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
    print("Error: Could not connect to Chrome debugger")
    chrome_proc.terminate()
    shutil.rmtree(tmp_dir, ignore_errors=True)
    exit(1)

print("Connected to Chrome via CDP:", ws_url)

async def run_suite():
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

        async def eval_js(expr):
            res = await send_cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True})
            return res.get("result", {}).get("value")

        # ----------------------------------------------------
        # TEST 1: Agent Directory View Initial State & Content
        # ----------------------------------------------------
        print("\n--- TEST 1: Agent Directory /agen Initial State ---")
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/agen"})
        await asyncio.sleep(1.0)

        title = await eval_js("document.title")
        print("Page title:", title)
        assert "Direktori Konsultan" in title, f"Unexpected title: {title}"

        agents_count = await eval_js("document.querySelectorAll('h2').length")
        print("Visible agent cards:", agents_count)
        assert agents_count == 4, f"Expected 4 agent cards, got {agents_count}"

        agent_names = await eval_js("Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim())")
        print("Agent names:", agent_names)
        assert "Mbak Ningsih" in agent_names
        assert "Dimas Prasetyo" in agent_names
        assert "Rizky Pratama" in agent_names
        assert any("Maya Anggraini" in n for n in agent_names)

        # ----------------------------------------------------
        # TEST 2: Filter Tabs Client Interactivity
        # ----------------------------------------------------
        print("\n--- TEST 2: Filter Tabs Client Interactivity ---")
        # Click Sidoarjo tab
        click_sidoarjo = await eval_js("""
            (() => {
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Spesialis Sidoarjo'));
                if (btn) { btn.click(); return true; }
                return false;
            })()
        """)
        assert click_sidoarjo, "Could not find Spesialis Sidoarjo button"
        await asyncio.sleep(0.3)

        sidoarjo_names = await eval_js("Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim())")
        print("Cards after clicking 'Spesialis Sidoarjo':", sidoarjo_names)
        assert "Dimas Prasetyo" in sidoarjo_names, "Dimas Prasetyo should be visible in Sidoarjo"
        assert "Rizky Pratama" not in sidoarjo_names, "Rizky Pratama should NOT be visible in Sidoarjo"
        assert len(sidoarjo_names) == 3, f"Expected 3 agents, got {len(sidoarjo_names)}"

        # Check Dimas WA URL with contextual city
        dimas_wa = await eval_js("""
            (() => {
                const card = Array.from(document.querySelectorAll('h2')).find(h => h.textContent.includes('Dimas Prasetyo')).closest('.bg-white');
                const link = card.querySelector('a[href*=\"wa.me\"]');
                return link ? link.href : null;
            })()
        """)
        decoded_dimas_wa = urllib.parse.unquote(dimas_wa)
        print("Dimas WA Link (decoded):", decoded_dimas_wa)
        assert "wa.me/6282142193231" in decoded_dimas_wa
        assert "Halo Dimas Prasetyo" in decoded_dimas_wa
        assert "Boleh minta tolong temenin" in decoded_dimas_wa
        assert "Sidoarjo" in decoded_dimas_wa

        # Click Surabaya tab
        click_surabaya = await eval_js("""
            (() => {
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Spesialis Surabaya'));
                if (btn) { btn.click(); return true; }
                return false;
            })()
        """)
        assert click_surabaya, "Could not find Spesialis Surabaya button"
        await asyncio.sleep(0.3)

        surabaya_names = await eval_js("Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim())")
        print("Cards after clicking 'Spesialis Surabaya':", surabaya_names)
        assert "Rizky Pratama" in surabaya_names, "Rizky Pratama should be visible in Surabaya"
        assert "Dimas Prasetyo" not in surabaya_names, "Dimas Prasetyo should NOT be visible in Surabaya"
        assert len(surabaya_names) == 3, f"Expected 3 agents, got {len(surabaya_names)}"

        # Click Semua Wilayah tab
        await eval_js("""
            (() => {
                const btn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Semua Wilayah'));
                btn?.click();
            })()
        """)
        await asyncio.sleep(0.3)
        all_names = await eval_js("Array.from(document.querySelectorAll('h2')).map(h => h.textContent.trim())")
        print("Cards after resetting to 'Semua Wilayah':", all_names)
        assert len(all_names) == 4, f"Expected 4 agents, got {len(all_names)}"

        # ----------------------------------------------------
        # TEST 3: Mobile Viewport & Hamburger Drawer Navigation
        # ----------------------------------------------------
        print("\n--- TEST 3: Mobile Viewport (375x812) & Hamburger Drawer ---")
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 375,
            "height": 812,
            "deviceScaleFactor": 2,
            "mobile": True
        })
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000"})
        await asyncio.sleep(1.0)

        # Verify hamburger button is visible
        is_hamburger_visible = await eval_js("""
            (() => {
                const btn = document.querySelector('button[aria-label*=\"menu navigasi\"]');
                if (!btn) return false;
                const rect = btn.getBoundingClientRect();
                return rect.width > 0 && rect.height > 0;
            })()
        """)
        print("Hamburger button visible:", is_hamburger_visible)
        assert is_hamburger_visible, "Hamburger button should be visible on mobile"

        # Click hamburger button
        await eval_js("document.querySelector('button[aria-label*=\"menu navigasi\"]').click()")
        await asyncio.sleep(0.3)

        # Check drawer opened and has Konsultan link with Tim PIC badge
        drawer_konsultan = await eval_js("""
            (() => {
                const drawer = document.querySelector('.md\\\\:hidden.border-t');
                if (!drawer) return null;
                const link = Array.from(drawer.querySelectorAll('a')).find(a => a.textContent.includes('Konsultan'));
                if (!link) return null;
                return {
                    text: link.textContent.trim(),
                    href: link.getAttribute('href')
                };
            })()
        """)
        print("Drawer Konsultan item:", drawer_konsultan)
        assert drawer_konsultan is not None, "Konsultan link not found in drawer"
        assert "Tim PIC" in drawer_konsultan["text"], "Tim PIC badge missing from Konsultan link"
        assert drawer_konsultan["href"] == "/agen"

        # Click Konsultan from mobile drawer
        await eval_js("""
            (() => {
                const drawer = document.querySelector('.md\\\\:hidden.border-t');
                const link = Array.from(drawer ? drawer.querySelectorAll('a') : []).find(a => a.textContent.includes('Konsultan'));
                link?.click();
            })()
        """)
        await asyncio.sleep(1.0)
        curr_url = await eval_js("window.location.pathname")
        print("Navigated to from mobile drawer:", curr_url)
        assert curr_url == "/agen", f"Expected /agen, got {curr_url}"

        # ----------------------------------------------------
        # TEST 4: Property Detail View Mini Consultant Card & CTA
        # ----------------------------------------------------
        print("\n--- TEST 4: Property Detail View PIC Mini Card & CTA ---")
        # Reset viewport to desktop
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 1440,
            "height": 900,
            "deviceScaleFactor": 1,
            "mobile": False
        })
        # Check merr-surabaya-cluster-3 (Assigned to Rizky Pratama)
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti/merr-surabaya-cluster-3"})
        await asyncio.sleep(1.0)

        pic_name = await eval_js("""
            (() => {
                const el = document.querySelector('h4');
                return el ? el.textContent.trim() : null;
            })()
        """)
        print("Property Detail PIC name:", pic_name)
        assert pic_name == "Rizky Pratama", f"Expected Rizky Pratama, got {pic_name}"

        detail_wa_cta = await eval_js("""
            (() => {
                const link = Array.from(document.querySelectorAll('a')).find(a => a.textContent.includes('Mau Saya Temenin Cek Lokasi?'));
                return link ? link.href : null;
            })()
        """)
        decoded_cta = urllib.parse.unquote(detail_wa_cta)
        print("Property Detail WA CTA (decoded):", decoded_cta)
        assert "wa.me/6282142193231" in decoded_cta
        assert "Halo Rizky Pratama" in decoded_cta
        assert "Style Hoto MERR" in decoded_cta
        assert "Boleh minta tolong temenin survei ke lokasinya kak?" in decoded_cta

        # Check juanda-sedati-cluster-2 (Assigned to Dimas Prasetyo)
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti/juanda-sedati-cluster-2"})
        await asyncio.sleep(1.0)
        pic_name_2 = await eval_js("document.querySelector('h4')?.textContent.trim()")
        print("Juanda PIC name:", pic_name_2)
        assert pic_name_2 == "Dimas Prasetyo", f"Expected Dimas Prasetyo, got {pic_name_2}"

        # Check waru-gedangan-cluster-6 (Assigned to Maya Anggraini)
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti/waru-gedangan-cluster-6"})
        await asyncio.sleep(1.0)
        pic_name_3 = await eval_js("document.querySelector('h4')?.textContent.trim()")
        print("Waru PIC name:", pic_name_3)
        assert "Maya Anggraini" in pic_name_3, f"Expected Maya Anggraini, got {pic_name_3}"

        # ----------------------------------------------------
        # TEST 5: Property Quick-View Modal Dynamic PIC Routing
        # ----------------------------------------------------
        print("\n--- TEST 5: Property Quick-View Modal Dynamic PIC Routing ---")
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti"})
        await asyncio.sleep(1.0)

        # Click on card "Super Tiscre Juanda" to open modal
        click_card = await eval_js("""
            (() => {
                const card = Array.from(document.querySelectorAll('h3, h2, a')).find(el => el.textContent.includes('Super Tiscre Juanda'));
                if (card) {
                    card.click();
                    return true;
                }
                return false;
            })()
        """)
        print("Clicked card for Super Tiscre Juanda:", click_card)
        await asyncio.sleep(0.5)

        modal_wa_url = await eval_js("""
            (() => {
                const modal = document.querySelector('.fixed.inset-0');
                if (!modal) return null;
                const link = modal.querySelector('a[href*=\"wa.me\"]');
                return link ? link.href : null;
            })()
        """)
        decoded_modal_wa = urllib.parse.unquote(modal_wa_url or "")
        print("Modal WA Link (decoded):", decoded_modal_wa)
        assert "Halo Dimas Prasetyo" in decoded_modal_wa, f"Modal should route to Dimas Prasetyo: {decoded_modal_wa}"
        assert "Super Tiscre Juanda" in decoded_modal_wa
        assert "Boleh minta tolong temenin survei ke lokasinya kak?" in decoded_modal_wa

        print("\n>>> ALL 5 INTERACTIVE BROWSER TESTS PASSED 100%! <<<\n")

try:
    asyncio.run(run_suite())
finally:
    chrome_proc.terminate()
    shutil.rmtree(tmp_dir, ignore_errors=True)
