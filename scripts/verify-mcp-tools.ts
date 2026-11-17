#!/usr/bin/env bun
/**
 * Test & Verifikasi Otomatis 7 Tools MCP Server Tiar Property
 * Menguji handler MCP sesungguhnya, skenario positif & negatif, serta penegakan guardrails.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import assert from 'node:assert';
import { server } from './tiar-mcp-server';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PROPERTIES_PATH = path.resolve(ROOT_DIR, 'src/data/properties.json');
const AGENTS_PATH = path.resolve(ROOT_DIR, 'src/data/agents.json');

// Backup original data
const originalProperties = fs.readFileSync(PROPERTIES_PATH, 'utf-8');
const originalAgents = fs.readFileSync(AGENTS_PATH, 'utf-8');

console.log('🧪 [Test Suite] Memulai pengujian end-to-end 7 Tools MCP Server Tiar Property...\n');

let passCount = 0;
let failCount = 0;

async function checkAsync(testName: string, fn: () => Promise<void>) {
  try {
    await fn();
    console.log(`  ✅ [PASS] ${testName}`);
    passCount++;
  } catch (err: any) {
    console.error(`  ❌ [FAIL] ${testName}: ${err.message}`);
    failCount++;
  }
}

async function runTests() {
  const tools = (server as any)._registeredTools;

  try {
    // 1. Tool 1: tiar_list_properties (basic & PIC enrichment)
    await checkAsync('Tool 1: tiar_list_properties mengambil data & meng-enrich PIC', async () => {
      const res = await tools.tiar_list_properties.handler({});
      assert(!res.isError, 'Harus sukses tanpa error');
      const data = JSON.parse(res.content[0].text);
      assert(data.success === true, 'Response status success');
      assert(data.total >= 9, 'Minimal 9 klaster');
      assert(data.data[0].picAgent !== undefined, 'PIC agent harus terpasang');
    });

    // 2. Tool 1: tiar_list_properties (Filter status: 'available')
    await checkAsync('Tool 1: tiar_list_properties filter status="available"', async () => {
      const res = await tools.tiar_list_properties.handler({ status: 'available' });
      assert(!res.isError, 'Filter status available tidak boleh error');
      const data = JSON.parse(res.content[0].text);
      assert(data.success === true, 'Status success');
      assert(data.total >= 9, 'Unit available harus >= 9');
      data.data.forEach((p: any) => {
        assert((p.status || 'available') === 'available', 'Setiap unit harus berstatus available');
      });
    });

    // 3. Tool 2: tiar_create_property (Negative test: PT Trimitra / Information Gap)
    await checkAsync('Tool 2 [Negatif]: Menolak nama legal developer "PT Trimitra Manunggal Jaya"', async () => {
      const payload = {
        codeName: 'Perumahan PT Trimitra Manunggal Jaya Waru',
        locationArea: 'Waru, Sidoarjo',
        locationAreaShort: 'Waru',
        city: 'Sidoarjo',
        floors: 1,
        priceStart: 'Rp 300 Jt',
        priceStrikethrough: 'Rp 350 Jt',
        cicilanPromo: 'Rp 1,9 Jt / bln',
        cicilanNominal: 1.9,
        subsidiInfo: 'Subsidi 1,4 Jt x 6 Bln',
        utjAmount: 'UTJ Rp 1 Jt',
        specs: { bedrooms: 2, bathrooms: 1, luasTanah: '72 m²', luasBangunan: '36 m²' },
        features: ['DP 0%'],
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      };
      const res = await tools.tiar_create_property.handler(payload);
      assert(res.isError === true, 'Harus ditandai error');
      const data = JSON.parse(res.content[0].text);
      assert(data.violation === true, 'Harus dilaporkan violation');
      assert(data.error.includes('Information Gap Protocol'), 'Pesan error harus memuat Information Gap Protocol');
    });

    // 4. Tool 2: tiar_create_property (Negative test: Real estate name Grand Park Anggaswangi)
    await checkAsync('Tool 2 [Negatif]: Menolak nama perumahan asli "Grand Park Anggaswangi"', async () => {
      const payload = {
        codeName: 'Grand Park Anggaswangi Blok B',
        locationArea: 'Jl. Anggaswangi, Sukodono, Sidoarjo',
        locationAreaShort: 'Sukodono, Sidoarjo',
        city: 'Sidoarjo',
        floors: 1,
        priceStart: 'Rp 445 Jt',
        priceStrikethrough: 'Rp 480 Jt',
        cicilanPromo: 'Rp 1,8 Jt / bln',
        cicilanNominal: 1.8,
        subsidiInfo: 'Subsidi 1,4 Jt x 6 Bln',
        utjAmount: 'UTJ Rp 5 Jt',
        specs: { bedrooms: 2, bathrooms: 1, luasTanah: '75 m²', luasBangunan: '32 m²' },
        features: ['DP 0%'],
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      };
      const res = await tools.tiar_create_property.handler(payload);
      assert(res.isError === true, 'Harus ditandai error');
      const data = JSON.parse(res.content[0].text);
      assert(data.violation === true, 'Harus dilaporkan violation');
      assert(data.error.includes('nama perumahan asli'), 'Pesan error harus memuat larangan nama perumahan asli');
    });

    // 5. Tool 2: tiar_create_property (Negative test: Real estate name Tampak Siring)
    await checkAsync('Tool 2 [Negatif]: Menolak nama perumahan asli "Tampak Siring Sidoarjo"', async () => {
      const payload = {
        codeName: 'Tampak Siring Regency Modern',
        locationArea: 'Sidoarjo Kota',
        locationAreaShort: 'Sidoarjo Kota',
        city: 'Sidoarjo',
        floors: 1,
        priceStart: 'Rp 400 Jt',
        priceStrikethrough: 'Rp 450 Jt',
        cicilanPromo: 'Rp 2,1 Jt / bln',
        cicilanNominal: 2.1,
        subsidiInfo: 'Subsidi 1,4 Jt x 6 Bln',
        utjAmount: 'UTJ Rp 2 Jt',
        specs: { bedrooms: 2, bathrooms: 1, luasTanah: '72 m²', luasBangunan: '36 m²' },
        features: ['DP 0%'],
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      };
      const res = await tools.tiar_create_property.handler(payload);
      assert(res.isError === true, 'Harus ditandai error');
      const data = JSON.parse(res.content[0].text);
      assert(data.violation === true, 'Harus dilaporkan violation');
    });

    // 6. Tool 2: tiar_create_property (Negative test: Komisi BLT)
    await checkAsync('Tool 2 [Negatif]: Menolak kebocoran komisi internal "BLT"', async () => {
      const payload = {
        codeName: 'Cluster Asri Juanda Modern',
        locationArea: 'Juanda, Sidoarjo',
        locationAreaShort: 'Juanda',
        city: 'Sidoarjo',
        floors: 1,
        priceStart: 'Rp 300 Jt',
        priceStrikethrough: 'Rp 350 Jt',
        cicilanPromo: 'Rp 1,9 Jt / bln',
        cicilanNominal: 1.9,
        subsidiInfo: 'Dapat komisi BLT marketing 15 Juta',
        utjAmount: 'UTJ Rp 1 Jt',
        specs: { bedrooms: 2, bathrooms: 1, luasTanah: '72 m²', luasBangunan: '36 m²' },
        features: ['DP 0%'],
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
      };
      const res = await tools.tiar_create_property.handler(payload);
      assert(res.isError === true, 'Harus ditandai error');
      const data = JSON.parse(res.content[0].text);
      assert(data.error.includes('BLT'), 'Pesan error harus memuat larangan kata BLT');
    });

    // 7. Tool 2: tiar_create_property (Positive test)
    let createdClusterId = '';
    await checkAsync('Tool 2 [Positif]: Berhasil menambah klaster dengan nama samaran strategis', async () => {
      const payload = {
        codeName: 'Cluster Sultan Juanda Mewah',
        locationArea: 'Bypass Juanda, Sedati, Sidoarjo',
        locationAreaShort: 'Juanda, Sidoarjo',
        city: 'Sidoarjo',
        floors: 2,
        priceStart: 'Rp 450 Jt',
        priceStrikethrough: 'Rp 520 Jt',
        cicilanPromo: 'Rp 2,8 Jt / bln',
        cicilanNominal: 2.8,
        subsidiInfo: 'Subsidi Angsuran Rp 1,4 Juta x 6 Bulan',
        utjAmount: 'UTJ Rp 2 Jt',
        status: 'available',
        specs: { bedrooms: 3, bathrooms: 2, luasTanah: '84 m²', luasBangunan: '65 m²' },
        features: ['DP 0%', 'SHM Splitz', 'Row 8 Meter', 'One Gate System'],
        imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c',
        assignedAgentId: 'mbak-ningsih',
      };
      const res = await tools.tiar_create_property.handler(payload);
      assert(!res.isError, 'Tidak boleh error');
      const data = JSON.parse(res.content[0].text);
      assert(data.success === true, 'Success harus true');
      assert(data.property && data.property.id, 'Properti harus memiliki ID');
      assert(data.property.status === 'available', 'Status harus available');
      createdClusterId = data.property.id;

      // Verifikasi di JSON fisik
      const diskProps = JSON.parse(fs.readFileSync(PROPERTIES_PATH, 'utf-8'));
      assert(diskProps.some((p: any) => p.id === createdClusterId), 'Tersimpan di properties.json');
    });

    // 8. Tool 3: tiar_update_property (Negative test: non-existent agent)
    await checkAsync('Tool 3 [Negatif]: Menolak assignedAgentId fiktif yang tidak ada di sistem', async () => {
      const res = await tools.tiar_update_property.handler({
        id: createdClusterId,
        patchData: {
          assignedAgentId: 'agent-siluman-tidak-ada',
        },
      });
      assert(res.isError === true, 'Harus ditolak error');
      const data = JSON.parse(res.content[0].text);
      assert(data.error.includes('tidak ditemukan'), 'Pesan error harus menyatakan agen tidak ditemukan');
    });

    // 9. Tool 3: tiar_update_property (Update harga & status unit ke 'sold')
    await checkAsync('Tool 3: tiar_update_property mengubah harga promo dan status unit ke "sold"', async () => {
      const res = await tools.tiar_update_property.handler({
        id: createdClusterId,
        patchData: {
          priceStart: 'Rp 440 Jt',
          cicilanPromo: 'Rp 2,6 Jt / bln',
          cicilanNominal: 2.6,
          status: 'sold',
        },
      });
      assert(!res.isError, 'Update tidak boleh error');
      const data = JSON.parse(res.content[0].text);
      assert(data.property.priceStart === 'Rp 440 Jt', 'Harga harus terupdate');
      assert(data.property.status === 'sold', 'Status harus terupdate menjadi sold');

      const diskProps = JSON.parse(fs.readFileSync(PROPERTIES_PATH, 'utf-8'));
      const p = diskProps.find((item: any) => item.id === createdClusterId);
      assert(p.priceStart === 'Rp 440 Jt', 'Tersimpan di file disk');
      assert(p.status === 'sold', 'Status sold tersimpan di disk');
    });

    // 10. Tool 1: Verifikasi filter status="sold" berhasil menangkap unit tadi
    await checkAsync('Tool 1: tiar_list_properties filter status="sold" mengembalikan unit terjual', async () => {
      const res = await tools.tiar_list_properties.handler({ status: 'sold' });
      assert(!res.isError, 'Tidak boleh error');
      const data = JSON.parse(res.content[0].text);
      assert(data.total >= 1, 'Harus menemukan minimal 1 unit sold');
      assert(data.data.some((item: any) => item.id === createdClusterId), 'Unit yang baru diupdate ada di hasil');
    });

    // 11. Tool 4: tiar_list_agents
    await checkAsync('Tool 4: tiar_list_agents mengambil semua staf konsultan marketing', async () => {
      const res = await tools.tiar_list_agents.handler({});
      assert(!res.isError, 'List agents tidak boleh error');
      const data = JSON.parse(res.content[0].text);
      assert(data.success === true && data.total >= 4, 'Minimal 4 agen');
    });

    // 12. Tool 5: tiar_register_agent (Negative test: format nomor telepon)
    await checkAsync('Tool 5 [Negatif]: Menolak nomor WhatsApp tanpa kode negara 628...', async () => {
      const res = await tools.tiar_register_agent.handler({
        name: 'Ahmad Fauzi',
        role: 'Property Consultant',
        phone: '081234567890',
        citySpecialist: 'Sidoarjo',
        areaFocus: ['Waru'],
        badges: ['Konsultan Baru'],
        bio: 'Konsultan properti ramah dan berdedikasi.',
      });
      assert(res.isError === true, 'Harus ditolak error');
      const data = JSON.parse(res.content[0].text);
      assert(data.error.includes('628'), 'Pesan error harus mengedukasi format 628');
    });

    // 13. Tool 5: tiar_register_agent (Positive test)
    let createdAgentId = '';
    await checkAsync('Tool 5 [Positif]: Mendaftarkan agen marketing baru dengan validasi nomor WA', async () => {
      const res = await tools.tiar_register_agent.handler({
        name: 'Ahmad Fauzi Sidoarjo',
        role: 'Senior Consultant Sidoarjo Raya',
        phone: '6282199887766',
        citySpecialist: 'Sidoarjo',
        areaFocus: ['Sukodono', 'Gedangan'],
        badges: ['Pakar KPR Sidoarjo', 'Survey Master'],
        bio: 'Konsultan pendamping survei lapangan siap antar konsumen ke lokasi.',
      });
      assert(!res.isError, 'Harus sukses');
      const data = JSON.parse(res.content[0].text);
      assert(data.agent && data.agent.id, 'Agent harus terbentuk ID');
      createdAgentId = data.agent.id;

      const diskAgents = JSON.parse(fs.readFileSync(AGENTS_PATH, 'utf-8'));
      assert(diskAgents.some((a: any) => a.id === createdAgentId), 'Tersimpan di agents.json');
    });

    // 14. Tool 6: tiar_assign_agent
    await checkAsync('Tool 6: tiar_assign_agent memasangkan agen ke klaster secara dua arah', async () => {
      const res = await tools.tiar_assign_agent.handler({
        propertyId: createdClusterId,
        agentId: createdAgentId,
      });
      assert(!res.isError, 'Assign harus sukses');
      const data = JSON.parse(res.content[0].text);
      assert(data.success === true, 'Status success');

      // Cek di disk
      const diskProps = JSON.parse(fs.readFileSync(PROPERTIES_PATH, 'utf-8'));
      const prop = diskProps.find((p: any) => p.id === createdClusterId);
      assert(prop.assignedAgentId === createdAgentId, 'Property PIC terupdate');

      const diskAgents = JSON.parse(fs.readFileSync(AGENTS_PATH, 'utf-8'));
      const ag = diskAgents.find((a: any) => a.id === createdAgentId);
      assert(ag.assignedProperties.includes(createdClusterId), 'Agent assignedProperties terupdate');
    });

    // 15. Tool 7: tiar_rebuild_and_deploy (Eksekusi nyata)
    await checkAsync('Tool 7: tiar_rebuild_and_deploy menjalankan static export dan memvalidasi output build', async () => {
      const res = await tools.tiar_rebuild_and_deploy.handler({
        commitMessage: 'Automated test suite verification',
      });
      assert(!res.isError, 'Rebuild tidak boleh error: ' + (res.content?.[0]?.text || ''));
      const data = JSON.parse(res.content[0].text);
      assert(data.success === true, 'Build harus berhasil (success: true)');
      assert(data.outDirReady === true, 'Folder out/ harus siap');
    });

  } finally {
    // Kembalikan ke state awal
    fs.writeFileSync(PROPERTIES_PATH, originalProperties, 'utf-8');
    fs.writeFileSync(AGENTS_PATH, originalAgents, 'utf-8');
    console.log('\n🧹 [Clean Up] Data properties.json dan agents.json telah dikembalikan ke kondisi awal (pristine).');
  }

  console.log(`\n==============================================`);
  console.log(`📊 Hasil Akhir Pengujian MCP: ${passCount} Lolos, ${failCount} Gagal.`);
  console.log(`==============================================\n`);
  if (failCount > 0) process.exit(1);
}

runTests().catch((err) => {
  console.error('Fatal test execution error:', err);
  process.exit(1);
});
