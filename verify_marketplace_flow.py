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
    "http://127.0.0.1:3000"
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

        async def take_screenshot(filename):
            data = await send_cmd("Page.captureScreenshot", {"format": "png"})
            if data and "data" in data:
                img_bytes = base64.b64decode(data["data"])
                with open(filename, "wb") as f:
                    f.write(img_bytes)
                print(f"Saved screenshot: {filename} ({len(img_bytes)} bytes)")

        # Enable Page domain
        await send_cmd("Page.enable")
        await send_cmd("DOM.enable")

        # ----------------------------------------------------
        # TEST 1: Home page property card direct click navigation
        # ----------------------------------------------------
        print("\n--- TEST 1: Home Page Card Direct Navigation (No Modal) ---")
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000"})
        await asyncio.sleep(1.2)

        first_card_href = await eval_js("document.querySelector('#katalog a[href*=\"/properti/\"]')?.getAttribute('href')")
        print("First property card href:", first_card_href)
        assert first_card_href and "/properti/" in first_card_href, f"Invalid card href: {first_card_href}"

        # Click the card directly
        print("Clicking first property card...")
        await eval_js("document.querySelector('#katalog a[href*=\"/properti/\"]')?.click()")
        await asyncio.sleep(1.2)

        current_url = await eval_js("window.location.href")
        print("Current URL after click:", current_url)
        assert "/properti/" in current_url, f"Expected navigation to /properti/..., got {current_url}"

        # Ensure NO PropertyDetailModal exists on the page
        modal_exists = await eval_js("Boolean(document.querySelector('.fixed.inset-0.z-50.flex.items-center.justify-center'))")
        print("Is modal popup active?", modal_exists)
        assert not modal_exists, "Error: Modal popup detected instead of direct page navigation!"

        await take_screenshot("docs/screenshot_1_home_navigation.png")

        # ----------------------------------------------------
        # TEST 2: Property Detail Page Marketplace Elements
        # ----------------------------------------------------
        print("\n--- TEST 2: Property Detail Page Marketplace Standard ---")
        h1_text = await eval_js("document.querySelector('h1')?.innerText")
        print("H1 Listing Title:", h1_text)
        assert h1_text, "H1 title not found"

        # Check badges
        badge_text = await eval_js("document.body.innerText")
        assert "Unit Siap Huni" in badge_text, "Badge 'Unit Siap Huni' missing"
        assert "DP 0%" in badge_text, "Badge 'DP 0%' missing"
        assert "Verified Partner" in badge_text, "Badge 'Verified Partner' missing"

        # Check All-In Free Section
        all_in_title = await eval_js("document.querySelector('h2')?.innerText")
        print("Section 2 Title:", all_in_title)
        assert "All-In Free" in badge_text, "All-In Free section missing"
        assert "Free BPHTB" in badge_text, "Free BPHTB perk missing"
        assert "Free AJB" in badge_text, "Free AJB perk missing"
        assert "Free Biaya Notaris" in badge_text, "Free Notaris perk missing"

        badge_text_upper = badge_text.upper()
        assert "LUAS TANAH (LT)" in badge_text_upper, "Luas Tanah spec missing"
        assert "LUAS BANGUNAN (LB)" in badge_text_upper, "Luas Bangunan spec missing"
        assert "KAMAR TIDUR (KT)" in badge_text_upper, "Kamar Tidur spec missing"
        assert "DAYA LISTRIK" in badge_text_upper, "Daya Listrik spec missing"
        assert "SHM & IMB/PBG SPLITZ" in badge_text_upper, "Legalitas SHM spec missing"

        # Check Proximity / Accessibility Section
        assert "Aksesibilitas Nol Menit" in badge_text or "Lokasi Emas" in badge_text, "Accessibility section missing"

        # Check Mini KPR Simulation
        print("Checking Mini KPR simulation...")
        assert "Simulasi Angsuran KPR" in badge_text, "Mini KPR Simulation section missing"
        assert "HASIL PERHITUNGAN KPR" in badge_text_upper, "KPR Calculation result missing"

        # Test interactive DP button
        init_installment = await eval_js("document.querySelector('[data-kpr-result=\"promo\"]')?.innerText")
        print("Initial promo installment:", init_installment)
        assert init_installment, "Initial promo installment not found"

        # Click DP 10% button
        await eval_js("Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('10%'))?.click()")
        await asyncio.sleep(0.4)
        new_installment = await eval_js("document.querySelector('[data-kpr-result=\"promo\"]')?.innerText")
        print("New installment with 10% DP:", new_installment)
        assert new_installment != init_installment, "KPR recalculation did not trigger on DP change!"

        # Check Consultant Card PIC
        assert "Official PIC" in badge_text, "Official PIC consultant card missing"
        assert "Mau saya temenin" in badge_text, "Saya Temenin Rule quote missing"

        # ----------------------------------------------------
        # TEST 2B: Full-Screen Lightbox & Scroll Lock & Backdrop Click
        # ----------------------------------------------------
        print("\n--- TEST 2B: Lightbox Gallery & Scroll Lock ---")
        # Click "Perbesar Galeri" button
        await eval_js("Array.from(document.querySelectorAll('button')).find(b => b.innerText.includes('Perbesar Galeri'))?.click()")
        await asyncio.sleep(0.4)
        lightbox_open = await eval_js("Boolean(document.querySelector('[role=\"dialog\"][aria-label=\"Tampilan penuh foto properti\"]'))")
        body_overflow_locked = await eval_js("document.body.style.overflow")
        print("Lightbox open:", lightbox_open, "| Body overflow:", body_overflow_locked)
        assert lightbox_open, "Lightbox failed to open"
        assert body_overflow_locked == "hidden", f"Expected body overflow 'hidden', got '{body_overflow_locked}'"

        # Backdrop click to close
        await eval_js("document.querySelector('[role=\"dialog\"][aria-label=\"Tampilan penuh foto properti\"]').click()")
        await asyncio.sleep(0.4)
        lightbox_closed = await eval_js("document.querySelector('[role=\"dialog\"][aria-label=\"Tampilan penuh foto properti\"]') === null")
        body_overflow_restored = await eval_js("document.body.style.overflow")
        print("Lightbox closed on backdrop click:", lightbox_closed, "| Body overflow restored:", body_overflow_restored)
        assert lightbox_closed, "Lightbox failed to close on backdrop click"
        assert body_overflow_restored == "", f"Expected empty body overflow, got '{body_overflow_restored}'"

        await take_screenshot("docs/screenshot_2_marketplace_detail.png")

        # Scroll to All-In Free & Technical Specs
        await eval_js("window.scrollTo(0, 900)")
        await asyncio.sleep(0.5)
        await take_screenshot("docs/screenshot_2b_specs_and_perks.png")

        # Scroll to Mini KPR simulator & Consultant Card
        await eval_js("window.scrollTo(0, 1850)")
        await asyncio.sleep(0.5)
        await take_screenshot("docs/screenshot_2c_kpr_and_consultant.png")

        # Scroll to Rekomendasi Section at bottom
        await eval_js("window.scrollTo(0, 2700)")
        await asyncio.sleep(0.5)
        await take_screenshot("docs/screenshot_2d_recommendations_section.png")

        # ----------------------------------------------------
        # TEST 3: Rekomendasi Properti Lainnya & Navigation
        # ----------------------------------------------------
        print("\n--- TEST 3: Recommendations Section & Navigation ---")
        recom_title = await eval_js("Array.from(document.querySelectorAll('h2')).find(h => h.innerText.includes('Rekomendasi Properti Lainnya'))?.innerText")
        print("Recommendation Section:", recom_title)
        assert recom_title and "Rekomendasi Properti Lainnya" in recom_title, f"Expected 'Rekomendasi Properti Lainnya', got {recom_title}"

        recom_cards_count = await eval_js("""
            (() => {
                const sec = Array.from(document.querySelectorAll('section')).find(s => s.innerText.includes('Rekomendasi Properti Lainnya'));
                return sec ? sec.querySelectorAll('a[href*="/properti/"]').length : 0;
            })()
        """)
        print("Number of recommendation cards:", recom_cards_count)
        assert recom_cards_count >= 3, f"Expected at least 3 recommendation cards, got {recom_cards_count}"

        # Click the first recommendation card
        recom_target_href = await eval_js("""
            (() => {
                const sec = Array.from(document.querySelectorAll('section')).find(s => s.innerText.includes('Rekomendasi Properti Lainnya'));
                return sec ? sec.querySelectorAll('a[href*="/properti/"]')[0].getAttribute('href') : null;
            })()
        """)
        print("Clicking recommendation card target:", recom_target_href)

        await eval_js("""
            (() => {
                const sec = Array.from(document.querySelectorAll('section')).find(s => s.innerText.includes('Rekomendasi Properti Lainnya'));
                if (sec) sec.querySelectorAll('a[href*="/properti/"]')[0].click();
            })()
        """)
        await asyncio.sleep(1.2)

        after_recom_url = await eval_js("window.location.href")
        print("URL after recommendation click:", after_recom_url)
        assert recom_target_href in after_recom_url, f"Expected {recom_target_href} in {after_recom_url}"

        # Verify new page title is different
        new_h1 = await eval_js("document.querySelector('h1')?.innerText")
        print("New cluster H1 title:", new_h1)
        assert new_h1, "New cluster page failed to render H1"

        await take_screenshot("docs/screenshot_3_recommendation_click.png")

        # ----------------------------------------------------
        # TEST 4: Mobile Viewport & Sticky Action Bar (375x812)
        # ----------------------------------------------------
        print("\n--- TEST 4: Mobile Sticky Bottom Bar & No Floating WA Overlap ---")
        await send_cmd("Emulation.setDeviceMetricsOverride", {
            "width": 375,
            "height": 812,
            "deviceScaleFactor": 2,
            "mobile": True
        })
        await asyncio.sleep(0.5)

        sticky_bar_visible = await eval_js("""
            (() => {
                const bar = document.querySelector('.lg\\\\:hidden.fixed.bottom-0');
                if (!bar) return false;
                const rect = bar.getBoundingClientRect();
                return rect.height > 0 && rect.top > 0;
            })()
        """)
        print("Mobile sticky bottom bar visible?", sticky_bar_visible)
        assert sticky_bar_visible, "Mobile sticky bottom bar is not visible in mobile viewport!"

        sticky_cta_text = await eval_js("document.querySelector('.lg\\\\:hidden.fixed.bottom-0 a')?.innerText")
        print("Mobile sticky CTA text:", sticky_cta_text)
        assert "Mau Saya Temenin" in sticky_cta_text, f"Unexpected sticky CTA text: {sticky_cta_text}"

        # Check that FloatingWhatsApp is hidden on mobile so it doesn't collide with the sticky bar
        floating_wa_hidden = await eval_js("""
            (() => {
                const aside = document.querySelector('aside[aria-label*="WhatsApp CS"]');
                if (!aside) return true;
                const parentHidden = aside.closest('.hidden.lg\\\\:block');
                const style = window.getComputedStyle(aside);
                return Boolean(parentHidden) || style.display === 'none';
            })()
        """)
        print("FloatingWhatsApp hidden on mobile to prevent clash?", floating_wa_hidden)
        assert floating_wa_hidden, "FloatingWhatsApp was not hidden on mobile, causing collision with Sticky Bottom Bar!"

        await take_screenshot("docs/screenshot_4_mobile_sticky_bar.png")

        # ----------------------------------------------------
        # TEST 5: Verify Catalog Page (/properti) Direct Click
        # ----------------------------------------------------
        print("\n--- TEST 5: /properti Catalog Direct Click ---")
        await send_cmd("Emulation.clearDeviceMetricsOverride")
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti"})
        await asyncio.sleep(1.0)

        catalog_cards = await eval_js("document.querySelectorAll('a[href*=\"/properti/\"]').length")
        print("Catalog cards count:", catalog_cards)
        assert catalog_cards >= 9, f"Expected 9 catalog cards, got {catalog_cards}"

        # Click third card in catalog
        third_card_href = await eval_js("document.querySelectorAll('a[href*=\"/properti/\"]')[2]?.getAttribute('href')")
        print("Clicking third card in catalog:", third_card_href)
        await eval_js("document.querySelectorAll('a[href*=\"/properti/\"]')[2]?.click()")
        await asyncio.sleep(1.2)

        after_catalog_click_url = await eval_js("window.location.href")
        print("URL after catalog click:", after_catalog_click_url)
        assert third_card_href in after_catalog_click_url, f"Expected navigation to {third_card_href}"

        # ----------------------------------------------------
        # TEST 6: Legacy Query Parameter Auto-Redirection
        # ----------------------------------------------------
        print("\n--- TEST 6: Legacy ?unit= Query Redirection ---")
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti?unit=sukodono-cluster-1"})
        await asyncio.sleep(1.2)
        redirected_url = await eval_js("window.location.href")
        print("URL after ?unit=sukodono-cluster-1 navigation:", redirected_url)
        assert "/properti/sukodono-cluster-1" in redirected_url, f"Expected redirect to /properti/sukodono-cluster-1, got {redirected_url}"

        # ----------------------------------------------------
        # TEST 7: Invalid Query Parameter Auto-Cleanup
        # ----------------------------------------------------
        print("\n--- TEST 7: Invalid ?unit= Parameter Cleanup ---")
        await send_cmd("Page.navigate", {"url": "http://127.0.0.1:3000/properti?unit=non-existent-cluster-999"})
        await asyncio.sleep(1.2)
        cleaned_url = await eval_js("window.location.href")
        print("URL after invalid ?unit= parameter:", cleaned_url)
        assert "non-existent-cluster-999" not in cleaned_url, f"Expected invalid param cleanup, got {cleaned_url}"

        print("\n==========================================")
        print("ALL TESTS PASSED WITH 100% SUCCESS!")
        print("==========================================")

try:
    asyncio.run(run_suite())
finally:
    chrome_proc.terminate()
    shutil.rmtree(tmp_dir, ignore_errors=True)
