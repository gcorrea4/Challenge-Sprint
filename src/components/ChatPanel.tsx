import { useState, useEffect, useRef } from 'react';
import { Send, MessageSquare, Loader2 } from 'lucide-react';
import { chatApi, type ChatMensagem } from '../lib/api';

interface Props {
  idPaciente: number;
  autorRole: 'dentista' | 'paciente';
  autorNome: string;
}

export function ChatPanel({ idPaciente, autorRole, autorNome }: Props) {
  const [mensagens, setMensagens] = useState<ChatMensagem[]>([]);
  const [texto, setTexto] = useState('');
  const [enviando, setEnviando] = useState(false);
  const [carregando, setCarregando] = useState(true);
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const buscar = async () => {
    try {
      const data = await chatApi.listar(idPaciente);
      setMensagens(data);
    } catch {
      // silencia erros de polling
    } finally {
      setCarregando(false);
    }
  };

  useEffect(() => {
    buscar();
    const interval = setInterval(buscar, 4000);
    return () => clearInterval(interval);
  }, [idPaciente]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [mensagens]);

  const enviar = async () => {
    const textoLimpo = texto.trim();
    if (!textoLimpo || enviando) return;
    setEnviando(true);
    try {
      const nova = await chatApi.enviar(idPaciente, {
        autorRole,
        autorNome,
        texto: textoLimpo,
      });
      setMensagens(prev => [...prev, nova]);
      setTexto('');
      inputRef.current?.focus();
    } catch {
      // erro silencioso — pode adicionar toast aqui
    } finally {
      setEnviando(false);
    }
  };

  const formatarHora = (iso: string) => {
    try {
      return new Date(iso).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className="flex flex-col h-full min-h-0">
      {/* Mensagens */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 min-h-0">
        {carregando ? (
          <div className="flex items-center justify-center h-full">
            <Loader2 size={20} className="animate-spin text-gray-400" />
          </div>
        ) : mensagens.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full gap-2 text-center">
            <MessageSquare size={28} className="text-gray-300 dark:text-slate-600" />
            <p className="text-sm text-gray-400 dark:text-slate-500 font-medium">Nenhuma mensagem ainda.</p>
            <p className="text-xs text-gray-300 dark:text-slate-600">Inicie a conversa abaixo.</p>
          </div>
        ) : (
          mensagens.map(msg => {
            const isOwn = msg.autorRole === autorRole;
            return (
              <div key={msg.id} className={`flex flex-col gap-0.5 ${isOwn ? 'items-end' : 'items-start'}`}>
                {!isOwn && (
                  <span className="text-[10px] font-bold text-gray-400 dark:text-slate-500 px-1">
                    {msg.autorNome}
                  </span>
                )}
                <div
                  className={`max-w-[80%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    isOwn
                      ? 'bg-[#FF8C00] text-white rounded-tr-sm shadow-[0_2px_12px_rgba(255,140,0,0.25)]'
                      : 'bg-gray-100 dark:bg-slate-700 text-gray-800 dark:text-slate-100 rounded-tl-sm'
                  }`}
                >
                  {msg.texto}
                </div>
                <span className="text-[10px] text-gray-300 dark:text-slate-600 px-1">
                  {formatarHora(msg.enviadoEm)}
                </span>
              </div>
            );
          })
        )}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="border-t border-gray-100 dark:border-slate-700 px-3 py-3 flex gap-2 items-center bg-white dark:bg-slate-900">
        <input
          ref={inputRef}
          type="text"
          value={texto}
          onChange={e => setTexto(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && !e.shiftKey && enviar()}
          placeholder="Digite uma mensagem..."
          className="flex-1 text-sm bg-gray-50 dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-xl px-4 py-2.5 text-gray-800 dark:text-slate-100 placeholder-gray-400 dark:placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 transition-all"
        />
        <button
          onClick={enviar}
          disabled={!texto.trim() || enviando}
          className="w-10 h-10 rounded-xl bg-[#FF8C00] hover:bg-[#E67E22] disabled:opacity-40 disabled:cursor-not-allowed text-white flex items-center justify-center transition-all active:scale-95 shadow-[0_2px_12px_rgba(255,140,0,0.30)] flex-shrink-0"
        >
          {enviando
            ? <Loader2 size={16} className="animate-spin" />
            : <Send size={16} />
          }
        </button>
      </div>
    </div>
  );
}
