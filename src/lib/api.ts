import { API_URL } from '../config';

// ── Tipos novos ────────────────────────────────────────────────────────────────

export type TicketStatus =
  | 'NAO_INICIADO'
  | 'EM_TRIAGEM'
  | 'AGUARDANDO_DENTISTA'
  | 'EM_ATENDIMENTO'
  | 'FINALIZADO'
  | 'CANCELADO';

export interface EventoHistorico {
  statusAnterior: TicketStatus | null;
  statusNovo: TicketStatus;
  autorRole: string;
  motivo: string | null;
  dataMudanca: string; // ISO 8601
}

export interface MetricasOperacionais {
  totalTickets: number | null;
  ticketsUltimos7d: number | null;
  tempoMedioAtribuicaoHoras: number | null;
  tempoMedioFechamentoHoras: number | null;
  distribuicaoPorStatus: Partial<Record<TicketStatus, number>>;
  topCidades: Array<{ cidade: string; total: number }>;
  topDentistas: Array<{ nome: string; atendimentos: number }>;
}

// ── HTTP helper ────────────────────────────────────────────────────────────────
// Escopo limitado: usado APENAS pelas APIs novas abaixo.
// As chamadas fetch() existentes nos dashboards não são migradas.

function request<T>(path: string, options?: RequestInit): Promise<T> {
  const token = sessionStorage.getItem('authToken') ?? '';
  const headers = new Headers(options?.headers);
  headers.set('Content-Type', 'application/json');
  if (token) headers.set('Authorization', `Bearer ${token}`);

  return fetch(`${API_URL}${path}`, { ...options, headers }).then(async res => {
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const text = await res.text();
    return (text ? JSON.parse(text) : undefined) as T;
  });
}

// ── APIs novas ─────────────────────────────────────────────────────────────────

export const pacientesApi = {
  atualizarStatus: (id: number, status: TicketStatus, motivo: string) =>
    request<void>(`/pacientes/${id}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status, motivo }),
    }),

  historicoTicket: (id: number) =>
    request<EventoHistorico[]>(`/pacientes/${id}/historico-ticket`),
};

export const relatoriosApi = {
  operacional: () => request<MetricasOperacionais>('/relatorios/operacional'),
};
