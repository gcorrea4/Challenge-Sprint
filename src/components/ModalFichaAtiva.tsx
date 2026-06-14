import { useState } from 'react';
import {
  MapPin, CalendarCheck, Printer, Plus, Trash2, Ban,
  CheckCircle2, Send, Clock, Activity, X, AlertTriangle,
} from 'lucide-react';
import { TicketTimeline } from './ticket';
import { ChatPanel } from './ChatPanel';
import type { EventoHistorico } from '../lib/api';

interface HistoricoConsulta {
  id?: number;
  titulo?: string;
  status?: string;
  data?: string;
  hora?: string;
  proc?: string;
  dentista?: string;
}

interface Paciente {
  id: number;
  nome: string;
  idade: number;
  pais: string;
  cidade: string;
  tipo_dor: string;
  score_match: number;
  renda: number;
  tempo_dor: number;
  telefone?: string;
  historico?: HistoricoConsulta[];
}

interface SlotProposto {
  id: string;
  data: string;
  hora: string;
}

interface OfertaAgendamento {
  id?: number;
  dentistaNome: string;
  dentistaCidade: string;
  procedimento: string;
  slots: SlotProposto[];
  status: 'pendente' | 'confirmado';
  slotEscolhido?: { data: string; hora: string };
  criadaEm: string;
}

interface Props {
  ficha: Paciente;
  usuarioLogado: string;
  slotsPropostos: SlotProposto[];
  novaData: string;
  novaHora: string;
  procedimentoOferta: string;
  slotsOcupados: string[];
  slotsLivres: SlotProposto[];
  dataHoje: string;
  ofertaAtiva?: OfertaAgendamento;
  historicoTicket?: EventoHistorico[];
  carregandoHistorico?: boolean;
  onClose: () => void;
  onGerarRelatorio: (p: Paciente) => void;
  onAdicionarSlot: () => void;
  onRemoverSlot: (id: string) => void;
  onEnviarOferta: () => void;
  onCancelarOferta?: (ofertaId: number, pacienteNome: string) => void;
  setNovaData: (v: string) => void;
  setNovaHora: (v: string) => void;
  setProcedimentoOferta: (v: string) => void;
}

