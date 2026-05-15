import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_URL } from '../config';
import {
  LayoutDashboard, Users, Calendar, LogOut,
  Search, MessageSquare, Send,
  MapPin, Phone, AlertCircle, Star, Target, Filter, Clock, CheckCircle2, X,
  Heart, Activity, FileText, Printer, Plus, Trash2, Ban, CalendarCheck
} from 'lucide-react';

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
  pais: string; // <-- Adicionado
  cidade: string; // <-- Adicionado (substitui o bairro)
  tipo_dor: string;
  score_match: number;
  renda: number;
  tempo_dor: number;
  telefone?: string;
  historico?: HistoricoConsulta[];
}

interface Agendamento {
  id: number;
  paciente: Paciente;
  data: string;
  hora: string;
  tipo: string;
}



interface SlotProposto {
  id: string;
  data: string;
  hora: string;
}

interface OfertaAgendamento {
  dentistaNome: string;
  dentistaCidade: string;
  procedimento: string;
  slots: SlotProposto[];
  status: 'pendente' | 'confirmado';
  slotEscolhido?: { data: string; hora: string };
  criadaEm: string;
}

export function DentistaDashboard() {
  const navigate = useNavigate();

  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'pacientes' | 'agenda'>('painel');
  const [pesquisa, setPesquisa] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [respostaIA, setRespostaIA] = useState("");
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [mensagem, setMensagem] = useState('');

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  
  const [meusPacientes, setMeusPacientes] = useState<Paciente[]>(() => {
    const salvos = localStorage.getItem('tdb_meusPacientes');
    return salvos ? JSON.parse(salvos) : [];
  });

  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);

  // Slot-offer scheduling — declarados ANTES dos useEffects que os referenciam
  const [slotsPropostos, setSlotsPropostos] = useState<SlotProposto[]>([]);
  const [novaData, setNovaData] = useState('');
  const [novaHora, setNovaHora] = useState('');
  const [procedimentoOferta, setProcedimentoOferta] = useState('Primeira Consulta - Avaliação');
  const [ofertasMapa, setOfertasMapa] = useState<Record<string, OfertaAgendamento>>({});

  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [fichaAtiva, setFichaAtiva] = useState<Paciente | null>(null);

  useEffect(() => {
    localStorage.setItem('tdb_meusPacientes', JSON.stringify(meusPacientes));
  }, [meusPacientes]);

  useEffect(() => {
    localStorage.setItem('tdb_agendamentos', JSON.stringify(agendamentos));
  }, [agendamentos]);

  useEffect(() => {
    localStorage.setItem('tdb_ofertasHorario', JSON.stringify(ofertasMapa));
  }, [ofertasMapa]);

  // Load offers and confirmed agenda from API on mount
  useEffect(() => {
    const idDentista = sessionStorage.getItem('userId');
    if (!idDentista) return;

    fetch(`${API_URL}/ofertas/dentista/${idDentista}`)
      .then(res => res.json())
      .then((ofertas: any[]) => {
        if (!Array.isArray(ofertas)) return;
        const mapa: Record<string, OfertaAgendamento> = {};
        const agendados: Agendamento[] = [];

        for (const o of ofertas) {
          mapa[o.pacienteNome] = {
            dentistaNome: usuarioLogado,
            dentistaCidade: cidadeAtiva,
            procedimento: o.procedimento,
            slots: [],
            status: o.status as 'pendente' | 'confirmado',
            slotEscolhido: o.status === 'confirmado' ? { data: o.data, hora: o.hora } : undefined,
            criadaEm: '',
          };
          if (o.status === 'confirmado') {
            agendados.push({
              id: o.id,
              paciente: { id: o.idPaciente, nome: o.pacienteNome, idade: 0, pais: '', cidade: '', tipo_dor: '', score_match: 0, renda: 0, tempo_dor: 0 },
              data: o.data,
              hora: o.hora,
              tipo: o.procedimento,
            });
          }
        }

        setOfertasMapa(mapa);
        setAgendamentos(agendados);
      })
      .catch(err => console.error('Erro ao carregar ofertas:', err));
  }, [usuarioLogado, cidadeAtiva]);


  const usuarioLogado = sessionStorage.getItem("usuarioLogado") || "Dentista";
  const userRole = sessionStorage.getItem("userRole");
  
  // Substituído de Bairro para Cidade
  const [cidadeAtiva, setCidadeAtiva] = useState(sessionStorage.getItem("dentistaCidade") || "São Paulo");

  const dataHoje = new Date().toISOString().split('T')[0];

  useEffect(() => {
    if (!sessionStorage.getItem("usuarioLogado") || (userRole !== "dentista" && userRole !== "dev")) {
      navigate('/login');
      return;
    }

    // A API agora procura por cidade
    fetch(`${API_URL}/pacientes?cidade=${cidadeAtiva}`)
      .then(res => res.json())
      .then(data => {
        const pacientesMapeados = data.map((p: any) => {
          let idadeCalculada = p.idade;
          if (!idadeCalculada && p.dataNascimento) {
            const nascimento = new Date(p.dataNascimento);
            const hoje = new Date();
            idadeCalculada = hoje.getFullYear() - nascimento.getFullYear();
            const m = hoje.getMonth() - nascimento.getMonth();
            if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
              idadeCalculada--;
            }
          }

          return {
            ...p,
            idade: idadeCalculada || '?', 
            tipo_dor: p.tipoDor || p.tipo_dor || 'Não informado',
            renda: p.rendaSalarioMinimo || p.renda || 0,
            tempo_dor: p.tempoDorDias || p.tempo_dor || 0,
            score_match: p.scoreMatch || p.score_match || Math.floor(Math.random() * 40) + 50,
            pais: p.pais || 'Não informado',
            cidade: p.cidade || 'Não informado'
          };
        });
        
        const adotadosNomes = meusPacientes.map(mp => mp.nome);
        const filaLimpa = pacientesMapeados.filter((p: Paciente) => !adotadosNomes.includes(p.nome));
        
        setPacientes(filaLimpa);
      })
      .catch(err => console.error("Erro ao buscar pacientes:", err));
  }, [navigate, cidadeAtiva, userRole, meusPacientes]);

  // Slots already taken by confirmed agendamentos (key: "data|hora")
  const slotsOcupados = agendamentos.map(a => `${a.data}|${a.hora}`);

  const handleAdicionarSlot = () => {
    if (!novaData || !novaHora) return;
    const chave = `${novaData}|${novaHora}`;
    if (slotsPropostos.find(s => `${s.data}|${s.hora}` === chave)) return;
    setSlotsPropostos(prev => [...prev, { id: Date.now().toString(), data: novaData, hora: novaHora }]);
    setNovaHora('');
  };

  const handleRemoverSlot = (id: string) => {
    setSlotsPropostos(prev => prev.filter(s => s.id !== id));
  };

  const handleEnviarOferta = async () => {
    if (!fichaAtiva || slotsPropostos.length === 0) return;
    const slotsValidos = slotsPropostos.filter(s => !slotsOcupados.includes(`${s.data}|${s.hora}`));
    if (slotsValidos.length === 0) return;

    const idDentista = sessionStorage.getItem('userId');
    try {
      const res = await fetch(`${API_URL}/ofertas`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          idDentista: Number(idDentista),
          idPaciente: fichaAtiva.id,
          procedimento: procedimentoOferta,
          slots: slotsValidos.map(s => ({ data: s.data, hora: s.hora })),
        }),
      });

      if (!res.ok) throw new Error('API error');

      const oferta: OfertaAgendamento = {
        dentistaNome: usuarioLogado,
        dentistaCidade: cidadeAtiva,
        procedimento: procedimentoOferta,
        slots: slotsValidos,
        status: 'pendente',
        criadaEm: new Date().toISOString(),
      };
      setOfertasMapa(prev => ({ ...prev, [fichaAtiva.nome]: oferta }));
      setSlotsPropostos([]);
      setNovaData('');
      setNovaHora('');
      setMensagem(`Horários enviados para ${fichaAtiva.nome} com sucesso!`);
      setTimeout(() => setMensagem(''), 3500);
    } catch (err) {
      console.error('Erro ao enviar oferta:', err);
      setMensagem('Erro ao enviar proposta. Tente novamente.');
      setTimeout(() => setMensagem(''), 3500);
    }
  };

  const gerarRelatorio = (paciente: Paciente) => {
    const historico = paciente.historico || [];
    const concluidas = historico.filter(h => h.status !== 'Agendado').length;
    const agendadasCount = historico.filter(h => h.status === 'Agendado').length;
    const dataEmissao = new Date().toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', year: 'numeric' });
    const html = `<!DOCTYPE html><html lang="pt-BR"><head><meta charset="utf-8">
    <title>Relatório — ${paciente.nome}</title>
    <style>
      body{font-family:Arial,sans-serif;padding:40px;color:#333;max-width:800px;margin:0 auto}
      h1{color:#FF8C00;border-bottom:3px solid #FF8C00;padding-bottom:12px;margin-bottom:4px}
      .sub{color:#888;font-size:13px;margin-bottom:24px}
      h2{color:#555;font-size:15px;text-transform:uppercase;letter-spacing:1px;margin-top:28px;margin-bottom:10px;border-left:4px solid #FF8C00;padding-left:10px}
      .grid{display:grid;grid-template-columns:1fr 1fr 1fr;gap:12px;margin-bottom:8px}
      .card{background:#f9f9f9;border-radius:8px;padding:12px;border:1px solid #eee}
      .card-label{font-size:10px;text-transform:uppercase;color:#aaa;font-weight:bold;display:block;margin-bottom:4px}
      .card-val{font-size:16px;font-weight:bold;color:#333}
      .stats{display:flex;gap:32px;margin:16px 0;background:#fff8f0;padding:20px;border-radius:12px;border:1px solid #ffe0b2}
      .stat{text-align:center}
      .stat-n{font-size:36px;font-weight:900;color:#FF8C00}
      .stat-n.green{color:#8dc63f}
      .stat-n.orange{color:#e67e22}
      .stat-l{font-size:11px;color:#888;margin-top:4px}
      .item{border-left:4px solid #FF8C00;padding:12px 16px;margin:8px 0;background:#fff8f0;border-radius:0 8px 8px 0}
      .item.done{border-color:#8dc63f;background:#f0fff4}
      .item-title{font-weight:bold;font-size:14px}
      .badge{display:inline-block;font-size:10px;font-weight:bold;text-transform:uppercase;padding:2px 8px;border-radius:4px;margin-left:8px}
      .badge.ag{background:#fff3e0;color:#e67e22}
      .badge.ok{background:#e8f5e9;color:#2e7d32}
      .item-meta{font-size:12px;color:#888;margin-top:6px}
      .empty{color:#bbb;font-style:italic;font-size:13px}
      footer{margin-top:48px;padding-top:16px;border-top:1px solid #eee;font-size:11px;color:#bbb;text-align:center}
      @media print{body{padding:20px}button{display:none!important}}
    </style></head><body>
    <h1>📋 Relatório do Paciente — Turma do Bem</h1>
    <p class="sub">Emitido em ${dataEmissao} &nbsp;·&nbsp; Dr(a). ${usuarioLogado}</p>
    <h2>Dados do Paciente</h2>
    <div class="grid">
      <div class="card"><span class="card-label">Nome</span><span class="card-val">${paciente.nome}</span></div>
      <div class="card"><span class="card-label">Idade</span><span class="card-val">${paciente.idade} anos</span></div>
      <div class="card"><span class="card-label">Localização</span><span class="card-val">${paciente.cidade}, ${paciente.pais}</span></div>
      <div class="card"><span class="card-label">Tipo de Dor</span><span class="card-val">${paciente.tipo_dor || '—'}</span></div>
      <div class="card"><span class="card-label">Renda Familiar</span><span class="card-val">${paciente.renda} SM</span></div>
      <div class="card"><span class="card-label">Dias com Dor</span><span class="card-val">${paciente.tempo_dor} dias</span></div>
    </div>
    <h2>Resumo do Tratamento</h2>
    <div class="stats">
      <div class="stat"><div class="stat-n">${historico.length}</div><div class="stat-l">Total Consultas</div></div>
      <div class="stat"><div class="stat-n green">${concluidas}</div><div class="stat-l">Concluídas</div></div>
      <div class="stat"><div class="stat-n orange">${agendadasCount}</div><div class="stat-l">Agendadas</div></div>
    </div>
    <h2>Histórico de Consultas</h2>
    ${historico.length === 0
      ? '<p class="empty">Nenhuma consulta registrada.</p>'
      : historico.map(h => `
        <div class="item ${h.status !== 'Agendado' ? 'done' : ''}">
          <span class="item-title">${h.proc || h.titulo || 'Procedimento'}</span>
          <span class="badge ${h.status === 'Agendado' ? 'ag' : 'ok'}">${h.status}</span>
          <div class="item-meta">📅 ${h.data || '—'}${h.hora ? ' &nbsp;·&nbsp; ⏰ ' + h.hora : ''} &nbsp;·&nbsp; 👨‍⚕️ Dr(a). ${h.dentista || usuarioLogado}</div>
        </div>`).join('')
    }
    <footer>Relatório gerado automaticamente pelo sistema Dentista na Nuvem — Turma do Bem &nbsp;|&nbsp; Dr(a). ${usuarioLogado} &nbsp;|&nbsp; ${dataEmissao}</footer>
    </body></html>`;
    const win = window.open('', '_blank');
    if (win) { win.document.write(html); win.document.close(); win.focus(); setTimeout(() => win.print(), 500); }
  };

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const enviarPerguntaIA = async () => {
    if (!pergunta.trim()) return;
    setCarregandoIA(true);
    
    try {
      const res = await fetch(`${API_URL}/IA/consultar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          texto: pergunta,
          fila_json: JSON.stringify(pacientesFiltrados) 
        })
      });
      
      const data = await res.json();
      let textoFinal = "";

      if (data.candidates && data.candidates.length > 0) {
        textoFinal = data.candidates[0].content.parts[0].text;
      } else if (data.resposta) {
        textoFinal = data.resposta;
      } else if (data.error) {
        textoFinal = "Erro do servidor: " + data.error;
      } else {
        textoFinal = "A IA processou, mas não retornou um formato legível.";
      }
      
      setRespostaIA(textoFinal);
      setPergunta("");

    } catch (err) {
      console.error("Erro no fetch da IA:", err);
      setRespostaIA("Desculpe, Doutor. Tive um erro de conexão ao consultar a IA.");
    } finally {
      setCarregandoIA(false);
    }
  };

  const adotarPaciente = async (paciente: Paciente) => {
    try {
      await fetch(`${API_URL}/pacientes/${paciente.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...paciente, status: 'adotado', dentista: usuarioLogado }),
      });
      setPacientes(pacientes.filter(p => p.nome !== paciente.nome));
      setMeusPacientes([...meusPacientes, paciente]);
      setPacienteSelecionado(null);
      setTelaAtiva('pacientes');
    } catch (err) {
      console.error("Erro ao adotar:", err);
    }
  };

  const removerAdocao = (pacienteRemover: Paciente) => {
    if(window.confirm(`Tem certeza que deseja cancelar a adoção de ${pacienteRemover.nome}? Ele será removido da sua lista e da agenda.`)) {
      setMeusPacientes(meusPacientes.filter(p => p.nome !== pacienteRemover.nome));
      setAgendamentos(agendamentos.filter(a => a.paciente.nome !== pacienteRemover.nome));
    }
  };


  const formatarDataAgenda = (dataISO: string) => {
    if (!dataISO) return { diaSemana: 'DIA', diaMes: '00' };
    const [ano, mes, dia] = dataISO.split('-');
    const dataObj = new Date(Number(ano), Number(mes) - 1, Number(dia));
    const dias = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    return { diaSemana: dias[dataObj.getDay()], diaMes: dia };
  };

  const pacientesFiltrados = pacientes.filter(p =>
    p.nome.toLowerCase().includes(pesquisa.toLowerCase())
  );

  return (
    <div className="flex min-h-screen bg-[#F5F5DC] font-sans pt-[65px] items-start">
      <aside className="w-[260px] min-w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-[65px] self-start h-[calc(100vh-65px)] z-10 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-[#FF8C00] flex items-center justify-center font-bold text-xl border border-orange-100">
            {usuarioLogado.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 truncate w-[160px]">{usuarioLogado}</p>
            <p className="text-[0.7rem] uppercase tracking-wider text-gray-500 font-semibold">{userRole === 'dev' ? 'Desenvolvedor' : 'Dentista Voluntário'}</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button onClick={() => setTelaAtiva('painel')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${telaAtiva === 'painel' ? 'bg-[#FF8C00] text-white shadow-sm hover:bg-[#E67E22]' : 'text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} /> Fila de Triagem
          </button>
          <button onClick={() => setTelaAtiva('pacientes')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${telaAtiva === 'pacientes' ? 'bg-[#FF8C00] text-white shadow-sm hover:bg-[#E67E22]' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Users size={20} /> Meus Pacientes
            {meusPacientes.length > 0 && <span className="ml-auto bg-white text-[#FF8C00] text-[10px] px-2 py-0.5 rounded-full">{meusPacientes.length}</span>}
          </button>
          <button onClick={() => setTelaAtiva('agenda')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${telaAtiva === 'agenda' ? 'bg-[#FF8C00] text-white shadow-sm hover:bg-[#E67E22]' : 'text-gray-500 hover:bg-gray-50'}`}>
            <Calendar size={20} /> Agenda de Consultas
            {agendamentos.length > 0 && <span className="ml-auto bg-white text-[#FF8C00] text-[10px] px-2 py-0.5 rounded-full">{agendamentos.length}</span>}
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full relative">
        {mensagem && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] px-6 py-3 rounded-xl shadow-lg font-bold animate-fade-in flex items-center gap-2">
            <CheckCircle2 size={20}/> {mensagem}
          </div>
        )}

        {telaAtiva === 'painel' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Fila de Triagem Inteligente</h2>
                {userRole === 'dev' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Filter size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Simular Localidade:</span>
                    <select value={cidadeAtiva} onChange={(e) => setCidadeAtiva(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-2 py-1 text-[#FF8C00] font-bold outline-none cursor-pointer hover:border-[#FF8C00] transition-colors">
                      <option value="São Paulo">São Paulo (BR)</option>
                      <option value="Rio de Janeiro">Rio de Janeiro (BR)</option>
                      <option value="Bogotá">Bogotá (CO)</option>
                      <option value="Buenos Aires">Buenos Aires (AR)</option>
                      <option value="Cidade do México">Cidade do México (MX)</option>
                      <option value="Santiago">Santiago (CL)</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mt-1">Cidade de Atuação: <span className="font-bold text-gray-700">{cidadeAtiva}</span></p>
                )}
              </div>

              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                <input type="text" placeholder="Buscar paciente..." className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl text-sm w-full md:w-[250px] focus:ring-2 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00] outline-none transition-all" value={pesquisa} onChange={(e) => setPesquisa(e.target.value)} />
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
              <div className="lg:col-span-8 space-y-4">
                <div className="flex items-center justify-between px-2 mb-2">
                  <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">Ordenado por IA (Score TdB)</span>
                </div>

                {pacientesFiltrados.map((p, i) => (
                  <div key={i} className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md hover:border-orange-200 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4 relative overflow-hidden group">
                    <div className={`absolute left-0 top-0 bottom-0 w-1 ${p.score_match >= 70 ? 'bg-red-400' : p.score_match >= 40 ? 'bg-[#FF8C00]' : 'bg-[#8dc63f]'}`}></div>

                    <div className="flex items-center gap-4 pl-2">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm ${p.score_match >= 70 ? 'bg-red-50 text-red-600' : 'bg-gray-50 text-gray-600'}`}>
                        {p.nome.charAt(0)}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h4 className="font-bold text-gray-800 leading-tight cursor-pointer hover:text-[#FF8C00] hover:underline"
                            onClick={() => navigate(`/prontuario/${p.nome}`)}
                          >
                            {p.nome}
                          </h4>
                          <span className="bg-gray-50 text-gray-500 text-[10px] px-2 py-0.5 rounded-md font-semibold border border-gray-100">{p.idade} anos</span>
                        </div>
                        <div className="flex items-center gap-3 mt-1.5">
                          <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium"><MapPin size={12} /> {p.cidade}, {p.pais}</p>
                          <p className={`text-[11px] font-bold flex items-center gap-1 uppercase ${(p.tipo_dor || '').includes('quebrado') || p.tipo_dor === 'forte' ? 'text-red-500' : 'text-gray-500'}`}>
                            <AlertCircle size={12} /> {p.tipo_dor}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <p className="text-[9px] text-gray-400 font-bold uppercase mb-0.5">Match</p>
                        <div className="flex items-center justify-end gap-1">
                          <span className={`text-sm font-bold ${p.score_match >= 70 ? 'text-gray-800' : 'text-gray-500'}`}>{p.score_match}%</span>
                          {p.score_match >= 70 && <Star size={12} className="text-[#FF8C00] fill-[#FF8C00]" />}
                        </div>
                      </div>
                      <button onClick={() => setPacienteSelecionado(p)} className="bg-white text-[#FF8C00] border border-[#FF8C00] px-4 py-2 rounded-xl font-bold text-xs hover:bg-[#FF8C00] hover:text-white transition-colors">
                        Avaliar
                      </button>
                    </div>
                  </div>
                ))}

                {pacientesFiltrados.length === 0 && (
                  <div className="bg-white p-8 rounded-2xl border border-gray-100 shadow-sm text-center">
                    <p className="text-gray-500">Nenhum paciente na fila para esta região no momento.</p>
                  </div>
                )}
              </div>

              <div className="lg:col-span-4">
                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 flex flex-col h-[550px] sticky top-[90px] overflow-hidden">
                  <div className="bg-gray-50 p-4 border-b border-gray-100 flex items-center gap-3">
                    <div className="bg-white p-2 rounded-lg shadow-sm border border-gray-100 text-[#FF8C00]">
                      <MessageSquare size={20} />
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-sm">Assistente TdB</h3>
                      <p className="text-[10px] text-gray-400 font-semibold">Gemini 2.5</p>
                    </div>
                  </div>

                  <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-white">
                    <div className="self-start bg-gray-50 p-3.5 rounded-2xl rounded-tl-sm text-sm text-gray-600 border border-gray-100">
                      Doutor, a fila já está priorizada para jovens em vulnerabilidade perto de <strong>{cidadeAtiva}</strong>. Posso te ajudar a analisar algum caso?
                    </div>
                    {respostaIA && (
                      <div className="self-start bg-orange-50/50 p-3.5 rounded-2xl rounded-tl-sm text-sm text-gray-700 border border-orange-100 whitespace-pre-wrap">
                        {respostaIA}
                      </div>
                    )}
                    {carregandoIA && <div className="text-xs text-gray-400 font-medium animate-pulse pl-2">A pensar...</div>}
                  </div>

                  <div className="p-3 bg-white border-t border-gray-100 flex gap-2">
                    <input type="text" placeholder="Ex: Qual o caso mais grave?" className="flex-1 bg-gray-50 border border-gray-100 rounded-xl px-3 py-2.5 text-sm focus:ring-2 focus:ring-[#FF8C00]/20 focus:border-[#FF8C00] outline-none" value={pergunta} onChange={(e) => setPergunta(e.target.value)} onKeyPress={(e) => e.key === 'Enter' && enviarPerguntaIA()} />
                    <button onClick={enviarPerguntaIA} className="bg-[#FF8C00] text-white p-2.5 rounded-xl hover:bg-[#E67E22] transition-colors">
                      <Send size={18} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {telaAtiva === 'pacientes' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-500">
                <Users size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Meus Pacientes Adotados</h2>
                <p className="text-gray-500 text-sm">Jovens que assumiu o tratamento até aos 18 anos.</p>
              </div>
            </div>

            {meusPacientes.length === 0 ? (
              <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  <Heart size={64} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Ainda não adotou pacientes</h3>
                <p className="text-gray-500 max-w-md mx-auto">Aceda à Fila de Triagem, avalie um caso e clique em "Adotar Paciente" para iniciar o tratamento.</p>
                <button onClick={() => setTelaAtiva('painel')} className="mt-8 bg-white text-[#FF8C00] border-2 border-[#FF8C00] px-6 py-2.5 rounded-xl font-bold hover:bg-[#FF8C00] hover:text-white transition-colors">
                  Ver Fila de Triagem
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {meusPacientes.map((p, idx) => (
                  <div key={idx} className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 bg-[#FF8C00] text-white rounded-full flex items-center justify-center font-bold text-sm">
                            {p.nome.charAt(0)}
                          </div>
                          <div>
                            <h4 className="font-bold text-gray-800 leading-tight">{p.nome}</h4>
                            <span className="text-xs text-gray-500 font-medium">{p.idade} anos</span>
                          </div>
                        </div>
                        <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-[10px] font-bold uppercase flex items-center gap-1">
                          <CheckCircle2 size={12} /> Adotado
                        </span>
                      </div>
                      <div className="space-y-2 mb-3">
                        <p className="text-sm text-gray-600 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {p.telefone || '(11) 90000-0000'}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {p.cidade}, {p.pais}</p>
                      </div>
                      {/* Status do agendamento */}
                      {(() => {
                        const oferta = ofertasMapa[p.nome];
                        const temAgendamento = agendamentos.some(a => a.paciente?.nome === p.nome);
                        if (oferta?.status === 'confirmado' || temAgendamento) {
                          return (
                            <div className="mb-4 flex items-center gap-1.5 text-xs font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2.5 py-1.5 rounded-lg w-fit">
                              <CalendarCheck size={13} /> Agendado
                            </div>
                          );
                        } else if (oferta?.status === 'pendente') {
                          return (
                            <div className="mb-4 flex items-center gap-1.5 text-xs font-bold text-orange-600 bg-orange-50 border border-orange-200 px-2.5 py-1.5 rounded-lg w-fit">
                              <Clock size={13} /> Em Andamento
                            </div>
                          );
                        } else {
                          return (
                            <div className="mb-4 flex items-center gap-1.5 text-xs font-bold text-gray-500 bg-gray-100 border border-gray-200 px-2.5 py-1.5 rounded-lg w-fit">
                              <Ban size={13} /> Não Agendado
                            </div>
                          );
                        }
                      })()}
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => { setFichaAtiva(p); setSlotsPropostos([]); setNovaData(''); setNovaHora(''); setProcedimentoOferta('Primeira Consulta - Avaliação'); }}
                        className="flex-1 bg-gray-50 text-[#FF8C00] border border-orange-200 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-50 hover:border-[#FF8C00] flex items-center justify-center gap-2 transition-all"
                      >
                        <Calendar size={16} /> Prontuário
                      </button>
                      <button
                        onClick={() => gerarRelatorio(p)}
                        className="bg-gray-50 text-gray-500 border border-gray-200 px-3 py-2.5 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all flex items-center justify-center"
                        title="Gerar Relatório"
                      >
                        <FileText size={18} />
                      </button>
                      <button
                        onClick={() => removerAdocao(p)}
                        className="bg-red-50 text-red-500 border border-red-200 px-3 py-2.5 rounded-xl hover:bg-red-100 hover:text-red-600 transition-all flex items-center justify-center"
                        title="Remover paciente"
                      >
                        <X size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {telaAtiva === 'agenda' && (
          <div className="animate-fade-in max-w-4xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-orange-100 p-3 rounded-xl text-orange-500">
                <Calendar size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">A Minha Agenda Voluntária</h2>
                <p className="text-gray-500 text-sm">Próximos agendamentos vinculados ao projeto Turma do Bem.</p>
              </div>
            </div>

            {agendamentos.length === 0 ? (
              <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  <Clock size={64} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">A sua agenda está livre</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Ainda não possui consultas agendadas. Vá ao separador "Meus Pacientes" para marcar um horário.
                </p>
                <button
                  onClick={() => {
                    if (meusPacientes.length === 0) {
                      alert("Precisa de adotar um paciente na Triagem primeiro!");
                      setTelaAtiva('painel');
                    } else {
                      setTelaAtiva('pacientes');
                    }
                  }}
                  className="mt-8 bg-white text-[#FF8C00] border-2 border-[#FF8C00] px-6 py-2.5 rounded-xl font-bold hover:bg-[#FF8C00] hover:text-white transition-colors"
                >
                  + Novo Agendamento
                </button>
              </div>
            ) : (
              <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                  <h3 className="font-bold text-gray-800">Próximos Agendamentos</h3>
                  <button
                    onClick={() => setTelaAtiva('pacientes')}
                    className="text-[#FF8C00] font-bold text-sm hover:underline"
                  >
                    + Novo Agendamento
                  </button>
                </div>

                <div className="divide-y divide-gray-100">
                  {agendamentos.sort((a, b) => a.data.localeCompare(b.data)).map((ag) => {
                    const dataFormatada = formatarDataAgenda(ag.data);
                    return (
                      <div key={ag.id} className="p-6 flex items-start gap-6 hover:bg-gray-50 transition-colors animate-fade-in">
                        <div className="text-center min-w-[60px]">
                          <p className="text-xs font-bold text-gray-400 uppercase">{dataFormatada.diaSemana}</p>
                          <p className="text-2xl font-black text-[#FF8C00]">{dataFormatada.diaMes}</p>
                        </div>
                        <div className="flex-1">
                          <h4 className="font-bold text-gray-800 text-lg">{ag.tipo}</h4>
                          <p className="text-gray-500 text-sm">Paciente: {ag.paciente.nome}</p>
                          <div className="flex items-center gap-4 mt-3">
                            <span className="bg-orange-50 text-[#FF8C00] px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><Clock size={14} /> {ag.hora}</span>
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><MapPin size={14} /> O seu Consultório</span>
                          </div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </div>
            )}
          </div>
        )}

      </main>

      {/* === MODAIS === */}
      {pacienteSelecionado && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4" onClick={() => setPacienteSelecionado(null)}>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>
            <div className="p-8 md:w-1/2 overflow-y-auto">
              <button onClick={() => setPacienteSelecionado(null)} className="mb-6 text-gray-400 hover:text-gray-800 text-sm font-bold transition-colors">← Fechar</button>
              <div className="flex items-center gap-4 mb-8">
                <div className="w-14 h-14 bg-gray-100 rounded-2xl flex items-center justify-center text-gray-600 text-xl font-bold border border-gray-200">{pacienteSelecionado.nome.charAt(0)}</div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-800">{pacienteSelecionado.nome}</h2>
                  <p className="text-sm font-semibold text-[#FF8C00]">Match: {pacienteSelecionado.score_match}%</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-3">
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Idade</p><p className="text-sm font-bold text-[#FF8C00]">{pacienteSelecionado.idade} anos</p></div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Renda</p><p className="text-sm font-bold text-gray-700">{pacienteSelecionado.renda} SM</p></div>
                  <div className="bg-gray-50 p-4 rounded-xl border border-gray-100"><p className="text-[10px] font-bold text-gray-400 uppercase mb-1">Tempo Dor</p><p className="text-sm font-bold text-gray-700">{pacienteSelecionado.tempo_dor} dias</p></div>
                </div>
                <div className="bg-white p-4 rounded-xl border border-gray-200">
                  <h4 className="text-gray-800 font-bold text-sm mb-2 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> Contato e Localização</h4>
                  <p className="text-sm font-medium text-gray-600">{pacienteSelecionado.telefone || '(11) 90000-0000'}</p>
                  <p className="text-sm font-medium text-gray-600 mt-1">{pacienteSelecionado.cidade}, {pacienteSelecionado.pais}</p>
                </div>
                <button onClick={() => adotarPaciente(pacienteSelecionado)} className="w-full mt-4 bg-[#FF8C00] text-white font-bold py-3.5 rounded-xl hover:bg-[#E67E22] transition-colors shadow-md flex items-center justify-center gap-2">
                  <Target size={18} /> Adotar Paciente
                </button>
              </div>
            </div>
            <div className="bg-gray-100 md:w-1/2 h-[300px] md:h-auto relative">
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 pointer-events-none"><p className="text-[10px] font-bold text-gray-500 uppercase">Geolocalização</p></div>
              <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://maps.google.com/maps?q=$${encodeURIComponent(pacienteSelecionado.cidade + ", " + pacienteSelecionado.pais)}&t=&z=14&ie=UTF8&iwloc=&output=embed`} title="Mapa"></iframe>
            </div>
          </div>
        </div>
      )}

      {fichaAtiva && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4" onClick={() => setFichaAtiva(null)}>
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-in" onClick={e => e.stopPropagation()}>

            <div className="p-8 md:w-1/2 overflow-y-auto bg-white border-r border-gray-100">
              {/* Header */}
              <div className="flex justify-between items-start mb-6 pb-6 border-b border-dashed border-gray-200">
                <div className="flex-1 min-w-0">
                  <h3 className="text-2xl font-black text-gray-800 truncate">{fichaAtiva.nome}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1"><MapPin size={14} /> {fichaAtiva.cidade}, {fichaAtiva.pais}</p>
                </div>
                <div className="flex flex-col items-end gap-2 ml-3 flex-shrink-0">
                  <div className="w-12 h-12 bg-orange-100 text-orange-500 rounded-xl flex items-center justify-center font-black text-xl border-2 border-orange-200">
                    {fichaAtiva.idade}
                  </div>
                  <button onClick={() => gerarRelatorio(fichaAtiva)}
                    className="flex items-center gap-1 text-[10px] font-bold text-gray-400 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-2 py-1 rounded-lg transition-all uppercase tracking-wide">
                    <Printer size={12} /> Relatório
                  </button>
                </div>
              </div>

              {/* Slot-offer builder */}
              <div className="space-y-5">
                <h4 className="font-bold text-gray-800 flex items-center gap-2">
                  <CalendarCheck size={18} className="text-[#8dc63f]" /> Propor Horários ao Paciente
                </h4>

                {/* Procedimento */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Procedimento</label>
                  <select value={procedimentoOferta} onChange={e => setProcedimentoOferta(e.target.value)}
                    className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF8C00] appearance-none cursor-pointer">
                    <option>Primeira Consulta - Avaliação</option>
                    <option>Restauração (Cárie)</option>
                    <option>Limpeza (Profilaxia)</option>
                    <option>Canal (Endodontia)</option>
                    <option>Extração Simples</option>
                  </select>
                </div>

                {/* Add slot row */}
                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Adicionar Opção de Horário</label>
                  <div className="flex gap-2">
                    <input type="date" min={dataHoje} value={novaData} onChange={e => setNovaData(e.target.value)}
                      className="flex-1 bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF8C00]" />
                    <input type="time" value={novaHora} onChange={e => setNovaHora(e.target.value)}
                      className="w-[110px] bg-gray-50 border border-gray-200 rounded-xl px-3 py-2.5 text-sm outline-none focus:border-[#FF8C00]" />
                    <button type="button" onClick={handleAdicionarSlot}
                      className="bg-[#FF8C00] text-white p-2.5 rounded-xl hover:bg-[#E67E22] transition-colors flex-shrink-0">
                      <Plus size={18} />
                    </button>
                  </div>
                  <p className="text-[11px] text-gray-400 mt-1.5">Adicione várias opções para o paciente escolher a melhor.</p>
                </div>

                {/* Proposed slots list */}
                {slotsPropostos.length > 0 && (
                  <div className="space-y-2">
                    <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wide">Horários na proposta:</p>
                    {slotsPropostos.map(slot => {
                      const ocupado = slotsOcupados.includes(`${slot.data}|${slot.hora}`);
                      return (
                        <div key={slot.id} className={`flex items-center justify-between px-3 py-2.5 rounded-xl border text-sm font-medium ${ocupado ? 'bg-red-50 border-red-200 text-red-600' : 'bg-green-50 border-green-200 text-green-700'}`}>
                          <span className="flex items-center gap-2">
                            {ocupado ? <Ban size={14} /> : <CheckCircle2 size={14} />}
                            {slot.data.split('-').reverse().join('/')} às {slot.hora}
                            {ocupado && <span className="text-[10px] font-bold uppercase bg-red-100 text-red-500 px-2 py-0.5 rounded ml-1">Horário Ocupado</span>}
                          </span>
                          <button type="button" onClick={() => handleRemoverSlot(slot.id)} className="text-gray-300 hover:text-red-500 ml-2 transition-colors">
                            <Trash2 size={15} />
                          </button>
                        </div>
                      );
                    })}
                  </div>
                )}

                {/* Send offer button */}
                <button type="button" onClick={handleEnviarOferta}
                  disabled={slotsPropostos.filter(s => !slotsOcupados.includes(`${s.data}|${s.hora}`)).length === 0}
                  className="w-full bg-[#8dc63f] text-white font-bold py-4 rounded-xl hover:bg-[#7ebd34] transition-colors shadow-sm flex items-center justify-center gap-2 text-base disabled:opacity-40 disabled:cursor-not-allowed">
                  <Send size={18} />
                  Enviar Proposta ao Paciente
                  {slotsPropostos.filter(s => !slotsOcupados.includes(`${s.data}|${s.hora}`)).length > 0 &&
                    <span className="bg-white/30 text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {slotsPropostos.filter(s => !slotsOcupados.includes(`${s.data}|${s.hora}`)).length} opção(ões)
                    </span>
                  }
                </button>

                {/* Existing offer status */}
                {ofertasMapa[fichaAtiva.nome] && (
                  <div className={`p-4 rounded-xl border text-sm ${ofertasMapa[fichaAtiva.nome].status === 'confirmado' ? 'bg-green-50 border-green-200' : 'bg-orange-50 border-orange-200'}`}>
                    <p className="font-bold text-gray-700 flex items-center gap-2 mb-1">
                      {ofertasMapa[fichaAtiva.nome].status === 'confirmado'
                        ? <><CheckCircle2 size={16} className="text-green-500" /> Consulta confirmada pelo paciente!</>
                        : <><Clock size={16} className="text-[#FF8C00]" /> Proposta enviada — aguardando escolha...</>
                      }
                    </p>
                    <p className="text-gray-500 text-xs">{ofertasMapa[fichaAtiva.nome].procedimento}</p>
                    {ofertasMapa[fichaAtiva.nome].status === 'confirmado' && ofertasMapa[fichaAtiva.nome].slotEscolhido && (
                      <p className="text-green-700 font-bold text-xs mt-1">
                        📅 {ofertasMapa[fichaAtiva.nome].slotEscolhido!.data.split('-').reverse().join('/')} às {ofertasMapa[fichaAtiva.nome].slotEscolhido!.hora}
                      </p>
                    )}
                    {ofertasMapa[fichaAtiva.nome].status === 'pendente' && (
                      <p className="text-gray-400 text-xs mt-1">
                        {ofertasMapa[fichaAtiva.nome].slots.length} opção(ões) enviada(s)
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="p-8 md:w-1/2 overflow-y-auto bg-gray-50/50">
              <div className="flex justify-between items-center mb-6">
                 <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2"><Activity size={20} className="text-[#8dc63f]"/> Histórico de Tratamento</h3>
                 <button onClick={() => setFichaAtiva(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
              </div>

              <div className="relative border-l-2 border-gray-200 ml-3 space-y-6">
                {fichaAtiva.historico && fichaAtiva.historico.length > 0 ? (
                  fichaAtiva.historico.map((item, idx) => (
                    <div key={idx} className="relative pl-6 animate-fade-in">
                      <div className={`absolute w-5 h-5 rounded-full -left-[11px] top-0.5 border-4 border-white shadow-sm ${item.status === 'Agendado' ? 'bg-[#FF8C00]' : 'bg-[#8dc63f]'}`}></div>
                      <p className="text-xs font-bold text-gray-400 mb-1">{item.data}</p>
                      <div className={`p-4 rounded-xl border ${item.status === 'Agendado' ? 'bg-orange-50 border-orange-100' : 'bg-white border-gray-100 shadow-sm'}`}>
                        <h4 className={`font-bold text-sm ${item.status === 'Agendado' ? 'text-orange-800' : 'text-gray-800'}`}>
                          {item.proc} <span className="text-[10px] font-normal uppercase ml-2 text-gray-500">({item.status})</span>
                        </h4>
                        <p className={`text-xs mt-1 ${item.status === 'Agendado' ? 'text-orange-600' : 'text-gray-500'}`}>
                          Responsável: Dr(a). {item.dentista}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-10">
                    <Activity size={32} className="text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500 font-medium text-sm">Nenhum histórico de tratamento ainda.</p>
                    <p className="text-gray-400 text-xs mt-1">O histórico aparecerá aqui quando for agendado algum procedimento.</p>
                  </div>
                )}
              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
}