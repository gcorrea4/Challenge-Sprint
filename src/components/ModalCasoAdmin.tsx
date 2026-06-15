import { useState } from 'react';
import { X, MapPin, Activity, Clock, DollarSign } from 'lucide-react';
import { ChatPanel } from './ChatPanel';
import { TicketTimeline, TicketBadge } from './ticket';
import type { EventoHistorico, TicketStatus } from '../lib/api';

interface PacienteAdmin {
  id: number;
  nome?: string;
  nomePaciente?: string;
  email: string;
  cidade: string;
  pais?: string;
  statusTicket?: TicketStatus;
  tipoDor?: string;
  tempoDor?: number;
  renda?: number;
  idade?: number;
  score_match?: number;
}

interface Props {
  paciente: PacienteAdmin;
  historicoTicket: EventoHistorico[];
  carregandoHistorico: boolean;
  abaInicial?: 'caso' | 'historico' | 'chat';
  onClose: () => void;
}

export function ModalCasoAdmin({ paciente, historicoTicket, carregandoHistorico, abaInicial = 'caso', onClose }: Props) {
  const [abaAtiva, setAbaAtiva] = useState<'caso' | 'historico' | 'chat'>(abaInicial);
  const nome = paciente.nomePaciente || paciente.nome || '?';

  return (
    <div
      className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[2000] flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full sm:max-w-3xl max-h-[90vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100 dark:border-slate-800 flex-shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-400 to-orange-600 rounded-xl text-white flex items-center justify-center font-black text-lg">
              {nome.charAt(0).toUpperCase()}
            </div>
            <div>
              <h3 className="text-lg font-black text-gray-800 dark:text-white">{nome}</h3>
              <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1 mt-0.5">
                <MapPin size={11} /> {paciente.cidade}{paciente.pais ? `, ${paciente.pais}` : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {paciente.statusTicket && <TicketBadge status={paciente.statusTicket} size="sm" />}
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-gray-100 dark:bg-slate-800 text-gray-500 dark:text-slate-400 hover:bg-gray-200 dark:hover:bg-slate-700 flex items-center justify-center transition-colors"
            >
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Tab bar */}
        <div className="flex border-b border-gray-100 dark:border-slate-800 px-4 gap-1 flex-shrink-0">
          {([
            { id: 'caso',      label: '📁 Caso' },
            { id: 'historico', label: '📋 Histórico' },
            { id: 'chat',      label: '💬 Chat' },
          ] as const).map(aba => (
            <button
              key={aba.id}
              onClick={() => setAbaAtiva(aba.id)}
              className={`px-4 py-3 text-xs font-black uppercase tracking-wider transition-all border-b-2 -mb-px ${
                abaAtiva === aba.id
                  ? 'text-orange-500 border-orange-500'
                  : 'text-gray-400 dark:text-slate-500 border-transparent hover:text-gray-600 dark:hover:text-slate-300'
              }`}
            >
              {aba.label}
            </button>
          ))}
        </div>

        {/* Conteúdo */}
        <div className="flex-1 min-h-0 overflow-hidden">

          {/* Aba Caso */}
          {abaAtiva === 'caso' && (
            <div className="h-full overflow-y-auto p-6 space-y-4">
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {[
                  { label: 'E-mail',       value: paciente.email,                           icon: <Activity size={14} /> },
                  { label: 'Tipo de Dor',  value: paciente.tipoDor ?? '—',                  icon: <Activity size={14} /> },
                  { label: 'Tempo de Dor', value: paciente.tempoDor ? `${paciente.tempoDor} dias` : '—', icon: <Clock size={14} /> },
                  { label: 'Renda',        value: paciente.renda ? `${paciente.renda}x SM` : '—', icon: <DollarSign size={14} /> },
                  { label: 'Idade',        value: paciente.idade ? `${paciente.idade} anos` : '—', icon: <Activity size={14} /> },
                  { label: 'Score Match',  value: paciente.score_match ? `${paciente.score_match}` : '—', icon: <Activity size={14} /> },
                ].map(item => (
                  <div key={item.label} className="bg-gray-50 dark:bg-slate-800 rounded-xl p-4 border border-gray-100 dark:border-slate-700">
                    <p className="text-[10px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-1 flex items-center gap-1">
                      {item.icon} {item.label}
                    </p>
                    <p className="text-sm font-bold text-gray-800 dark:text-white">{item.value}</p>
                  </div>
                ))}
              </div>

              {/* Ticket ID */}
              <div className="bg-orange-50 dark:bg-orange-950/20 border border-orange-100 dark:border-orange-900/30 rounded-xl px-5 py-4">
                <p className="text-[10px] font-black text-orange-500 uppercase tracking-wider mb-1">Identificador do Caso</p>
                <p className="text-2xl font-black text-orange-600 dark:text-orange-400 font-mono">
                  TDB-{new Date().getFullYear()}-{String(paciente.id).padStart(5, '0')}
                </p>
                <p className="text-xs text-orange-400 dark:text-orange-500 mt-1">ID interno: #{paciente.id}</p>
              </div>
            </div>
          )}

          {/* Aba Histórico */}
          {abaAtiva === 'historico' && (
            <div className="h-full overflow-y-auto p-6">
              {carregandoHistorico ? (
                <div className="flex items-center justify-center h-32 text-gray-400 dark:text-slate-500 text-sm">
                  Carregando histórico...
                </div>
              ) : historicoTicket.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-32 gap-2 text-center">
                  <Activity size={28} className="text-gray-300 dark:text-slate-600" />
                  <p className="text-sm text-gray-400 dark:text-slate-500">Nenhuma transição de status ainda.</p>
                </div>
              ) : (
                <TicketTimeline eventos={historicoTicket} loading={carregandoHistorico} />
              )}
            </div>
          )}

          {/* Aba Chat */}
          {abaAtiva === 'chat' && (
            <ChatPanel
              idPaciente={paciente.id}
              autorRole="admin"
              autorNome="Equipe TdB"
            />
          )}

        </div>
      </div>
    </div>
  );
}
