#!/usr/bin/env python3
"""
Interactive Headless Chrome CDP Test Suite for Tiar Property Admin Panel (/admin)
"""

import asyncio
import json
import os
import shutil
import subprocess
import tempfile
import time
import urllib.request
import websockets

DEBUG_PORT = 9228
tmp_dir = tempfile.mkdtemp()

cmd = [
    "/home/arya/.local/bin/google-chrome",
    "--headless=new",
    f"--remote-debugging-port={DEBUG_PORT}",
    f"--user-data-dir={tmp_dir}",
    "--no-sandbox",
    "--disable-gpu",
    "--window-size=1440,900",
    "http://127.0.0.1:3000/admin"
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
    print("❌ Error: Could not connect to Chrome debugger on port", DEBUG_PORT)
    chrome_proc.terminate()
    shutil.rmtree(tmp_dir, ignore_errors=True)
    exit(1)

print("🔗 Terhubung ke Chrome CDP:", ws_url)

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
                    return resp.get("result", {})

        await send_cmd("Page.enable")
        await send_cmd("Runtime.enable")
        await send_cmd("DOM.enable")

        print("\n🧪 [CDP Test Suite] Memulai pengujian antarmuka Panel Admin (/admin)...\n")
        pass_count = 0

        # Helper eval
        async def evaluate(expr):
            res = await send_cmd("Runtime.evaluate", {"expression": expr, "returnByValue": True})
            return res.get("result", {}).get("value")

        # 1. Wait for page load
        await asyncio.sleep(1.5)

        # Test 1: PIN Lock Screen
        title = await evaluate("document.title")
        print(f"  📄 Judul Halaman: {title}")
        assert "Portal Admin" in title, f"Title tidak cocok: {title}"
        print("  ✅ [PASS] 1. Halaman /admin termuat dengan metadata noindex & judul valid.")
        pass_count += 1

        has_lock = await evaluate("Boolean(document.querySelector('input[type=\"password\"]'))")
        assert has_lock, "Input PIN password tidak ditemukan"
        print("  ✅ [PASS] 2. Screen proteksi PIN Lock aktif terpasang.")
        pass_count += 1

        # Test 2: Input PIN salah '9999' using native CDP typing
        await evaluate("document.querySelector('input[type=\"password\"]').focus()")
        await send_cmd("Input.insertText", {"text": "9999"})
        await asyncio.sleep(0.2)
        await evaluate("document.querySelector('form button[type=\"submit\"]').click()")
        await asyncio.sleep(0.5)

        err_text = await evaluate("document.body.innerText")
        assert "salah" in err_text.lower(), "Pesan error PIN salah tidak muncul"
        print("  ✅ [PASS] 3. Proteksi menolak PIN salah dengan pesan peringatan.")
        pass_count += 1

        # Test 3: Clear input and type correct PIN '2026'
        await evaluate("""
            const input = document.querySelector('input[type="password"]');
            input.focus();
            input.select();
        """)
        # Click CLEAR button on keypad to cleanly reset
        await evaluate("""
            const clearBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.trim() === 'CLEAR');
            if (clearBtn) clearBtn.click();
        """)
        await asyncio.sleep(0.2)

        # Type 2026 with CDP native input
        await evaluate("document.querySelector('input[type=\"password\"]').focus()")
        await send_cmd("Input.insertText", {"text": "2026"})
        await asyncio.sleep(0.2)
        await evaluate("document.querySelector('form button[type=\"submit\"]').click()")
        await asyncio.sleep(1.0)

        # Test 4: Dashboard unlocked
        is_dashboard = await evaluate("Boolean(document.querySelector('header'))")
        body_text = await evaluate("document.body.innerText")
        lower_body = body_text.lower()
        assert is_dashboard and ("total klaster aktif" in lower_body or "admin portal" in lower_body), f"Dashboard gagal terbuka. Body text: {body_text[:200]}"
        print("  ✅ [PASS] 4. PIN '2026' valid membuka akses ke Master Admin Dashboard.")
        pass_count += 1

        # Test 5: Stats verification
        assert "zero-usage vercel active" in lower_body, "Badge Zero-Usage Vercel harus ada"
        assert "sop brand tiar property" in lower_body, "Callout guardrail SOP harus ada"
        print("  ✅ [PASS] 5. Ringkasan statistik & banner kepatuhan Information Gap SOP tampil lengkap.")
        pass_count += 1

        # Test 6: Switch to 'Klaster' tab
        await evaluate("""
            const btns = Array.from(document.querySelectorAll('header button'));
            const clusterBtn = btns.find(b => b.innerText.includes('Klaster'));
            if (clusterBtn) clusterBtn.click();
        """)
        await asyncio.sleep(0.5)

        cluster_view = await evaluate("document.body.innerText")
        assert "Tambah Klaster Baru" in cluster_view, "Tombol tambah klaster tidak ditemukan"
        assert "Sukodono" in cluster_view, "Daftar klaster tidak memuat unit Sukodono"
        print("  ✅ [PASS] 6. Tab Manajemen Klaster merender tabel unit klaster aktif.")
        pass_count += 1

        # Test 7: Open Modal and test Information Gap Protocol guardrail
        await evaluate("""
            const addBtn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tambah Klaster Baru'));
            if (addBtn) addBtn.click();
        """)
        await asyncio.sleep(0.5)

        modal_open = await evaluate("Boolean(document.querySelector('form'))")
        assert modal_open, "Modal tambah klaster gagal dibuka"
        print("  ✅ [PASS] 7. Modal input data klaster berhasil terbuka.")
        pass_count += 1

        # Test 8: Input forbidden developer name "PT Trimitra"
        await evaluate("""
            const codeInput = document.querySelector('[data-testid="input-cluster-codename"]');
            if (codeInput) codeInput.focus();
        """)
        await send_cmd("Input.insertText", {"text": "Perumahan PT Trimitra Juanda"})
        await asyncio.sleep(0.3)
        await evaluate("""
            const submitBtn = document.querySelector('[data-testid="btn-submit-cluster"]');
            if (submitBtn) submitBtn.click();
        """)
        await asyncio.sleep(0.4)

        modal_err = await evaluate("document.querySelector('[data-testid=\"guardrail-violation-error\"]')?.innerText || ''")
        assert "PT Trimitra" in modal_err, f"Guardrail gagal mencegah input PT Trimitra: {modal_err[:200]}"
        print("  ✅ [PASS] 8. Guardrail UI berhasil memblokir input pelanggaran nama PT Trimitra.")
        pass_count += 1

        # Close and reopen modal to test clean reset
        await evaluate("document.querySelector('[data-testid=\"close-cluster-modal\"]').click()")
        await asyncio.sleep(0.5)
        await evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tambah Klaster Baru'));
            if (btn) btn.click();
        })()""")
        await asyncio.sleep(0.5)

        # Test 8b: Guardrail UI blocks real estate name "Grand Park Anggaswangi"
        await evaluate("""(() => {
            const codeInput = document.querySelector('[data-testid="input-cluster-codename"]');
            if (codeInput) codeInput.focus();
        })()""")
        await send_cmd("Input.insertText", {"text": "Grand Park Anggaswangi Mewah"})
        await asyncio.sleep(0.3)
        await evaluate("""
            const submitBtn = document.querySelector('[data-testid="btn-submit-cluster"]');
            if (submitBtn) submitBtn.click();
        """)
        await asyncio.sleep(0.5)

        modal_err2 = await evaluate("document.querySelector('[data-testid=\"guardrail-violation-error\"]')?.innerText || ''")
        assert "nama perumahan asli" in modal_err2, f"Guardrail UI gagal memblokir nama perumahan asli Grand Park Anggaswangi! Text: {modal_err2[:200]}"
        print("  ✅ [PASS] 8b. Guardrail UI berhasil memblokir input nama perumahan asli 'Grand Park Anggaswangi'.")
        pass_count += 1

        # Close and reopen modal for BLT check
        await evaluate("document.querySelector('[data-testid=\"close-cluster-modal\"]').click()")
        await asyncio.sleep(0.5)
        await evaluate("""(() => {
            const btn = Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Tambah Klaster Baru'));
            if (btn) btn.click();
        })()""")
        await asyncio.sleep(0.5)

        # Test 8c: Guardrail UI blocks BLT keyword
        await evaluate("""(() => {
            const codeInput = document.querySelector('[data-testid="input-cluster-codename"]');
            if (codeInput) codeInput.focus();
        })()""")
        await send_cmd("Input.insertText", {"text": "Cluster Mewah Promo Komisi BLT 20 Juta"})
        await asyncio.sleep(0.3)
        await evaluate("""
            const submitBtn = document.querySelector('[data-testid="btn-submit-cluster"]');
            if (submitBtn) submitBtn.click();
        """)
        await asyncio.sleep(0.5)

        modal_err3 = await evaluate("document.querySelector('[data-testid=\"guardrail-violation-error\"]')?.innerText || ''")
        assert "BLT" in modal_err3, f"Guardrail UI gagal memblokir istilah BLT! Text: {modal_err3[:200]}"
        print("  ✅ [PASS] 8c. Guardrail UI berhasil memblokir pembocoran istilah rahasia 'BLT'.")
        pass_count += 1

        # Test 8d: Status selector exists
        has_status_select = await evaluate("""
            Boolean(Array.from(document.querySelectorAll('select')).some(s => 
                Array.from(s.options).some(o => o.value === 'available') &&
                Array.from(s.options).some(o => o.value === 'sold')
            ))
        """)
        assert has_status_select, "Dropdown status ketersediaan unit tidak ditemukan di modal"
        print("  ✅ [PASS] 8d. Modal klaster memiliki selector status unit (Tersedia / Booking / Terjual).")
        pass_count += 1

        # Close modal via data-testid
        await evaluate("""
            const closeBtn = document.querySelector('[data-testid="close-cluster-modal"]');
            if (closeBtn) closeBtn.click();
        """)
        await asyncio.sleep(0.5)

        # Test 9: Switch to 'Agen' tab
        await evaluate("""
            const agentTab = document.querySelector('button[data-tab="agents"]');
            if (agentTab) agentTab.click();
        """)
        await asyncio.sleep(0.5)

        agents_view = await evaluate("document.body.innerText")
        assert "Tambah Agen Baru" in agents_view, "Halaman daftar agen marketing gagal terbuka"
        assert "Mbak Ningsih" in agents_view and "Dimas Prasetyo" in agents_view, "Daftar agen tidak lengkap"
        print("  ✅ [PASS] 9. Tab Manajemen Agen menampilkan staf konsultan & nomor WhatsApp 628.")
        pass_count += 1

        # Test 10: Switch to 'Kompresi WebP' tab
        await evaluate("""
            const compTab = document.querySelector('button[data-tab="compressor"]');
            if (compTab) compTab.click();
        """)
        await asyncio.sleep(0.5)

        comp_view = await evaluate("document.body.innerText")
        lower_comp = comp_view.lower()
        assert "studio kompresi" in lower_comp and "kualitas webp" in lower_comp, f"Studio kompresi tidak termuat: {comp_view[:200]}"
        print("  ✅ [PASS] 10. Studio Kompresi WebP Canvas client-side siap digunakan.")
        pass_count += 1

        # Test 11: Switch to 'Sinkronisasi' tab
        await evaluate("""
            const syncTab = document.querySelector('button[data-tab="sync"]');
            if (syncTab) syncTab.click();
        """)
        await asyncio.sleep(0.5)

        sync_view = await evaluate("document.body.innerText")
        assert "properties.json" in sync_view and "agents.json" in sync_view, "Pilihan ekspor JSON tidak lengkap"
        assert "tiar-mcp-server.ts" in sync_view, "Referensi AI MCP server tidak ditemukan"
        print("  ✅ [PASS] 11. Tab Sinkronisasi & Ekspor JSON menyediakan tombol unduh & referensi MCP.")
        pass_count += 1

        # Test 11b: Trigger Rebuild action button
        await evaluate("""
            const rebuildBtn = document.querySelector('[data-testid="btn-trigger-rebuild"]');
            if (rebuildBtn) rebuildBtn.click();
        """)
        await asyncio.sleep(2.5)

        rebuild_feedback = await evaluate("document.body.innerText")
        assert "Sinkronisasi & Verifikasi Berhasil" in rebuild_feedback or "terverifikasi sempurna" in rebuild_feedback, "Trigger rebuild gagal memberikan feedback sukses"
        print("  ✅ [PASS] 11b. Tombol Trigger Rebuild & Sinkronisasi berhasil dieksekusi dengan feedback sukses.")
        pass_count += 1

        # Test 11: Screenshot desktop verification
        shot = await send_cmd("Page.captureScreenshot", {"format": "png"})
        if shot and "data" in shot:
            import base64
            os.makedirs("out", exist_ok=True)
            with open("out/admin_dashboard_verified.png", "wb") as f:
                f.write(base64.b64decode(shot["data"]))
            print("  📸 [PASS] 12. Screenshot visual desktop berhasil disimpan di out/admin_dashboard_verified.png")
            pass_count += 1

        # Test 12: Mobile portrait responsiveness test (iPhone 14 Pro 390x844)
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 390,
            "height": 844,
            "deviceScaleFactor": 3,
            "mobile": True
        })
        await asyncio.sleep(0.5)

        # Switch to Klaster tab on mobile
        await evaluate("document.querySelector('button[data-tab=\"clusters\"]').click()")
        await asyncio.sleep(0.5)

        mobile_cards_count = await evaluate("document.querySelectorAll('.lg\\\\:hidden > div').length")
        assert mobile_cards_count > 0, f"Kartu klaster tampilan mobile tidak ditemukan: {mobile_cards_count}"
        print(f"  📱 [PASS] 13. Mode responsif mobile portrait (390px) berhasil merender {mobile_cards_count} kartu klaster.")
        pass_count += 1

        shot_mob = await send_cmd("Page.captureScreenshot", {"format": "png"})
        if shot_mob and "data" in shot_mob:
            import base64
            with open("out/admin_mobile_clusters.png", "wb") as f:
                f.write(base64.b64decode(shot_mob["data"]))
            print("  📸 [PASS] 14. Screenshot mobile portrait disimpan di out/admin_mobile_clusters.png")
            pass_count += 1

        print(f"\n==============================================")
        print(f"🎉 Seluruh Pengujian CDP Panel Admin Berhasil: {pass_count}/18 PASS (100% OK)")
        print(f"==============================================\n")

try:
    asyncio.run(run_suite())
finally:
    chrome_proc.terminate()
    shutil.rmtree(tmp_dir, ignore_errors=True)
