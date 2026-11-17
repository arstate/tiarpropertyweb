import agentsData from './agents.json';

export interface AgentProfile {
  id: string;
  name: string;
  role: string;
  photoUrl: string;
  phone: string;
  citySpecialist: 'Surabaya' | 'Sidoarjo' | 'Surabaya & Sidoarjo';
  areaFocus: string[];
  rating: number;
  totalDealsAssisted: number;
  badges: string[];
  bio: string;
  assignedProperties: string[];
  isActive: boolean;
  orderPriority: number;
}

export const TIAR_AGENTS: AgentProfile[] = agentsData as AgentProfile[];

export function getAgentById(id?: string): AgentProfile | undefined {
  if (!id) return undefined;
  return TIAR_AGENTS.find((agent) => agent.id === id);
}

export function getAgentForProperty(propertyId: string): AgentProfile {
  const agent = TIAR_AGENTS.find((a) => a.assignedProperties.includes(propertyId));
  return agent || TIAR_AGENTS[0];
}

export function getActiveAgents(): AgentProfile[] {
  return TIAR_AGENTS.filter((a) => a.isActive).sort((a, b) => a.orderPriority - b.orderPriority);
}

export function buildAgentWaUrl(
  agent?: AgentProfile,
  options?: { propertyName?: string; city?: string }
): string {
  const targetAgent = agent || TIAR_AGENTS[0];
  let message = '';
  if (options?.propertyName) {
    message = `Halo ${targetAgent.name}, saya lihat unit "${options.propertyName}" di website Tiar Property. Boleh minta tolong temenin survei ke lokasinya kak?`;
  } else if (options?.city) {
    message = `Halo ${targetAgent.name}, saya tertarik cari info perumahan di ${options.city}. Boleh minta tolong temenin cek pilihan unit dan promo DP 0% ya kak?`;
  } else {
    message = `Halo ${targetAgent.name}, saya ingin tanya info promo rumah DP 0% dan konsultasi estimasi cicilan di Tiar Property. Ada waktu buat nemenin saya survei lokasinya kak?`;
  }
  return `https://wa.me/${targetAgent.phone}?text=${encodeURIComponent(message)}`;
}
