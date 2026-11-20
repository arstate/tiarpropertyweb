export const FORBIDDEN_LEGAL_DEV_REGEX = /\b(pt\s*\.?\s*)?trimitra(\s+manunggal\s+jaya)?\b/i;

export const FORBIDDEN_REAL_ESTATE_PATTERNS: RegExp[] = [
  /\bgrand\s+park\s+anggaswangi\b/i,
  /\bgrand\s+masangan\s+permai\b/i,
  /\bgrand\s+east\s+residence\b/i,
  /\b(cluster\s+)?hazel\b/i,
  /\btampak\s+siring\b/i,
  /\bpuri\s+gading(\s+mas\s+raya)?\b/i,
  /\balera\s+grove\b/i,
  /\b(klopo|kelopo)\s+sepuluh\b/i,
  /\b(gmp|ger|pgmr|gpa)\b/i,
];

export const FORBIDDEN_BLT_REGEX = /\b(blt|bantuan\s+likuiditas\s+transaksi)\b/i;

export function validateTiarGuardrails(input: unknown): { ok: true } | { ok: false; reason: string } {
  const text = typeof input === 'string' ? input : JSON.stringify(input);

  if (FORBIDDEN_LEGAL_DEV_REGEX.test(text)) {
    return {
      ok: false,
      reason:
        'Pelanggaran Information Gap Protocol: Dilarang menyebutkan nama legal developer PT Trimitra / Trimitra Manunggal Jaya. Wajib gunakan nama samaran strategis bernilai jual tinggi (contoh: "Cluster Modern Sukodono", "Cluster Elit Juanda").',
    };
  }

  for (const pattern of FORBIDDEN_REAL_ESTATE_PATTERNS) {
    if (pattern.test(text)) {
      return {
        ok: false,
        reason:
          'Pelanggaran Information Gap Protocol: Dilarang menyebutkan nama perumahan asli (seperti Grand Park Anggaswangi, Grand Masangan Permai, Grand East Residence, Cluster Hazel, Tampak Siring, Alera Grove, Puri Gading Mas Raya). Wajib gunakan nama samaran strategis bernilai jual tinggi (contoh: "Cluster Modern Sukodono", "Cluster Minimalis Juanda", "Cluster Sultan MERR").',
      };
    }
  }

  if (FORBIDDEN_BLT_REGEX.test(text)) {
    return {
      ok: false,
      reason:
        'Pelanggaran Protokol Kerahasiaan: Dilarang mencantumkan kata "BLT" (Bantuan Likuiditas Transaksi) atau nominal insentif komisi internal marketing kepada konsumen/publik!',
    };
  }

  return { ok: true };
}
