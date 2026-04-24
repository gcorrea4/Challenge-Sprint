import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, LogOut, CheckCircle2, Clock, FileText, CalendarDays, MapPin, Users, ClipboardList } from 'lucide-react';

export function PacienteDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem("usuarioLogado") || "Paciente";
  const userRole = sessionStorage.getItem("userRole");
  
  // Controle de qual tela mostrar no Dashboard
  const [telaAtiva, setTelaAtiva] = useState<'painel' | 'triagem'>('painel');
  const [historicoPaciente, setHistoricoPaciente] = useState<any[]>([]);

  // Estado do formulário de triagem
  const [formData, setFormData] = useState({
    idade: '', renda: '', tipoDor: 'leve', diasDor: '', bairro: ''
  });

  useEffect(() => {
    // Segurança
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

  const handleTriagemSubmit = (e: any) => {
    e.preventDefault();
    console.log("Enviando triagem de:", usuarioLogado, formData);
    alert("Sua triagem foi enviada com sucesso! Você entrou na fila de prioridade.");
    setTelaAtiva('painel'); 
  };

  const renderSidebar = () => (
    // 👇 SOLUÇÃO: sticky, top-[65px] e self-start 👇
    <aside className="w-[260px] min-w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-[65px] self-start h-[calc(100vh-65px)] z-10 shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#FFF3E0] text-[#FF8C00] flex items-center justify-center font-bold text-xl border-2 border-[#FF8C00]">
          {usuarioLogado.charAt(0).toUpperCase()}
        </div>
        <div>
          <p className="text-sm font-bold text-gray-800 leading-tight truncate w-[160px]">{usuarioLogado}</p>
          <p className="text-[0.7rem] uppercase tracking-wider text-[#FF8C00] font-bold">
            {userRole === 'dev' ? 'Desenvolvedor' : 'Beneficiário'}
          </p>
        </div>
      </div>
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        <button 
          onClick={() => setTelaAtiva('painel')}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${telaAtiva === 'painel' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <LayoutDashboard size={20} /> Meu Painel
        </button>
        <button 
          onClick={() => setTelaAtiva('triagem')}
          className={`flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold transition-all ${telaAtiva === 'triagem' ? 'bg-[#FF8C00] text-white shadow-md' : 'text-gray-500 hover:bg-gray-50'}`}
        >
          <ClipboardList size={20} /> Fazer Triagem
        </button>
      </nav>
      <div className="p-4 border-t border-gray-100">
        <button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all"><LogOut size={20} /> Sair</button>
      </div>
    </aside>
  );

  const historyArray = Array.isArray(historicoPaciente) ? historicoPaciente : [];
  const concluidas = historyArray.filter(h => h.status === 'Concluído').length;
  const proximaConsulta = historyArray.find(h => h.status === 'Agendado');

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
    // 👇 SOLUÇÃO: items-start no container pai 👇
    <div className="flex min-h-screen bg-[#F5F5DC] font-sans pt-[65px] items-start">
      {renderSidebar()}
      
      {/* 👇 SOLUÇÃO: Remoção do md:ml-[260px] da tag main 👇 */}
      <main className="flex-1 p-6 md:p-10 max-w-[1600px] mx-auto w-full animate-fade-in space-y-6">
        
        {/* === TELA 1: MEU PAINEL === */}
        {telaAtiva === 'painel' && (
          <>
            <div>
              <h2 className="text-3xl font-bold text-gray-800">Olá, {usuarioLogado.split(' ')[0]}! 😊</h2>
              <p className="text-gray-500">Acompanhe suas consultas e histórico de atendimentos.</p>
            </div>

            <div className="bg-orange-50 border border-orange-200 rounded-xl p-4 flex items-center justify-between">
              <div>
                <h4 className="font-bold text-orange-800">Sua ficha clínica está incompleta!</h4>
                <p className="text-sm text-orange-600">Para entrar na fila de atendimento dos dentistas, preencha sua triagem.</p>
              </div>
              <button onClick={() => setTelaAtiva('triagem')} className="bg-[#FF8C00] text-white px-4 py-2 rounded-lg font-bold text-sm shadow-sm hover:bg-[#e67e22]">
                Preencher Agora
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative"><h3 className="text-gray-500 text-xs font-bold mb-2 uppercase">Consultas Realizadas</h3><p className="text-4xl font-black text-gray-800">{concluidas}</p><div className="absolute top-5 right-5 text-[#8dc63f] bg-[#8dc63f]/10 p-2.5 rounded-lg"><CalendarDays size={24}/></div></div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative"><h3 className="text-gray-500 text-xs font-bold mb-2 uppercase">Próxima Consulta</h3><p className="text-4xl font-black text-gray-800">{proximaConsulta ? proximaConsulta.data.substring(0, 5) : '--/--'}</p><div className="absolute top-5 right-5 text-[#FF8C00] bg-[#FF8C00]/10 p-2.5 rounded-lg"><Clock size={24}/></div></div>
              <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm relative"><h3 className="text-gray-500 text-xs font-bold mb-2 uppercase">Procedimentos</h3><p className="text-4xl font-black text-gray-800">{historyArray.length}</p><div className="absolute top-5 right-5 text-gray-400 bg-gray-100 p-2.5 rounded-lg"><FileText size={24}/></div></div>
            </div>

            <div className="bg-[#FFF8F0] border border-[#FFE0B2] rounded-2xl p-6 shadow-sm">
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
          </>
        )}

        {/* === TELA 2: FORMULÁRIO DE TRIAGEM === */}
        {telaAtiva === 'triagem' && (
          <div className="animate-fade-in max-w-2xl mx-auto">
            <div className="mb-6">
              <h2 className="text-3xl font-bold text-gray-800">Formulário de Triagem</h2>
              <p className="text-gray-500">Avalie sua dor para entrarmos em contato com o dentista mais próximo.</p>
            </div>

            <form onSubmit={handleTriagemSubmit} className="bg-white p-8 rounded-2xl shadow-sm border border-gray-200 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                
                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Idade</label>
                  <input 
                    type="number" required min="0" placeholder="Ex: 15"
                    value={formData.idade} onChange={(e) => setFormData({...formData, idade: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Renda (Salários)</label>
                  <input 
                    type="number" required min="0" step="0.1" placeholder="Ex: 1.5"
                    value={formData.renda} onChange={(e) => setFormData({...formData, renda: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Tipo de Dor</label>
                  <select 
                    value={formData.tipoDor} onChange={(e) => setFormData({...formData, tipoDor: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] outline-none"
                  >
                    <option value="leve">Leve</option>
                    <option value="forte">Forte</option>
                    <option value="dente quebrado">Dente Quebrado (Urgência)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Dias com Dor</label>
                  <input 
                    type="number" required min="0" placeholder="Ex: 5"
                    value={formData.diasDor} onChange={(e) => setFormData({...formData, diasDor: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-bold text-gray-700 mb-1.5">Bairro de Residência</label>
                  <input 
                    type="text" required placeholder="Ex: Tatuapé"
                    value={formData.bairro} onChange={(e) => setFormData({...formData, bairro: e.target.value})}
                    className="w-full px-4 py-2.5 bg-gray-50 border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none"
                  />
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