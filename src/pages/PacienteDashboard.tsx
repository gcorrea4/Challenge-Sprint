import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LayoutDashboard, LogOut, Clock, FileText, CalendarDays, MapPin, Users, ClipboardList, Activity, CheckCircle2 } from 'lucide-react';

interface HistoricoConsulta {
  id?: number;
  titulo?: string;
  status?: string;
  data?: string;
  hora?: string;
  proc?: string;
  dentista?: string;
}

interface TriagemFormData {
  idade: string;
  renda: string;
  tipoDor: string;
  diasDor: string;
  bairro: string;
}

export function PacienteDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem("usuarioLogado") || "Paciente";
  const userRole = sessionStorage.getItem("userRole");
  
  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'triagem'>('painel');
  const [historicoPaciente, setHistoricoPaciente] = useState<HistoricoConsulta[]>([]);
  const [fichaEnviada, setFichaEnviada] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<TriagemFormData>({
    defaultValues: { tipoDor: 'leve' }
  });

  useEffect(() => {
    if (!sessionStorage.getItem("usuarioLogado") || (userRole !== "paciente" && userRole !== "dev")) {
      navigate('/login');
      return;
    }
    
    fetch(`http://127.0.0.1:8000/paciente/historico/${usuarioLogado}`)
      .then(res => {
        if (!res.ok) throw new Error("Erro 404");
        return res.json();
      })
      .then(data => {
        if (Array.isArray(data)) setHistoricoPaciente(data);
        else setHistoricoPaciente([]);
      })
      .catch(() => setHistoricoPaciente([]));
  }, [navigate, usuarioLogado, userRole]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const onTriagemSubmit = (data: TriagemFormData) => {
    console.log("Enviando triagem de:", usuarioLogado, data);
    setFichaEnviada(true);
    setMensagemSucesso("Sua triagem foi enviada com sucesso! Você entrou na fila de prioridade.");
    setTimeout(() => {
      setMensagemSucesso('');
      setTelaAtiva('painel');
    }, 3000);
  };

  const renderSidebar = () => (
    <aside className="w-[260px] min-w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-[65px] self-start h-[calc(100vh-65px)] z-10 shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#FFF3E0] text-[#FF8C00] flex items-center justify-center font-bold text-xl border border-orange-100">
          {usuarioLogado.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 leading-tight truncate w-[160px]">{usuarioLogado}</p>
          <p className="text-[0.7rem] uppercase tracking-wider text-gray-500 font-semibold">
            {userRole === 'dev' ? 'Desenvolvedor' : 'Beneficiário'}
          </p>
        </div>
      </div>
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        <button onClick={() => setTelaAtiva('painel')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${telaAtiva === 'painel' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
          <LayoutDashboard size={20} /> Meu Painel
        </button>
        <button onClick={() => setTelaAtiva('triagem')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${telaAtiva === 'triagem' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}>
          <ClipboardList size={20} /> Fazer Triagem
        </button>
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 transition-all"><LogOut size={20} /> Sair</button>
      </div>
    </aside>
  );

  const concluidas = historicoPaciente.filter(h => h.status === 'Concluído').length;
  const proximaConsulta = historicoPaciente.find(h => h.status === 'Agendado');

  let diaLaranja = '--';
  let mesAnoLaranja = 'Nenhuma';
  if (proximaConsulta && proximaConsulta.data) {
      const parts = proximaConsulta.data.split('/');
      if(parts.length >= 3) {
          diaLaranja = parts[0];
          const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
          mesAnoLaranja = `${meses[parseInt(parts[1])-1]} ${parts[2]}`;
      }
  }

  return (
    <div className="flex min-h-screen bg-[#F5F5DC] font-sans pt-[65px] items-start">
      {renderSidebar()}
      
      <main className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full animate-fade-in space-y-6">
        
        {telaAtiva === 'painel' && (
          <>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Olá, {usuarioLogado.split(' ')[0]}! 😊</h2>
              <p className="text-gray-500">Acompanhe suas consultas e histórico de atendimentos.</p>
            </div>

            {!fichaEnviada && (
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-orange-800">Sua ficha clínica está incompleta!</h4>
                  <p className="text-sm text-orange-600">Para entrar na fila de atendimento dos dentistas, preencha sua triagem.</p>
                </div>
                <button onClick={() => setTelaAtiva('triagem')} className="bg-[#FF8C00] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-[#e67e22]">
                  Preencher Agora
                </button>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative"><h3 className="text-gray-500 text-xs font-bold mb-2 uppercase">Consultas Realizadas</h3><p className="text-4xl font-black text-gray-800">{concluidas}</p><div className="absolute top-5 right-5 text-[#8dc63f] bg-[#8dc63f]/10 p-2.5 rounded-lg"><CalendarDays size={24}/></div></div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative"><h3 className="text-gray-500 text-xs font-bold mb-2 uppercase">Próxima Consulta</h3><p className="text-4xl font-black text-gray-800">{proximaConsulta ? proximaConsulta.data?.substring(0, 5) : '--/--'}</p><div className="absolute top-5 right-5 text-[#FF8C00] bg-[#FF8C00]/10 p-2.5 rounded-lg"><Clock size={24}/></div></div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative"><h3 className="text-gray-500 text-xs font-bold mb-2 uppercase">Procedimentos</h3><p className="text-4xl font-black text-gray-800">{historicoPaciente.length}</p><div className="absolute top-5 right-5 text-gray-400 bg-gray-100 p-2.5 rounded-lg"><FileText size={24}/></div></div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              {/* Próxima Consulta */}
              <div className="lg:col-span-7">
                <div className="bg-[#FFF8F0] border border-[#FFE0B2] rounded-2xl p-6 shadow-sm h-full">
                  <h3 className="text-lg font-bold text-[#FF8C00] mb-4 flex items-center gap-2"><CalendarDays size={20}/> Sua Próxima Consulta</h3>
                  <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="bg-white p-6 rounded-xl text-center min-w-[160px] shadow-sm"><p className="text-[#FF8C00] text-4xl font-black mb-1">{diaLaranja}</p><p className="text-gray-800 font-bold">{mesAnoLaranja}</p></div>
                    <div className="flex-1 w-full space-y-2 text-gray-700 bg-white/50 p-4 rounded-xl border border-orange-50">
                      <p className="text-xl font-bold text-gray-800 mb-2">{proximaConsulta ? proximaConsulta.titulo : 'Você não tem consultas agendadas.'}</p>
                      {proximaConsulta && (
                        <><p className="flex items-center gap-2 text-sm"><Clock size={16} className="text-gray-400"/> <strong>Horário:</strong> {proximaConsulta.hora || 'A definir'}</p>
                        <p className="flex items-center gap-2 text-sm"><Users size={16} className="text-gray-400"/> <strong>Dentista:</strong> {proximaConsulta.dentista}</p>
                        <p className="flex items-center gap-2 text-sm"><MapPin size={16} className="text-gray-400"/> <strong>Local:</strong> Consultório TdB</p></>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* MÓDULO DE HISTÓRICO / LINHA DO TEMPO */}
              <div className="lg:col-span-5">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 h-full">
                  <h3 className="text-lg font-bold text-gray-800 mb-6 flex items-center gap-2"><Activity size={20} className="text-[#8dc63f]"/> Histórico de Tratamento</h3>
                  
                  <div className="relative border-l-2 border-gray-100 ml-3 space-y-6">
                    
                    {/* Status Fixo de Cadastro - Mostra para todos */}
                    <div className="relative pl-6">
                      <div className="absolute w-5 h-5 bg-[#8dc63f] rounded-full -left-[11px] top-0.5 border-4 border-white shadow-sm flex items-center justify-center">
                        <CheckCircle2 size={10} className="text-white" />
                      </div>
                      <p className="text-xs font-bold text-gray-400 mb-1">Início</p>
                      <div className="bg-gray-50 p-4 rounded-xl border border-gray-100">
                        <h4 className="font-bold text-gray-700 text-sm">Cadastro Aprovado</h4>
                        <p className="text-xs text-gray-500 mt-1">Sua conta foi ativada no sistema Turma do Bem.</p>
                      </div>
                    </div>

                    {/* Mostra a triagem se o usuário clicou no botão preencher (fica dinâmico) */}
                    {fichaEnviada && (
                      <div className="relative pl-6 animate-fade-in">
                        <div className="absolute w-5 h-5 bg-[#FF8C00] rounded-full -left-[11px] top-0.5 border-4 border-white shadow-sm"></div>
                        <p className="text-xs font-bold text-gray-400 mb-1">Hoje</p>
                        <div className="bg-orange-50 p-4 rounded-xl border border-orange-100">
                          <h4 className="font-bold text-orange-800 text-sm">Triagem Realizada</h4>
                          <p className="text-xs text-orange-600 mt-1">Dados enviados. Você já está na fila inteligente aguardando um dentista voluntário.</p>
                        </div>
                      </div>
                    )}

                    {/* Histórico vindo do Banco de Dados */}
                    {historicoPaciente.filter(h => h.status === 'Concluído').map((item, idx) => (
                      <div key={idx} className="relative pl-6">
                        <div className="absolute w-5 h-5 bg-blue-500 rounded-full -left-[11px] top-0.5 border-4 border-white shadow-sm"></div>
                        <p className="text-xs font-bold text-gray-400 mb-1">{item.data}</p>
                        <div className="bg-blue-50 p-4 rounded-xl border border-blue-100">
                          <h4 className="font-bold text-blue-800 text-sm">{item.proc}</h4>
                          <p className="text-xs text-blue-600 mt-1">Finalizado por {item.dentista}</p>
                        </div>
                      </div>
                    ))}

                  </div>
                </div>
              </div>
            </div>
          </>
        )}

        {telaAtiva === 'triagem' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Formulário de Triagem</h2>
              <p className="text-gray-500">Avalie sua dor para entrarmos em contato com o dentista mais próximo.</p>
            </div>

            {mensagemSucesso && (
              <div className="bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] p-4 rounded-lg mb-6 font-semibold text-center shadow-sm">
                {mensagemSucesso}
              </div>
            )}

            <form onSubmit={handleSubmit(onTriagemSubmit)} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Idade</label>
                  <input type="number" min="0" placeholder="Ex: 15" {...register("idade", { required: true })} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.idade ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none`} />
                  {errors.idade && <span className="text-red-500 text-xs mt-1">Campo obrigatório</span>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Renda (Salários)</label>
                  <input type="number" min="0" step="0.1" placeholder="Ex: 1.5" {...register("renda", { required: true })} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.renda ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none`} />
                  {errors.renda && <span className="text-red-500 text-xs mt-1">Campo obrigatório</span>}
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Tipo de Dor</label>
                  <select {...register("tipoDor", { required: true })} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.tipoDor ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] outline-none`}>
                    <option value="leve">Leve</option>
                    <option value="forte">Forte</option>
                    <option value="dente quebrado">Dente Quebrado (Urgência)</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Dias com Dor</label>
                  <input type="number" min="0" placeholder="Ex: 5" {...register("diasDor", { required: true })} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.diasDor ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none`} />
                  {errors.diasDor && <span className="text-red-500 text-xs mt-1">Campo obrigatório</span>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Bairro de Residência</label>
                  <input type="text" placeholder="Ex: Tatuapé" {...register("bairro", { required: true })} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.bairro ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none`} />
                  {errors.bairro && <span className="text-red-500 text-xs mt-1">Campo obrigatório</span>}
                </div>
              </div>
              <div className="pt-4">
                <button type="submit" className="w-full bg-[#FF8C00] text-white font-bold py-3 rounded-lg hover:bg-[#E67E22] transition-colors">
                  Salvar e Entrar na Fila
                </button>
              </div>
            </form>
          </div>
        )}
      </main>
    </div>
  );
}