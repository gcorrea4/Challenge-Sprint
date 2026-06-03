import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, Clock, CheckCircle2, TrendingUp, Layers } from 'lucide-react';
import { Skeleton } from '../components/ui';
import { relatoriosApi } from '../lib/api';
import type { MetricasOperacionais as MetricasDados, TicketStatus } from '../lib/api';
import { TICKET_STATUS_CONFIG } from '../utils/ticketStatusConfig';

function formatarHoras(horas: number): string {
  if (horas < 1) return '< 1h';
  if (horas < 24) return `${Math.round(horas)}h`;
  const dias = Math.floor(horas / 24);
  const h = Math.round(horas % 24);
  return h > 0 ? `${dias}d ${h}h` : `${dias}d`;
}

function KPICard({
  label, valor, icone, corIcone, descricao,
}: {
  label: string;
  valor: string;
  icone: React.ReactNode;
  corIcone: string;
  descricao?: string;
}) {
  return (
    <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm">
      <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${corIcone}`}>
        {icone}
      </div>
      <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</p>
      <p className="text-3xl font-black text-gray-800 dark:text-white leading-none">{valor}</p>
      {descricao && (
        <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1.5 leading-snug">{descricao}</p>
      )}
    </div>
  );
}

export function MetricasOperacionais() {
  const [dados, setDados] = useState<MetricasDados | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  // Incrementar dispara nova busca — setState fora do effect é permitido
  const [tentativa, setTentativa] = useState(0);

  const carregar = () => {
    setCarregando(true);
    setErro(false);
    setDados(null);
    setTentativa(t => t + 1);
  };

  // Apenas callbacks assíncronos dentro do effect — sem setState síncrono
  useEffect(() => {
    let live = true;
    relatoriosApi.operacional()
      .then(d => {
        if (!live) return;
        setDados(d);
        setCarregando(false);
      })
      .catch(() => {
        if (!live) return;
        setErro(true);
        setCarregando(false);
      });
    return () => { live = false; };
  }, [tentativa]);

  if (carregando) {
    return (
      <div className="space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map(i => <Skeleton key={i} variant="card" className="h-32" />)}
        </div>
        <Skeleton variant="card" className="h-48" />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Skeleton variant="card" className="h-56" />
          <Skeleton variant="card" className="h-56" />
        </div>
      </div>
    );
  }

  if (erro) {
    return (
      <div className="flex flex-col items-center justify-center py-20 gap-4 text-center">
        <div className="bg-red-50 dark:bg-red-950/30 p-4 rounded-full">
          <AlertTriangle size={32} className="text-red-500" />
        </div>
        <div>
          <p className="font-bold text-gray-800 dark:text-white mb-1">Não foi possível carregar as métricas</p>
          <p className="text-sm text-gray-500 dark:text-slate-400">Verifique a conexão com o servidor.</p>
        </div>
        <button
          onClick={carregar}
          className="flex items-center gap-2 px-5 py-2.5 bg-orange-500 hover:bg-orange-600 text-white font-bold rounded-xl text-sm transition-colors"
        >
          <RefreshCw size={15} /> Tentar novamente
        </button>
      </div>
    );
  }

  // Distribuição por status — ordenada por volume desc
  const distStatus = dados?.distribuicaoPorStatus ?? {};
  const totalDist = Object.values(distStatus).reduce<number>((acc, n) => acc + (n ?? 0), 0);
  const statusOrdenados = (Object.entries(distStatus) as [TicketStatus, number][])
    .filter(([, n]) => (n ?? 0) > 0)
    .sort(([, a], [, b]) => b - a);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Métricas Operacionais</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Atualizado ao abrir a aba — cache de 60s no servidor.
        </p>
      </div>

      {/* Linha 1 — 4 KPI cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <KPICard
          label="Total de Tickets"
          valor={String(dados?.totalTickets ?? 0)}
          icone={<Layers size={20} className="text-orange-600" />}
          corIcone="bg-orange-100 dark:bg-orange-950/40"
        />
        <KPICard
          label="Tickets — últimos 7d"
          valor={String(dados?.ticketsUltimos7d ?? 0)}
          icone={<TrendingUp size={20} className="text-green-600" />}
          corIcone="bg-green-100 dark:bg-green-950/40"
          descricao="novos casos na última semana"
        />
        <KPICard
          label="Tempo Médio Atribuição"
          valor={dados?.tempoMedioAtribuicaoHoras != null
            ? formatarHoras(dados.tempoMedioAtribuicaoHoras)
            : 'N/D'}
          icone={<Clock size={20} className="text-blue-600" />}
          corIcone="bg-blue-100 dark:bg-blue-950/40"
          descricao="da abertura até dentista adotar"
        />
        <KPICard
          label="Tempo Médio Fechamento"
          valor={dados?.tempoMedioFechamentoHoras != null
            ? formatarHoras(dados.tempoMedioFechamentoHoras)
            : 'N/D'}
          icone={<CheckCircle2 size={20} className="text-purple-600" />}
          corIcone="bg-purple-100 dark:bg-purple-950/40"
          descricao="da abertura até finalizar"
        />
      </div>

      {/* Linha 2 — Distribuição por status (CSS puro, sem biblioteca) */}
      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
        <h3 className="font-bold text-gray-800 dark:text-white mb-5 text-lg">Distribuição por Status</h3>
        {statusOrdenados.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">
            Nenhum dado disponível.
          </p>
        ) : (
          <div className="space-y-4">
            {statusOrdenados.map(([status, count]) => {
              const cfg = TICKET_STATUS_CONFIG[status];
              const pct = totalDist > 0 ? (count / totalDist) * 100 : 0;
              const Icone = cfg?.icone;
              return (
                <div key={status}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      {Icone && <Icone size={13} className="text-gray-500 dark:text-slate-400" aria-hidden="true" />}
                      <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                        {cfg?.label ?? status}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400 tabular-nums">
                      {count} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${cfg?.cor ?? 'bg-slate-400 text-white'}`}
                      style={{ width: `${pct > 0 ? Math.max(pct, 2) : 0}%` }}
                      role="progressbar"
                      aria-valuenow={Math.round(pct)}
                      aria-valuemin={0}
                      aria-valuemax={100}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Linha 3 — Top cidades + Top dentistas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        {/* Top cidades */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">Top Cidades</h3>
          {(!dados?.topCidades || dados.topCidades.length === 0) ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Sem dados.</p>
          ) : (
            <ol className="space-y-3">
              {dados.topCidades.slice(0, 8).map((item, i) => (
                <li key={item.cidade} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                    i === 0
                      ? 'bg-orange-500 text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-slate-200 truncate">
                    {item.cidade}
                  </span>
                  <span className="text-sm font-bold text-gray-800 dark:text-white shrink-0 tabular-nums">
                    {item.total}
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

        {/* Top dentistas */}
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-gray-100 dark:border-slate-700 shadow-sm p-6">
          <h3 className="font-bold text-gray-800 dark:text-white mb-4 text-lg">Top Dentistas Voluntários</h3>
          {(!dados?.topDentistas || dados.topDentistas.length === 0) ? (
            <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Sem dados.</p>
          ) : (
            <ol className="space-y-3">
              {dados.topDentistas.slice(0, 8).map((item, i) => (
                <li key={item.nome} className="flex items-center gap-3">
                  <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-black shrink-0 ${
                    i === 0
                      ? 'bg-[#8dc63f] text-white'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-500 dark:text-slate-400'
                  }`}>
                    {i + 1}
                  </span>
                  <span className="flex-1 text-sm font-medium text-gray-700 dark:text-slate-200 truncate">
                    {item.nome}
                  </span>
                  <span className="text-xs font-bold text-gray-400 dark:text-slate-500 shrink-0 tabular-nums">
                    {item.atendimentos} atend.
                  </span>
                </li>
              ))}
            </ol>
          )}
        </div>

      </div>
    </div>
  );
}
