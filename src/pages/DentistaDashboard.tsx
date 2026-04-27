import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, Users, Calendar, LogOut,
  Search, MessageSquare, Send, User,
  MapPin, Phone, AlertCircle, Star, Target, Filter, Clock, CheckCircle2, X,
  Heart
} from 'lucide-react';

interface Paciente {
  nome: string;
  idade: number;
  bairro: string;
  tipo_dor: string;
  score_match: number;
  renda: number;
  tempo_dor: number;
  telefone?: string;
}

interface Agendamento {
  id: number;
  paciente: Paciente;
  data: string;
  hora: string;
  tipo: string;
}

export function DentistaDashboard() {
  const navigate = useNavigate();

  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'pacientes' | 'agenda'>('painel');
  const [pesquisa, setPesquisa] = useState("");
  const [pergunta, setPergunta] = useState("");
  const [respostaIA, setRespostaIA] = useState("");
  const [carregandoIA, setCarregandoIA] = useState(false);

  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [meusPacientes, setMeusPacientes] = useState<Paciente[]>([]);
  const [agendamentos, setAgendamentos] = useState<Agendamento[]>([]);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);
  const [fichaAtiva, setFichaAtiva] = useState<Paciente | null>(null);

  const [novoAgendamento, setNovoAgendamento] = useState({ data: '', hora: '', tipo: 'Primeira Consulta - Avaliação' });

  const usuarioLogado = sessionStorage.getItem("usuarioLogado") || "Dentista";
  const userRole = sessionStorage.getItem("userRole");
  const [bairroAtivo, setBairroAtivo] = useState(sessionStorage.getItem("dentistaBairro") || "Tatuapé");

  useEffect(() => {
    if (!sessionStorage.getItem("usuarioLogado") || (userRole !== "dentista" && userRole !== "dev")) {
      navigate('/login');
      return;
    }

    fetch(`http://127.0.0.1:8000/pacientes?dentista_bairro=${bairroAtivo}`)
      .then(res => res.json())
      .then(data => setPacientes(data))
      .catch(err => console.error("Erro ao buscar pacientes:", err));
  }, [navigate, bairroAtivo, userRole]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const enviarPerguntaIA = async () => {
    if (!pergunta.trim()) return;
    setCarregandoIA(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/IA/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: pergunta })
      });
      const data = await res.json();
      setRespostaIA(data.resposta);
      setPergunta("");
    } catch (err) {
      setRespostaIA("Erro ao consultar assistente.");
    } finally {
      setCarregandoIA(false);
    }
  };

  const adotarPaciente = async (paciente: Paciente) => {
    if (window.confirm(`Deseja adotar ${paciente.nome}? Ele será movido para sua lista de pacientes.`)) {
      try {
        await fetch(`http://127.0.0.1:8000/paciente/${paciente.nome}`, { method: 'DELETE' });
        setPacientes(pacientes.filter(p => p.nome !== paciente.nome));
        setMeusPacientes([...meusPacientes, paciente]);
        setPacienteSelecionado(null);
        setTelaAtiva('pacientes');
      } catch (err) {
        console.error("Erro ao adotar:", err);
      }
    }
  };

  const agendarConsulta = (e: React.FormEvent) => {
    e.preventDefault();
    if (!novoAgendamento.data || !novoAgendamento.hora || !fichaAtiva) return;

    const consultaMarcada: Agendamento = {
      id: Date.now(),
      paciente: fichaAtiva,
      data: novoAgendamento.data,
      hora: novoAgendamento.hora,
      tipo: novoAgendamento.tipo
    };

    setAgendamentos([...agendamentos, consultaMarcada]);
    alert(`Consulta agendada para ${fichaAtiva.nome} com sucesso!`);
    setFichaAtiva(null);
    setNovoAgendamento({ data: '', hora: '', tipo: 'Primeira Consulta - Avaliação' });
    setTelaAtiva('agenda');
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

      <main className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full">

        {telaAtiva === 'painel' && (
          <div className="animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Fila de Triagem Inteligente</h2>
                {userRole === 'dev' ? (
                  <div className="flex items-center gap-2 mt-2">
                    <Filter size={14} className="text-gray-400" />
                    <span className="text-xs font-bold text-gray-500 uppercase">Simular Bairro:</span>
                    <select value={bairroAtivo} onChange={(e) => setBairroAtivo(e.target.value)} className="bg-gray-50 border border-gray-200 text-sm rounded-lg px-2 py-1 text-[#FF8C00] font-bold outline-none cursor-pointer hover:border-[#FF8C00] transition-colors">
                      <option value="Tatuapé">Tatuapé</option>
                      <option value="Morumbi">Morumbi</option>
                      <option value="Centro">Centro</option>
                      <option value="Mooca">Mooca</option>
                      <option value="Pinheiros">Pinheiros</option>
                      <option value="Santana">Santana</option>
                    </select>
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm mt-1">Bairro de Atuação: <span className="font-bold text-gray-700">{bairroAtivo}</span></p>
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
                          <p className="text-[11px] text-gray-500 flex items-center gap-1 font-medium"><MapPin size={12} /> {p.bairro}</p>
                          <p className={`text-[11px] font-bold flex items-center gap-1 uppercase ${p.tipo_dor.includes('quebrado') || p.tipo_dor === 'forte' ? 'text-red-500' : 'text-gray-500'}`}>
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
                      Doutor, a fila já está priorizada para jovens em vulnerabilidade perto de <strong>{bairroAtivo}</strong>. Posso te ajudar a analisar algum caso?
                    </div>
                    {respostaIA && (
                      <div className="self-start bg-orange-50/50 p-3.5 rounded-2xl rounded-tl-sm text-sm text-gray-700 border border-orange-100 whitespace-pre-wrap">
                        {respostaIA}
                      </div>
                    )}
                    {carregandoIA && <div className="text-xs text-gray-400 font-medium animate-pulse pl-2">Digitando...</div>}
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
                <p className="text-gray-500 text-sm">Jovens que você assumiu o tratamento até os 18 anos.</p>
              </div>
            </div>

            {meusPacientes.length === 0 ? (
              <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  <Heart size={64} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Você ainda não adotou pacientes</h3>
                <p className="text-gray-500 max-w-md mx-auto">Acesse a Fila de Triagem, avalie um caso e clique em "Adotar Paciente" para iniciar o tratamento.</p>
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
                      <div className="space-y-2 mb-4">
                        <p className="text-sm text-gray-600 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> {p.telefone || '(11) 90000-0000'}</p>
                        <p className="text-sm text-gray-600 flex items-center gap-2"><MapPin size={14} className="text-gray-400" /> {p.bairro}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setFichaAtiva(p)}
                      className="w-full bg-gray-50 text-[#FF8C00] border border-orange-200 py-2.5 rounded-xl font-bold text-sm hover:bg-orange-50 hover:border-[#FF8C00] flex items-center justify-center gap-2 transition-all"
                    >
                      <Calendar size={16} /> Agendar Consulta
                    </button>
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
                <h2 className="text-2xl font-bold text-gray-800">Minha Agenda Voluntária</h2>
                <p className="text-gray-500 text-sm">Próximos agendamentos vinculados ao projeto Turma do Bem.</p>
              </div>
            </div>

            {agendamentos.length === 0 ? (
              <div className="bg-white p-12 rounded-[32px] border border-gray-100 shadow-sm text-center flex flex-col items-center justify-center min-h-[400px]">
                <div className="bg-gray-50 p-6 rounded-full mb-6">
                  <Clock size={64} className="text-gray-300" />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">Sua agenda está livre</h3>
                <p className="text-gray-500 max-w-md mx-auto">
                  Você ainda não possui consultas agendadas. Vá na aba "Meus Pacientes" para marcar um horário.
                </p>
                <button
                  onClick={() => {
                    if (meusPacientes.length === 0) {
                      alert("Você precisa adotar um paciente na Triagem primeiro!");
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
                            <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-lg text-xs font-bold flex items-center gap-1.5"><MapPin size={14} /> Seu Consultório</span>
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
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-4xl max-h-[90vh] rounded-3xl shadow-2xl flex flex-col md:flex-row overflow-hidden animate-scale-in">
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
                  <h4 className="text-gray-800 font-bold text-sm mb-2 flex items-center gap-2"><Phone size={14} className="text-gray-400" /> Contato e Local.</h4>
                  <p className="text-sm font-medium text-gray-600">{pacienteSelecionado.telefone || '(11) 90000-0000'}</p>
                  <p className="text-sm font-medium text-gray-600 mt-1">{pacienteSelecionado.bairro}, São Paulo - SP</p>
                </div>
                <button onClick={() => adotarPaciente(pacienteSelecionado)} className="w-full mt-4 bg-[#FF8C00] text-white font-bold py-3.5 rounded-xl hover:bg-[#E67E22] transition-colors shadow-md flex items-center justify-center gap-2">
                  <Target size={18} /> Adotar Paciente
                </button>
              </div>
            </div>
            <div className="bg-gray-100 md:w-1/2 h-[300px] md:h-auto relative">
              <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur px-3 py-1.5 rounded-lg shadow-sm border border-gray-200 pointer-events-none"><p className="text-[10px] font-bold text-gray-500 uppercase">Geolocalização</p></div>
              <iframe width="100%" height="100%" style={{ border: 0 }} loading="lazy" allowFullScreen src={`https://maps.google.com/maps?q=${encodeURIComponent(pacienteSelecionado.bairro + ", São Paulo, SP")}&t=&z=14&ie=UTF8&iwloc=&output=embed`} title="Mapa"></iframe>
            </div>
          </div>
        </div>
      )}

      {fichaAtiva && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[2000] flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-xl rounded-3xl shadow-2xl overflow-hidden animate-scale-in">

            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50">
              <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2"><User size={20} className="text-[#FF8C00]" /> Ficha Clínica</h2>
              <button onClick={() => setFichaAtiva(null)} className="text-gray-400 hover:text-red-500 transition-colors p-1"><X size={20} /></button>
            </div>

            <div className="p-8">
              <div className="flex justify-between items-center mb-6 pb-6 border-b border-dashed border-gray-200">
                <div>
                  <h3 className="text-2xl font-black text-gray-800">{fichaAtiva.nome}</h3>
                  <p className="text-sm text-gray-500 flex items-center gap-2 mt-1"><MapPin size={14} /> {fichaAtiva.bairro} | <Phone size={14} /> {fichaAtiva.telefone || '(11) 90000-0000'}</p>
                </div>
                <div className="w-16 h-16 bg-orange-100 text-orange-500 rounded-2xl flex items-center justify-center font-black text-2xl border-2 border-orange-200">
                  {fichaAtiva.idade}
                </div>
              </div>

              <form onSubmit={agendarConsulta} className="space-y-5">
                <h4 className="font-bold text-gray-800 flex items-center gap-2"><Calendar size={18} className="text-[#8dc63f]" /> Agendar Nova Consulta</h4>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Data</label>
                    <input type="date" required value={novoAgendamento.data} onChange={(e) => setNovoAgendamento({ ...novoAgendamento, data: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00]" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Horário</label>
                    <input type="time" required value={novoAgendamento.hora} onChange={(e) => setNovoAgendamento({ ...novoAgendamento, hora: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00]" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-gray-500 mb-1.5 uppercase tracking-wide">Procedimento Clínico</label>
                  <select required value={novoAgendamento.tipo} onChange={(e) => setNovoAgendamento({ ...novoAgendamento, tipo: e.target.value })} className="w-full bg-gray-50 border border-gray-200 rounded-xl px-4 py-3 text-sm text-gray-700 outline-none focus:border-[#FF8C00] focus:ring-1 focus:ring-[#FF8C00] appearance-none cursor-pointer">
                    <option value="Primeira Consulta - Avaliação">Primeira Consulta - Avaliação</option>
                    <option value="Restauração (Cárie)">Restauração (Cárie)</option>
                    <option value="Limpeza (Profilaxia)">Limpeza (Profilaxia)</option>
                    <option value="Canal (Endodontia)">Canal (Endodontia)</option>
                    <option value="Extração Simples">Extração Simples</option>
                  </select>
                </div>

                <button type="submit" className="w-full mt-4 bg-[#8dc63f] text-white font-bold py-4 rounded-xl hover:bg-[#7ebd34] transition-colors shadow-sm flex items-center justify-center gap-2 text-lg">
                  Confirmar Agendamento
                </button>
              </form>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}