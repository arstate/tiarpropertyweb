#!/usr/bin/env bun
/**
 * MCP Server untuk AI Agent Tiar Property
 * Sesuai Blueprint: scripts/tiar-mcp-server.ts
 *
 * 7 Tools:
 * 1. tiar_list_properties
 * 2. tiar_create_property (dengan penegakan Information Gap Protocol & Anti-BLT)
 * 3. tiar_update_property
 * 4. tiar_list_agents
 * 5. tiar_register_agent
 * 6. tiar_assign_agent
 * 7. tiar_rebuild_and_deploy
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { execSync } from 'node:child_process';
import type { PropertyUnit } from '../src/data/properties';
import type { AgentProfile } from '../src/data/agents';
import {
  FORBIDDEN_LEGAL_DEV_REGEX,
  FORBIDDEN_REAL_ESTATE_PATTERNS,
  FORBIDDEN_BLT_REGEX,
  validateTiarGuardrails,
} from '../src/lib/guardrails';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '..');
const PROPERTIES_PATH = path.resolve(ROOT_DIR, 'src/data/properties.json');
const AGENTS_PATH = path.resolve(ROOT_DIR, 'src/data/agents.json');

function getErrorMessage(err: unknown): string {
  if (err instanceof Error) return err.message;
  return String(err);
}

// Helper I/O
function loadProperties(): PropertyUnit[] {
  if (!fs.existsSync(PROPERTIES_PATH)) return [];
  const raw = fs.readFileSync(PROPERTIES_PATH, 'utf-8');
  return JSON.parse(raw) as PropertyUnit[];
}

function saveProperties(data: PropertyUnit[]): void {
  fs.writeFileSync(PROPERTIES_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function loadAgents(): AgentProfile[] {
  if (!fs.existsSync(AGENTS_PATH)) return [];
  const raw = fs.readFileSync(AGENTS_PATH, 'utf-8');
  return JSON.parse(raw) as AgentProfile[];
}

function saveAgents(data: AgentProfile[]): void {
  fs.writeFileSync(AGENTS_PATH, JSON.stringify(data, null, 2), 'utf-8');
}

function checkGuardrails(payload: unknown): { ok: boolean; reason?: string } {
  return validateTiarGuardrails(payload);
}

const imagePathSchema = z
  .string()
  .min(1)
  .refine((val) => val.startsWith('/images/') || /^https?:\/\//i.test(val), {
    message: 'Wajib berupa path lokal (/images/...) atau URL https:// yang valid.',
  });

function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Inisialisasi MCP Server
const server = new McpServer({
  name: 'tiar-property-mcp',
  version: '1.0.0',
});

// Tool 1: tiar_list_properties
server.tool(
  'tiar_list_properties',
  'Lihat semua unit klaster properti Tiar Property beserta detail agen PIC pendampingnya.',
  {
    city: z.enum(['Surabaya', 'Sidoarjo']).optional().describe('Filter kota (Surabaya / Sidoarjo)'),
    status: z
      .enum(['available', 'reserved', 'sold', 'all'])
      .optional()
      .describe('Filter status ketersediaan (available / reserved / sold / all)'),
    maxCicilan: z.number().optional().describe('Filter cicilan maksimal (dalam juta rupiah, misal 2.5)'),
  },
  async ({ city, status, maxCicilan }) => {
    try {
      const properties = loadProperties();
      const agents = loadAgents();

      let filtered = properties;
      if (city) {
        filtered = filtered.filter((p) => p.city.toLowerCase() === city.toLowerCase());
      }
      if (status && status !== 'all') {
        filtered = filtered.filter((p) => (p.status || 'available') === status);
      }
      if (maxCicilan !== undefined) {
        filtered = filtered.filter((p) => (p.cicilanNominal || 0) <= maxCicilan);
      }

      const enriched = filtered.map((prop) => {
        const pic = agents.find(
          (a) => a.id === prop.assignedAgentId || (a.assignedProperties || []).includes(prop.id)
        );
        return {
          ...prop,
          picAgent: pic
            ? {
                id: pic.id,
                name: pic.name,
                role: pic.role,
                phone: pic.phone,
                citySpecialist: pic.citySpecialist,
              }
            : null,
        };
      });

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                total: enriched.length,
                data: enriched,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (err: unknown) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: getErrorMessage(err) }) }],
        isError: true,
      };
    }
  }
);

// Tool 2: tiar_create_property
server.tool(
  'tiar_create_property',
  'Tambah unit klaster perumahan baru dengan validasi ketat Information Gap Protocol (tolak PT Trimitra/nama perumahan legal asli) & Anti-BLT.',
  {
    codeName: z.string().describe('Nama samaran klaster (contoh: "Cluster Modern Sukodono", "Grand Minimalis Juanda")'),
    locationArea: z.string().describe('Deskripsi area lokasi strategis (contoh: "Sukodono, Sidoarjo (10 Menit ke Waru)")'),
    locationAreaShort: z.string().describe('Ringkasan nama lokasi (contoh: "Sukodono, Sidoarjo")'),
    city: z.enum(['Surabaya', 'Sidoarjo']).describe('Kota pemasaran'),
    floors: z.union([z.literal(1), z.literal(2)]).describe('Jumlah lantai (1 atau 2)'),
    priceStart: z.string().describe('Harga mulai promo (contoh: "Rp 320 Jt")'),
    priceStrikethrough: z.string().describe('Harga coret sebelum diskon (contoh: "Rp 380 Jt")'),
    cicilanPromo: z.string().describe('Teks cicilan promo (contoh: "Rp 1,9 Jt / bln")'),
    cicilanNominal: z.number().describe('Nominal cicilan angka (misal 1.9)'),
    subsidiInfo: z.string().describe('Keterangan subsidi cicilan (contoh: "Subsidi Angsuran Rp 1,4 Juta x 6 Bulan")'),
    utjAmount: z.string().describe('Nominal UTJ (contoh: "UTJ Rp 1 Jt")'),
    specs: z.object({
      bedrooms: z.number().int().min(1),
      bathrooms: z.number().int().min(1),
      luasTanah: z.string(),
      luasBangunan: z.string(),
    }),
    features: z.array(z.string()).describe('Daftar fitur keunggulan (contoh: ["DP 0%", "Free BPHTB"])'),
    imageUrl: imagePathSchema.describe('Path lokal (/images/properties/...) atau URL foto utama klaster'),
    galleryImages: z.array(imagePathSchema).optional().describe('Daftar path lokal atau URL galeri foto pendukung'),
    assignedAgentId: z.string().optional().describe('ID agen PIC konsultan pendamping'),
    status: z
      .enum(['available', 'reserved', 'sold'])
      .optional()
      .default('available')
      .describe('Status ketersediaan unit klaster (available / reserved / sold)'),
  },
  async (args) => {
    const guardrail = checkGuardrails(args);
    if (!guardrail.ok) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: false,
                violation: true,
                error: guardrail.reason,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }

    try {
      const properties = loadProperties();
      const agents = loadAgents();

      if (args.assignedAgentId) {
        const agentExists = agents.some((a) => a.id === args.assignedAgentId);
        if (!agentExists) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  error: `Agen dengan ID '${args.assignedAgentId}' tidak ditemukan di sistem.`,
                }),
              },
            ],
            isError: true,
          };
        }
      }

      const baseId = slugify(`${args.codeName}-${args.city}`) || 'cluster-baru';
      let newId = baseId;
      let counter = 1;
      while (properties.some((p) => p.id === newId)) {
        newId = `${baseId}-${counter++}`;
      }

      const newProperty: PropertyUnit = {
        id: newId,
        codeName: args.codeName,
        locationArea: args.locationArea,
        locationAreaShort: args.locationAreaShort,
        city: args.city,
        floors: args.floors,
        priceStart: args.priceStart,
        priceStrikethrough: args.priceStrikethrough,
        cicilanPromo: args.cicilanPromo,
        cicilanNominal: args.cicilanNominal,
        subsidiInfo: args.subsidiInfo,
        utjAmount: args.utjAmount,
        rating: 5,
        specs: args.specs,
        features: args.features,
        imageUrl: args.imageUrl,
        galleryImages: args.galleryImages && args.galleryImages.length > 0 ? args.galleryImages : [args.imageUrl],
        assignedAgentId: args.assignedAgentId || 'mbak-ningsih',
        status: args.status || 'available',
      };

      properties.push(newProperty);
      saveProperties(properties);

      const targetAgentId = newProperty.assignedAgentId;
      const agentIndex = agents.findIndex((a) => a.id === targetAgentId);
      if (agentIndex !== -1) {
        if (!agents[agentIndex].assignedProperties) agents[agentIndex].assignedProperties = [];
        if (!agents[agentIndex].assignedProperties.includes(newId)) {
          agents[agentIndex].assignedProperties.push(newId);
          saveAgents(agents);
        }
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Klaster properti '${newProperty.codeName}' berhasil ditambahkan dengan ID '${newId}'.`,
                property: newProperty,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (err: unknown) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: getErrorMessage(err) }) }],
        isError: true,
      };
    }
  }
);

// Tool 3: tiar_update_property
server.tool(
  'tiar_update_property',
  'Perbarui data unit klaster properti yang sudah ada (harga, status unit, promo cicilan, spesifikasi, PIC agen).',
  {
    id: z.string().describe('ID klaster properti yang akan diupdate'),
    patchData: z.record(z.string(), z.unknown()).describe('Objek data parsial yang ingin diperbarui'),
  },
  async ({ id, patchData }) => {
    const guardrail = checkGuardrails(patchData);
    if (!guardrail.ok) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: false,
                violation: true,
                error: guardrail.reason,
              },
              null,
              2
            ),
          },
        ],
        isError: true,
      };
    }

    try {
      const properties = loadProperties();
      const agents = loadAgents();

      const index = properties.findIndex((p) => p.id === id);
      if (index === -1) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `Klaster dengan ID '${id}' tidak ditemukan.`,
              }),
            },
          ],
          isError: true,
        };
      }

      const nextAgentId = typeof patchData.assignedAgentId === 'string' ? patchData.assignedAgentId : undefined;
      if (nextAgentId) {
        const agentExists = agents.some((a) => a.id === nextAgentId);
        if (!agentExists) {
          return {
            content: [
              {
                type: 'text',
                text: JSON.stringify({
                  success: false,
                  error: `Agen dengan ID '${nextAgentId}' tidak ditemukan di sistem.`,
                }),
              },
            ],
            isError: true,
          };
        }
      }

      if (
        patchData.status !== undefined &&
        !['available', 'reserved', 'sold'].includes(String(patchData.status))
      ) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `Status unit '${String(patchData.status)}' tidak valid. Wajib salah satu: 'available', 'reserved', 'sold'.`,
              }),
            },
          ],
          isError: true,
        };
      }

      const oldAgentId = properties[index].assignedAgentId;
      const updated: PropertyUnit = {
        ...properties[index],
        ...(patchData as Partial<PropertyUnit>),
        id,
      };

      properties[index] = updated;
      saveProperties(properties);

      if (nextAgentId && nextAgentId !== oldAgentId) {
        const latestAgents = loadAgents();
        if (oldAgentId) {
          const oldAg = latestAgents.find((a) => a.id === oldAgentId);
          if (oldAg && oldAg.assignedProperties) {
            oldAg.assignedProperties = oldAg.assignedProperties.filter((pid) => pid !== id);
          }
        }
        const newAg = latestAgents.find((a) => a.id === nextAgentId);
        if (newAg) {
          if (!newAg.assignedProperties) newAg.assignedProperties = [];
          if (!newAg.assignedProperties.includes(id)) {
            newAg.assignedProperties.push(id);
          }
        }
        saveAgents(latestAgents);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Klaster '${updated.codeName}' (${id}) berhasil diperbarui.`,
                property: updated,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (err: unknown) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: getErrorMessage(err) }) }],
        isError: true,
      };
    }
  }
);

// Tool 4: tiar_list_agents
server.tool(
  'tiar_list_agents',
  'Lihat daftar seluruh konsultan agen marketing Tiar Property beserta unit binaannya.',
  {
    citySpecialist: z
      .enum(['Surabaya', 'Sidoarjo', 'Surabaya & Sidoarjo'])
      .optional()
      .describe('Filter spesialisasi kota'),
    isActive: z.boolean().optional().describe('Filter status aktif'),
  },
  async ({ citySpecialist, isActive }) => {
    try {
      let agents = loadAgents();
      if (citySpecialist) {
        agents = agents.filter((a) => a.citySpecialist === citySpecialist);
      }
      if (isActive !== undefined) {
        agents = agents.filter((a) => a.isActive === isActive);
      }

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                total: agents.length,
                data: agents,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (err: unknown) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: getErrorMessage(err) }) }],
        isError: true,
      };
    }
  }
);

// Tool 5: tiar_register_agent
server.tool(
  'tiar_register_agent',
  'Daftarkan staf konsultan agen marketing baru ke Tiar Property.',
  {
    name: z.string().describe('Nama lengkap agen marketing'),
    role: z.string().describe('Jabatan / peran konsultan'),
    phone: z.string().describe('Nomor WhatsApp format Indonesia (wajib berawalan 628...)'),
    citySpecialist: z.enum(['Surabaya', 'Sidoarjo', 'Surabaya & Sidoarjo']).describe('Fokus kota pemasaran'),
    areaFocus: z.array(z.string()).describe('Daftar area fokus keahlian'),
    badges: z.array(z.string()).describe('Daftar badge keahlian'),
    bio: z.string().describe('Biografi singkat profesional agen'),
    photoUrl: imagePathSchema.optional().describe('Path lokal (/images/agents/...) atau URL foto profil agen'),
    orderPriority: z.number().int().optional().describe('Urutan prioritas tampilan'),
  },
  async (args) => {
    const cleanPhone = args.phone.replace(/[^\d]/g, '');
    if (!cleanPhone.startsWith('628') || cleanPhone.length < 10 || cleanPhone.length > 15) {
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error:
                'Format nomor WhatsApp tidak valid. Nomor wajib menggunakan kode negara Indonesia yang diawali "628" (contoh: 6282142193231).',
            }),
          },
        ],
        isError: true,
      };
    }

    try {
      const agents = loadAgents();

      const baseId = slugify(args.name);
      let newId = baseId;
      let counter = 1;
      while (agents.some((a) => a.id === newId)) {
        newId = `${baseId}-${counter++}`;
      }

      const defaultPhoto = '/images/agents/mbak-ningsih.webp';

      const newAgent: AgentProfile = {
        id: newId,
        name: args.name,
        role: args.role,
        photoUrl: args.photoUrl || defaultPhoto,
        phone: cleanPhone,
        citySpecialist: args.citySpecialist,
        areaFocus: args.areaFocus,
        rating: 5.0,
        totalDealsAssisted: 0,
        badges: args.badges,
        bio: args.bio,
        assignedProperties: [],
        isActive: true,
        orderPriority: args.orderPriority || agents.length + 1,
      };

      agents.push(newAgent);
      saveAgents(agents);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Agen marketing '${newAgent.name}' berhasil didaftarkan dengan ID '${newId}'.`,
                agent: newAgent,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (err: unknown) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: getErrorMessage(err) }) }],
        isError: true,
      };
    }
  }
);

// Tool 6: tiar_assign_agent
server.tool(
  'tiar_assign_agent',
  'Pasangkan konsultan agen marketing sebagai PIC pendamping resmi untuk sebuah klaster properti.',
  {
    propertyId: z.string().describe('ID klaster properti'),
    agentId: z.string().describe('ID konsultan agen marketing'),
  },
  async ({ propertyId, agentId }) => {
    try {
      const properties = loadProperties();
      const agents = loadAgents();

      const propIndex = properties.findIndex((p) => p.id === propertyId);
      if (propIndex === -1) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `Klaster dengan ID '${propertyId}' tidak ditemukan.`,
              }),
            },
          ],
          isError: true,
        };
      }

      const agentIndex = agents.findIndex((a) => a.id === agentId);
      if (agentIndex === -1) {
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({
                success: false,
                error: `Agen dengan ID '${agentId}' tidak ditemukan.`,
              }),
            },
          ],
          isError: true,
        };
      }

      const oldAgentId = properties[propIndex].assignedAgentId;
      properties[propIndex].assignedAgentId = agentId;
      saveProperties(properties);

      if (oldAgentId && oldAgentId !== agentId) {
        const oldAg = agents.find((a) => a.id === oldAgentId);
        if (oldAg && oldAg.assignedProperties) {
          oldAg.assignedProperties = oldAg.assignedProperties.filter((pid) => pid !== propertyId);
        }
      }

      if (!agents[agentIndex].assignedProperties) agents[agentIndex].assignedProperties = [];
      if (!agents[agentIndex].assignedProperties.includes(propertyId)) {
        agents[agentIndex].assignedProperties.push(propertyId);
      }
      saveAgents(agents);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Klaster '${properties[propIndex].codeName}' berhasil dipasangkan ke PIC '${agents[agentIndex].name}'.`,
                propertyId,
                agentId,
                agentName: agents[agentIndex].name,
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (err: unknown) {
      return {
        content: [{ type: 'text', text: JSON.stringify({ success: false, error: getErrorMessage(err) }) }],
        isError: true,
      };
    }
  }
);

// Tool 7: tiar_rebuild_and_deploy
server.tool(
  'tiar_rebuild_and_deploy',
  'Jalankan static export Next.js lokal dan verifikasi output build 27+ rute untuk mempublikasikan data properti terbaru.',
  {
    commitMessage: z.string().optional().describe('Pesan keterangan update konten'),
    purgeCache: z.boolean().optional().describe('Opsi purge Cloudflare cache'),
  },
  async ({ commitMessage }) => {
    const startTime = Date.now();
    try {
      const buildCommand = 'node ./node_modules/next/dist/bin/next build';
      const output = execSync(buildCommand, {
        cwd: ROOT_DIR,
        encoding: 'utf-8',
        stdio: 'pipe',
      });

      const durationSec = ((Date.now() - startTime) / 1000).toFixed(1);
      const outDir = path.resolve(ROOT_DIR, 'out');
      const hasOut = fs.existsSync(outDir);

      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify(
              {
                success: true,
                message: `Static export Next.js selesai dalam ${durationSec} detik.`,
                commitMessage: commitMessage || 'Auto-update via Tiar MCP Server',
                outDirReady: hasOut,
                buildSummary: output.slice(-400),
              },
              null,
              2
            ),
          },
        ],
      };
    } catch (err: unknown) {
      const execErr = err as { stderr?: string; message?: string };
      return {
        content: [
          {
            type: 'text',
            text: JSON.stringify({
              success: false,
              error: 'Build gagal: ' + (execErr.stderr || getErrorMessage(err)),
            }),
          },
        ],
        isError: true,
      };
    }
  }
);

export async function startServer() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('[Tiar MCP Server] Berjalan pada transport stdio. Siap menerima instruksi AI Agent.');
}

export {
  server,
  checkGuardrails,
  loadProperties,
  saveProperties,
  loadAgents,
  saveAgents,
  FORBIDDEN_LEGAL_DEV_REGEX,
  FORBIDDEN_REAL_ESTATE_PATTERNS,
  FORBIDDEN_BLT_REGEX,
};

const entryFile = process.argv[1] || '';
const isMain = entryFile.endsWith('tiar-mcp-server.ts') || entryFile.endsWith('tiar-mcp-server.js');

if (isMain) {
  startServer().catch((err) => {
    console.error('[Tiar MCP Server] Fatal error:', err);
    process.exit(1);
  });
}