export function ModalFichaAtiva({
  ficha, usuarioLogado, slotsPropostos, novaData, novaHora, procedimentoOferta,
  slotsOcupados, slotsLivres, dataHoje, ofertaAtiva,
  historicoTicket = [], carregandoHistorico = false,
  onClose, onGerarRelatorio, onAdicionarSlot, onRemoverSlot, onEnviarOferta,
  onCancelarOferta, setNovaData, setNovaHora, setProcedimentoOferta,
}: Props) {
  const [confirmandoCancelamento, setConfirmandoCancelamento] = useState(false);
  const [abaAtiva, setAbaAtiva] = useState<'historico' | 'chat'>('historico');

  const handleCancelarOferta = () => {
    if (!ofertaAtiva?.id || !onCancelarOferta) return;
    onCancelarOferta(ofertaAtiva.id, ficha.nome);
    setConfirmandoCancelamento(false);
    onClose();
  };

  return (
    <div
      className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-end sm:items-center justify-center sm:p-4"
      onClick={onClose}
    >
      <div
        className="bg-white dark:bg-slate-900 w-full sm:max-w-4xl max-h-[92vh] rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-in"
        onClick={e => e.stopPropagation()}
      >
        {/* Drag handle — mobile only */}
        <div className="flex justify-center py-2.5 md:hidden flex-shrink-0">
          <div className="w-10 h-1 bg-gray-300 dark:bg-slate-600 rounded-full" />
        </div>

        {/* ── Painel esquerdo — agendamento ── */}
        <div className="flex-1 min-h-0 p-5 md:p-8 md:w-1/2 md:flex-none overflow-y-auto bg-white dark:bg-slate-900 border-b md:border-b-0 md:border-r border-gray-100 dark:border-slate-700">

          {/* Cabeçalho da ficha */}
          <div className="flex justify-between items-start mb-6 pb-6 border-b border-dashed border-gray-200 dark:border-slate-700">
            <div className="flex-1 min-w-0">
              <h3 className="text-2xl font-black text-gray-800 dark:text-white truncate">{ficha.nome}</h3>
              <p className="text-sm text-gray-500 dark:text-slate-400 flex items-center gap-2 mt-1">
                <MapPin size={14} /> {ficha.cidade}, {ficha.pais}
              </p>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs bg-orange-50 dark:bg-orange-950/30 text-orange-600 dark:text-orange-400 font-bold px-2 py-0.5 rounded-md border border-orange-100 dark:border-orange-900/40">
                  {ficha.tipo_dor}
                </span>
                <span className="text-xs bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 font-bold px-2 py-0.5 rounded-md border border-slate-100 dark:border-slate-700">
                  {ficha.tempo_dor} dias de dor
                </span>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 ml-3 flex-shrink-0">
              <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/40 text-orange-500 dark:text-orange-400 rounded-xl flex items-center justify-center font-black text-xl border-2 border-orange-200 dark:border-orange-900/50">
                {ficha.idade}
              </div>
              <button
                onClick={() => onGerarRelatorio(ficha)}
                className="flex items-center gap-1 text-[10px] font-bold text-gray-400 dark:text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 border border-gray-200 dark:border-slate-700 hover:border-blue-300 px-2 py-1 rounded-lg transition-all uppercase tracking-wide"
              >
                <Printer size={12} /> Relatório
              </button>
            </div>
          </div>

          <div className="space-y-5">

            {/* Status da oferta atual */}
            {ofertaAtiva && (
              <div className={`p-4 rounded-xl border text-sm ${
                ofertaAtiva.status === 'confirmado'
                  ? 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/40'
                  : 'bg-orange-50 dark:bg-orange-950/30 border-orange-200 dark:border-orange-900/40'
              }`}>
                <p className="font-bold text-gray-700 dark:text-slate-200 flex items-center gap-2 mb-1">
                  {ofertaAtiva.status === 'confirmado'
                    ? <><CheckCircle2 size={16} className="text-green-500" /> Consulta confirmada pelo paciente!</>
                    : <><Clock size={16} className="text-[#FF8C00]" /> Proposta enviada — aguardando escolha do paciente</>}
                </p>
                <p className="text-gray-500 dark:text-slate-400 text-xs">{ofertaAtiva.procedimento}</p>
                {ofertaAtiva.status === 'confirmado' && ofertaAtiva.slotEscolhido && (
                  <p className="text-green-700 dark:text-green-400 font-bold text-xs mt-1">
                    📅 {ofertaAtiva.slotEscolhido.data.split('-').reverse().join('/')} às {ofertaAtiva.slotEscolhido.hora}
                  </p>
                )}
                {ofertaAtiva.status === 'pendente' && (
                  <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">
                    {ofertaAtiva.slots.length} opção(ões) enviada(s)
                  </p>
                )}

                {/* Botão cancelar oferta pendente */}
                {ofertaAtiva.status === 'pendente' && ofertaAtiva.id && onCancelarOferta && (
                  <div className="mt-3 pt-3 border-t border-orange-200 dark:border-orange-900/40">
                    {!confirmandoCancelamento ? (
                      <button
                        type="button"
                        onClick={() => setConfirmandoCancelamento(true)}
                        className="text-xs text-red-500 dark:text-red-400 font-bold hover:text-red-700 flex items-center gap-1 transition-colors"
                      >
                        <X size={12} /> Cancelar proposta enviada
                      </button>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-xs font-bold text-red-600 dark:text-red-400 flex items-center gap-1">
                          <AlertTriangle size={12} /> Confirmar cancelamento?
                        </p>
                        <div className="flex gap-2">
                          <button
                            type="button"
                            onClick={() => setConfirmandoCancelamento(false)}
                            className="flex-1 text-xs py-1.5 rounded-lg border border-gray-200 dark:border-slate-600 text-gray-600 dark:text-slate-300 font-bold hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                          >
                            Voltar
                          </button>
                          <button
                            type="button"
                            onClick={handleCancelarOferta}
                            className="flex-1 text-xs py-1.5 rounded-lg bg-red-500 text-white font-bold hover:bg-red-600 transition-colors"
                          >
                            Sim, cancelar
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Formulário de nova proposta — só aparece se não há oferta ativa */}
            {!ofertaAtiva && (<>
              <h4 className="font-bold text-gray-800 dark:text-white flex items-center gap-2">
                <CalendarCheck size={18} className="text-[#8dc63f]" /> Propor Horários ao Paciente
              </h4>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Procedimento</label>
                <select
                  value={procedimentoOferta}
                  onChange={e => setProcedimentoOferta(e.target.value)}
                  className="w-full bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-600 rounded-xl px-4 py-3 text-sm text-gray-700 dark:text-slate-200 outline-none focus:border-[#FF8C00] appearance-none cursor-pointer"
                >
                  <option>Primeira Consulta - Avaliação</option>
                  <option>Restauração (Cárie)</option>
                  <option>Limpeza (Profilaxia)</option>
                  <option>Canal (Endodontia)</option>
                  <option>Extração Simples</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-gray-500 dark:text-slate-400 mb-1.5 uppercase tracking-wide">Adicionar Opção de Horário</label>
                <div className="flex gap-2">
                  <input
                    type="date" min={dataHoje} value={novaData}
                    onChange={e => setNovaData(e.target.value)}
                    className="flex-1 bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-slate-600 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#FF8C00]"
                  />
                  <input
                    type="time" value={novaHora}
                    onChange={e => setNovaHora(e.target.value)}
                    className="w-[110px] bg-gray-50 dark:bg-slate-800 dark:text-white dark:border-slate-600 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-700 outline-none focus:border-[#FF8C00]"
                  />
                  <button
                    type="button" onClick={onAdicionarSlot}
                    className="bg-[#FF8C00] text-white p-2.5 rounded-xl hover:bg-[#E67E22] transition-colors flex-shrink-0"
                  >
                    <Plus size={18} />
                  </button>
                </div>
                <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5">Adicione várias opções para o paciente escolher a melhor.</p>
              </div>

              {slotsPropostos.length > 0 && (
                <div className="space-y-2">
                  <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wide">Horários na proposta:</p>
                  {slotsPropostos.map(slot => {
                    const ocupado = slotsOcupados.includes(`${slot.data}|${slot.hora}`);
                    return (
                      <div key={slot.id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium ${ocupado ? 'bg-red-50 dark:bg-red-950/30 border-red-200 dark:border-red-900/40 text-red-600 dark:text-red-400' : 'bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/40 text-green-700 dark:text-green-400'}`}>
                        <span className="flex items-center gap-2">
                          {ocupado ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                          {slot.data.split('-').reverse().join('/')} às {slot.hora}
                          {ocupado && <span className="text-[10px] font-bold uppercase bg-red-100 text-red-500 px-2 py-0.5 rounded ml-1">Ocupado</span>}
                        </span>
                        <button
                          type="button" onClick={() => onRemoverSlot(slot.id)}
                          className="text-gray-300 hover:text-red-500 ml-2 transition-colors"
                        >
                          <Trash2 size={15} />
                        </button>
                      </div>
                    );
                  })}
                </div>
              )}

              <button
                type="button" onClick={onEnviarOferta}
                disabled={slotsLivres.length === 0}
                className="w-full bg-[#8dc63f] text-white font-bold py-4 rounded-xl hover:bg-[#7ebd34] transition-colors shadow-sm flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed"
              >
                <Send size={18} />
                Enviar Proposta ao Paciente
                {slotsLivres.length > 0 && (
                  <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                    {slotsLivres.length} opção(ões)
                  </span>
                )}
              </button>
            </>)}
          </div>
        </div>

        {/* ── Painel direito — abas Histórico / Chat ── */}
        <div className="flex-1 min-h-0 flex flex-col md:w-1/2 md:flex-none overflow-hidden bg-gray-50/50 dark:bg-slate-800/50">

          {/* Tab bar */}
          <div className="flex items-center border-b border-gray-100 dark:border-slate-700 px-4 pt-4 gap-1 flex-shrink-0">
            {(['historico', 'chat'] as const).map(aba => (
              <button
                key={aba}
                onClick={() => setAbaAtiva(aba)}
                className={`px-4 py-2 rounded-t-xl text-xs font-black uppercase tracking-wider transition-all ${
                  abaAtiva === aba
                    ? 'bg-white dark:bg-slate-900 text-orange-500 dark:text-orange-400 border-b-2 border-orange-500'
                    : 'text-gray-400 dark:text-slate-500 hover:text-gray-600 dark:hover:text-slate-300'
                }`}
              >
                {aba === 'historico' ? '📋 Histórico' : '💬 Chat'}
              </button>
            ))}
            <button onClick={onClose} className="ml-auto text-gray-400 dark:text-slate-500 hover:text-red-500 transition-colors p-1">
              <X size={20} />
            </button>
          </div>

          {/* Conteúdo das abas */}
          <div className="flex-1 min-h-0 overflow-hidden">
            {abaAtiva === 'historico' ? (
              <div className="h-full overflow-y-auto p-5 md:p-8">
                <h3 className="text-lg font-bold text-gray-800 dark:text-white flex items-center gap-2 mb-6">
                  <Activity size={20} className="text-[#8dc63f]" /> Histórico de Tratamento
                </h3>

                {/* Linha do tempo de status do ticket */}
                {(carregandoHistorico || historicoTicket.length > 0) && (
                  <div className="mb-6">
                    <p className="text-[11px] font-bold text-gray-400 dark:text-slate-500 uppercase tracking-wider mb-3">Status do Ticket</p>
                    <TicketTimeline eventos={historicoTicket} loading={carregandoHistorico} />
                  </div>
                )}

                <div className="relative border-l-2 border-gray-200 dark:border-slate-700 ml-3 space-y-6">
                  {ficha.historico && ficha.historico.length > 0 ? (
                    ficha.historico.map((item, idx) => (
                      <div key={idx} className="relative pl-6 animate-fade-in">
                        <div className={`absolute w-5 h-5 rounded-full -left-[11px] top-0.5 border-4 border-white dark:border-slate-800 shadow-sm ${item.status === 'Agendado' ? 'bg-[#FF8C00]' : 'bg-[#8dc63f]'}`} />
                        <p className="text-xs font-bold text-gray-400 dark:text-slate-500 mb-1">{item.data}</p>
                        <div className={`p-4 rounded-xl border ${item.status === 'Agendado' ? 'bg-orange-50 dark:bg-orange-950/30 border-orange-100 dark:border-orange-900/40' : 'bg-white dark:bg-slate-800 border-gray-100 dark:border-slate-700 shadow-sm'}`}>
                          <div className="flex items-center justify-between mb-1">
                            <h4 className={`font-bold text-sm ${item.status === 'Agendado' ? 'text-orange-800 dark:text-orange-300' : 'text-gray-800 dark:text-white'}`}>
                              {item.proc || item.titulo}
                            </h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-0.5 rounded-full ${item.status === 'Agendado' ? 'bg-orange-100 dark:bg-orange-950/50 text-orange-600 dark:text-orange-400' : 'bg-green-100 dark:bg-green-950/50 text-green-600 dark:text-green-400'}`}>
                              {item.status}
                            </span>
                          </div>
                          {item.hora && (
                            <p className="text-xs text-gray-500 dark:text-slate-400 flex items-center gap-1 mt-1">
                              <Clock size={11} /> {item.hora}
                            </p>
                          )}
                          <p className={`text-xs mt-1 ${item.status === 'Agendado' ? 'text-orange-600 dark:text-orange-400' : 'text-gray-500 dark:text-slate-400'}`}>
                            Dr(a). {item.dentista}
                          </p>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="text-center py-10">
                      <Activity size={32} className="text-gray-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-gray-500 dark:text-slate-400 font-medium text-sm">Nenhum histórico ainda.</p>
                      <p className="text-gray-400 dark:text-slate-500 text-xs mt-1">O histórico aparecerá aqui quando for agendado algum procedimento.</p>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <ChatPanel
                idPaciente={ficha.id}
                autorRole="dentista"
                autorNome={usuarioLogado}
              />
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
