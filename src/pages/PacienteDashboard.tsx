import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { LayoutDashboard, LogOut, Clock, CalendarDays, Users, ClipboardList, Activity, CheckCircle2, AlertCircle } from 'lucide-react';

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
  pais: string;
  cidade: string;
}

export function PacienteDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem("usuarioLogado") || "Lucas Almeida";
  const userRole = sessionStorage.getItem("userRole");
  
  // Se o login não guardou o userId, usamos o ID 1 por defeito (Lucas Almeida)
  const userId = sessionStorage.getItem("userId") || "1"; 
  
  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'triagem'>('painel');
  const [historicoPaciente, setHistoricoPaciente] = useState<HistoricoConsulta[]>([]);
  const [fichaEnviada, setFichaEnviada] = useState(false);
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const { register, handleSubmit, formState: { errors } } = useForm<TriagemFormData>({
    defaultValues: { tipoDor: 'leve' }
  });

  useEffect(() => {
    if (!sessionStorage.getItem("usuarioLogado") || userRole !== "paciente") {
      navigate('/login');
      return;
    }
    
    // FETCH REAL: Busca o histórico na Base de Dados usando o ID do Paciente!
    fetch(`https://dentista-na-nuvem-production.up.railway.app/pacientes/${userId}/historico`)
      .then(res => res.json())
      .then(data => {
        if(Array.isArray(data)) {
          setHistoricoPaciente(data);
        }
      })
      .catch(err => console.error("Erro ao buscar histórico:", err));
      
  }, [navigate, userRole, userId]);

  const handleLogout = () => {
    sessionStorage.clear();
    navigate('/login');
  };

  const onSubmit = async (data: TriagemFormData) => {
    try {
      const response = await fetch('https://dentista-na-nuvem-production.up.railway.app/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: usuarioLogado,
          idade: Number(data.idade),
          rendaSalarioMinimo: Number(data.renda),
          tipoDor: data.tipoDor,
          tempoDorDias: Number(data.diasDor),
          pais: data.pais,
          cidade: data.cidade,
        }),
      });
      if (response.ok) {
        setMensagemSucesso('Ficha de triagem enviada com sucesso! Aguarde o contacto de um dentista voluntário.');
        setFichaEnviada(true);
        setTimeout(() => {
          setTelaAtiva('painel');
          setMensagemSucesso('');
        }, 4000);
      } else {
        setMensagemSucesso('Erro ao enviar triagem. Tente novamente.');
      }
    } catch {
      setMensagemSucesso('Erro de conexão com o servidor.');
    }
  };

  return (
    <div className="flex min-h-screen bg-[#F5F5DC] font-sans pt-[65px] items-start">
      <aside className="w-[260px] min-w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-[65px] self-start h-[calc(100vh-65px)] z-10 shadow-sm">
        <div className="p-6 border-b border-gray-100 flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center font-bold text-xl border border-blue-100">
            {usuarioLogado.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="text-sm font-bold text-gray-800 truncate w-[160px]">{usuarioLogado}</p>
            <p className="text-[0.7rem] uppercase tracking-wider text-gray-500 font-semibold">Beneficiário TdB</p>
          </div>
        </div>

        <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
          <button onClick={() => setTelaAtiva('painel')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${telaAtiva === 'painel' ? 'bg-blue-500 text-white shadow-sm hover:bg-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <LayoutDashboard size={20} /> O Meu Painel
          </button>
          <button onClick={() => setTelaAtiva('triagem')} className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-colors ${telaAtiva === 'triagem' ? 'bg-blue-500 text-white shadow-sm hover:bg-blue-600' : 'text-gray-500 hover:bg-gray-50'}`}>
            <ClipboardList size={20} /> Ficha de Triagem
          </button>
        </nav>

        <div className="p-4 border-t border-gray-100">
          <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-red-500 transition-colors">
            <LogOut size={20} /> Sair
          </button>
        </div>
      </aside>

      <main className="flex-1 p-6 md:p-8 max-w-[1000px] mx-auto w-full relative">
        
        {mensagemSucesso && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 z-50 bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9] px-6 py-3 rounded-xl shadow-lg font-bold animate-fade-in flex items-center gap-2 w-max">
            <CheckCircle2 size={20}/> {mensagemSucesso}
          </div>
        )}

        {telaAtiva === 'painel' && (
          <div className="animate-fade-in space-y-8">
            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-3xl font-black text-gray-800 mb-2">Olá, {usuarioLogado}! 👋</h2>
                <p className="text-gray-500 text-lg">Bem-vindo ao seu painel da Turma do Bem.</p>
              </div>
              {!fichaEnviada && (
                <button onClick={() => setTelaAtiva('triagem')} className="bg-[#FF8C00] text-white px-6 py-3 rounded-xl font-bold hover:bg-[#E67E22] transition-colors shadow-md flex items-center gap-2 whitespace-nowrap">
                  <ClipboardList size={20}/> Preencher Triagem
                </button>
              )}
            </div>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="p-6 border-b border-gray-100 bg-gray-50/50 flex items-center gap-3">
                <div className="bg-blue-100 p-2 rounded-lg text-blue-500"><Activity size={20}/></div>
                <h3 className="font-bold text-gray-800 text-lg">O Meu Histórico e Consultas</h3>
              </div>
              
              <div className="p-6">
                <div className="relative border-l-2 border-gray-100 ml-4 space-y-8">
                  {historicoPaciente.length > 0 ? (
                    historicoPaciente.map((item, idx) => (
                      <div key={idx} className="relative pl-8">
                        <div className={`absolute w-6 h-6 rounded-full -left-[13px] top-0 border-4 border-white shadow-sm flex items-center justify-center ${item.status === 'Agendado' ? 'bg-[#FF8C00]' : 'bg-green-500'}`}>
                          {item.status === 'Agendado' ? <Clock size={10} className="text-white"/> : <CheckCircle2 size={10} className="text-white"/>}
                        </div>
                        <div className="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start mb-2">
                            <h4 className="font-bold text-gray-800 text-lg">{item.titulo}</h4>
                            <span className={`text-[10px] font-bold uppercase px-2 py-1 rounded-md ${item.status === 'Agendado' ? 'bg-orange-50 text-orange-600' : 'bg-green-50 text-green-600'}`}>
                              {item.status}
                            </span>
                          </div>
                          {item.proc && <p className="text-gray-600 text-sm mb-3 font-medium">{item.proc}</p>}
                          <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-gray-500">
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg"><CalendarDays size={14}/> {item.data}</span>
                            {item.hora && <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg"><Clock size={14}/> {item.hora}</span>}
                            <span className="flex items-center gap-1.5 bg-gray-50 px-2.5 py-1.5 rounded-lg"><Users size={14}/> Dr(a). {item.dentista}</span>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-gray-500 text-sm pl-4">Ainda não possui histórico de consultas. Preencha a Ficha de Triagem.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}

        {telaAtiva === 'triagem' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6 flex items-center gap-3">
              <div className="bg-blue-100 p-3 rounded-xl text-blue-500">
                <ClipboardList size={24} />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800">Ficha de Triagem</h2>
                <p className="text-gray-500 text-sm">Responda para que a nossa IA encontre o dentista mais adequado.</p>
              </div>
            </div>

            <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm">
              {fichaEnviada ? (
                <div className="text-center py-10">
                  <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
                    <CheckCircle2 size={40} />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-800 mb-2">Ficha Recebida!</h3>
                  <p className="text-gray-500 max-w-sm mx-auto">A sua situação foi registada e priorizada pelo nosso sistema. Um dentista da sua região entrará em contacto em breve.</p>
                </div>
              ) : (
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">A sua Idade</label>
                      <input type="number" min="0" max="18" placeholder="Ex: 15" {...register("idade", { required: true })} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.idade ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none`} />
                      {errors.idade && <span className="text-red-500 text-xs mt-1">Apenas menores de 18 anos</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Renda Familiar (Salários Mínimos)</label>
                      <input type="number" step="0.5" min="0" placeholder="Ex: 1.5" {...register("renda", { required: true })} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.renda ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-blue-500 focus:border-blue-500 outline-none`} />
                      {errors.renda && <span className="text-red-500 text-xs mt-1">Campo obrigatório</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-5 bg-orange-50/50 border border-orange-100 rounded-2xl">
                    <div className="md:col-span-2">
                      <h4 className="font-bold text-orange-800 text-sm flex items-center gap-2 mb-4"><AlertCircle size={16}/> Avaliação da Dor</h4>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Intensidade da Dor</label>
                      <select {...register("tipoDor", { required: true })} className="w-full px-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none">
                        <option value="leve">Leve (Apenas incômodo)</option>
                        <option value="moderada">Moderada (Dói ao mastigar)</option>
                        <option value="forte">Forte (Não consegue dormir)</option>
                        <option value="dente quebrado">Dente Quebrado/Acidente</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Dias com Dor</label>
                      <input type="number" min="0" placeholder="Ex: 5" {...register("diasDor", { required: true })} className={`w-full px-4 py-2.5 bg-white border ${errors.diasDor ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-orange-500 focus:border-orange-500 outline-none`} />
                      {errors.diasDor && <span className="text-red-500 text-xs mt-1">Campo obrigatório</span>}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">País</label>
                      <select {...register("pais", { required: true })} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.pais ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none`}>
                        <option value="">Selecione...</option>
                        <option value="Brasil">Brasil</option>
                        <option value="Argentina">Argentina</option>
                        <option value="Colômbia">Colômbia</option>
                        <option value="México">México</option>
                        <option value="Chile">Chile</option>
                      </select>
                      {errors.pais && <span className="text-red-500 text-xs mt-1">Campo obrigatório</span>}
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-gray-700 mb-1.5">Cidade</label>
                      <input type="text" placeholder="Ex: Bogotá" {...register("cidade", { required: true })} className={`w-full px-4 py-2.5 bg-gray-50 border ${errors.cidade ? 'border-red-500' : 'border-gray-300'} rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none`} />
                      {errors.cidade && <span className="text-red-500 text-xs mt-1">Campo obrigatório</span>}
                    </div>
                  </div>

                  <button type="submit" className="w-full bg-blue-500 text-white font-bold py-4 rounded-xl hover:bg-blue-600 transition-colors shadow-md text-lg mt-4">
                    Enviar para Avaliação
                  </button>
                </form>
              )}
            </div>
          </div>
        )}

      </main>
    </div>
  );
}