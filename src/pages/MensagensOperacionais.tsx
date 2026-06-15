import { useState, useEffect } from 'react';
import { AlertTriangle, RefreshCw, MessageSquare, Mail } from 'lucide-react';
import { Skeleton } from '../components/ui';
import { relatoriosApi, mensagensApi, type MensagemSite } from '../lib/api';
import type { MetricasOperacionais as MetricasDados } from '../lib/api';

const CANAL_ORIGEM_MSG_CONFIG: Record<string, { label: string; cor: string }> = {
  WEB:        { label: 'Web',        cor: '#3b82f6' },
  TELEGRAM:   { label: 'Telegram',   cor: '#0088cc' },
  APP:        { label: 'App',        cor: '#22c55e' },
  PRESENCIAL: { label: 'Presencial', cor: '#f97316' },
  TELEFONE:   { label: 'Telefone',   cor: '#a855f7' },
};

export function MensagensOperacionais() {
  const [dados, setDados] = useState<MetricasDados | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(false);
  const [tentativa, setTentativa] = useState(0);
  const [mensagens, setMensagens] = useState<MensagemSite[]>([]);
  const [carregandoLista, setCarregandoLista] = useState(true);

  const carregar = () => {
    setCarregando(true);
    setErro(false);
    setDados(null);
    setTentativa(t => t + 1);
  };

  useEffect(() => {
    let live = true;
    relatoriosApi.operacional()
      .then(d => { if (!live) return; setDados(d); setCarregando(false); })
      .catch(() => { if (!live) return; setErro(true); setCarregando(false); });
    return () => { live = false; };
  }, [tentativa]);

  useEffect(() => {
    setCarregandoLista(true);
    mensagensApi.listar()
      .then(data => setMensagens(Array.isArray(data) ? data : []))
      .catch(() => setMensagens([]))
      .finally(() => setCarregandoLista(false));
  }, [tentativa]);

  if (carregando) {
    return (
      <div className="space-y-6 animate-fade-in">
        <Skeleton variant="card" className="h-32" />
        <Skeleton variant="card" className="h-40" />
        <Skeleton variant="card" className="h-48" />
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
          <p className="font-bold text-gray-800 dark:text-white mb-1">Não foi possível carregar as mensagens</p>
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

  const categoriaItens = (Object.entries(dados?.mensagens?.por_categoria ?? {}) as [string, number][])
    .filter(([, n]) => (n ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));

  const canalOrigemMsgItens = (Object.entries(dados?.mensagens?.por_canal_origem ?? {}) as [string, number][])
    .filter(([, n]) => (n ?? 0) > 0)
    .sort(([, a], [, b]) => (b ?? 0) - (a ?? 0));
  const totalCanalOrigemMsg = canalOrigemMsgItens.reduce((acc, [, n]) => acc + n, 0);

  return (
    <div className="space-y-8 animate-fade-in">

      {/* Cabeçalho */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white">Mensagens</h2>
        <p className="text-sm text-gray-500 dark:text-slate-400 mt-1">
          Atualizado ao abrir a aba — cache de 60s no servidor.
        </p>
      </div>

      {/* KPI — Mensagens Recebidas */}
      <div className="bg-white dark:bg-slate-900/50 p-6 rounded-xl border border-gray-100 dark:border-slate-700/40 border-l-4 border-l-purple-500 shadow-sm flex items-center gap-6">
        <div className="w-12 h-12 rounded-xl bg-purple-500/10 flex items-center justify-center shrink-0">
          <MessageSquare size={22} className="text-purple-500" />
        </div>
        <div>
          <p className="text-gray-500 dark:text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">Mensagens Recebidas</p>
          <p className="text-4xl font-bold text-gray-800 dark:text-white leading-none">{dados?.mensagens?.total ?? 0}</p>
          <p className="text-[11px] text-gray-400 dark:text-slate-500 mt-1">total de mensagens no sistema</p>
        </div>
      </div>

      {/* Mensagens por Categoria */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/40 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Mensagens por Categoria</h3>
          <span className="text-sm font-bold text-gray-500 dark:text-slate-400 tabular-nums">
            {dados?.mensagens?.total ?? 0} total
          </span>
        </div>
        {categoriaItens.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Nenhum dado disponível.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {categoriaItens.map(([categoria, count]) => (
              <div
                key={categoria}
                className="flex items-center gap-2 bg-gray-50 dark:bg-slate-700/50 rounded-xl px-4 py-3 border border-gray-100 dark:border-slate-600"
              >
                <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                  {categoria.charAt(0) + categoria.slice(1).toLowerCase()}
                </span>
                <span className="text-lg font-black text-orange-500">{count}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Canal de Origem das Mensagens */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/40 shadow-sm p-6">
        <div className="flex items-center justify-between mb-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">Canal de Origem das Mensagens</h3>
          <span className="text-sm font-bold text-gray-500 dark:text-slate-400 tabular-nums">
            {totalCanalOrigemMsg} total
          </span>
        </div>
        {canalOrigemMsgItens.length === 0 ? (
          <p className="text-sm text-gray-400 dark:text-slate-500 text-center py-6">Nenhum dado disponível.</p>
        ) : (
          <div className="space-y-4">
            {canalOrigemMsgItens.map(([key, count]) => {
              const cfg = CANAL_ORIGEM_MSG_CONFIG[key];
              const cor = cfg?.cor ?? '#94a3b8';
              const pct = totalCanalOrigemMsg > 0 ? (count / totalCanalOrigemMsg) * 100 : 0;
              return (
                <div key={key}>
                  <div className="flex justify-between items-center mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: cor }} aria-hidden="true" />
                      <span className="text-sm font-bold text-gray-700 dark:text-slate-200">
                        {cfg?.label ?? key}
                      </span>
                    </div>
                    <span className="text-xs font-bold text-gray-500 dark:text-slate-400 tabular-nums">
                      {count} ({pct.toFixed(0)}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-100 dark:bg-slate-700 rounded-full h-3 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all duration-700"
                      style={{ width: `${pct > 0 ? Math.max(pct, 2) : 0}%`, backgroundColor: cor }}
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

      {/* Lista de mensagens recebidas */}
      <div className="bg-white dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700/40 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-100 dark:border-slate-700/40 flex items-center justify-between">
          <h3 className="text-xs font-bold uppercase tracking-wider text-gray-500 dark:text-slate-400">
            Mensagens Recebidas
          </h3>
          <span className="text-sm font-bold text-gray-400 dark:text-slate-500">{mensagens.length} total</span>
        </div>

        {carregandoLista ? (
          <div className="p-6 space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} variant="card" className="h-20" />)}
          </div>
        ) : mensagens.length === 0 ? (
          <div className="py-12 text-center text-sm text-gray-400 dark:text-slate-500">
            Nenhuma mensagem recebida ainda.
          </div>
        ) : (
          <div className="divide-y divide-gray-50 dark:divide-slate-800 max-h-[500px] overflow-y-auto">
            {mensagens.map(msg => (
              <div key={msg.id} className="px-6 py-4 hover:bg-gray-50 dark:hover:bg-slate-800/40 transition-colors">
                <div className="flex items-start justify-between gap-4 mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-orange-100 dark:bg-orange-950/40 text-orange-500 flex items-center justify-center font-bold text-sm flex-shrink-0">
                      {(msg.nome ?? '?').charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <p className="font-bold text-sm text-gray-800 dark:text-white">{msg.nome}</p>
                      <p className="text-xs text-gray-400 dark:text-slate-500 flex items-center gap-1">
                        <Mail size={10} /> {msg.email}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {msg.categoria && (
                      <span className="text-[10px] font-bold bg-orange-50 dark:bg-orange-950/30 text-orange-500 border border-orange-100 dark:border-orange-900/40 px-2 py-0.5 rounded-full">
                        {msg.categoria}
                      </span>
                    )}
                    {msg.canalOrigem && (
                      <span className="text-[10px] font-bold bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-300 px-2 py-0.5 rounded-full">
                        {msg.canalOrigem}
                      </span>
                    )}
                  </div>
                </div>
                <p className="text-xs font-bold text-gray-600 dark:text-slate-300 mb-1">{msg.assunto}</p>
                <p className="text-sm text-gray-500 dark:text-slate-400 leading-relaxed line-clamp-2">{msg.mensagem}</p>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
}
