import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import tdb from '../img/tdb.png';

type Paciente = {
  nome: string;
  idade: number;
  urgencia: number;
  tipo_dor: string;
  tempo_dor: number;
  renda: number;
  bairro: string;
};

export function SolucaoDashboard() {
  const [pacientes, setPacientes] = useState<Paciente[]>([]);
  const [busca, setBusca] = useState(''); 
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null); 

  const [perguntaIA, setPerguntaIA] = useState('');
  const [respostaIA, setRespostaIA] = useState('');
  const [carregandoIA, setCarregandoIA] = useState(false);
  const [chatAberto, setChatAberto] = useState(false);

  const [meusStats, setMeusStats] = useState({ graves: 0, medios: 0, leves: 0 });

  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userRole"); 
  const usuarioLogado = sessionStorage.getItem("usuarioLogado") || "Dentista Voluntário";
  
  
  const meuBairro = sessionStorage.getItem("dentistaBairro") || "Tatuapé";

  const carregarDados = async () => {
    try {
      const response = await fetch('http://127.0.0.1:8000/pacientes');
      const dados = await response.json();
      setPacientes(dados);
    } catch (error) {
      console.error("Erro ao conectar com a API:", error);
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("usuarioLogado")) {
      navigate('/login');
    } else {
      carregarDados();
      
      const savedStats = localStorage.getItem(`stats_${usuarioLogado}`);
      if (savedStats) {
        setMeusStats(JSON.parse(savedStats));
      }
    }
  }, [navigate, usuarioLogado]);

  const finalizarAtendimento = async () => {
    if (!pacienteSelecionado) return;

    const confirmacao = window.confirm(`Tem certeza que deseja finalizar a triagem de ${pacienteSelecionado.nome}? Ele sairá da fila.`);
    if (confirmacao) {
      try {
        await fetch(`http://127.0.0.1:8000/paciente/${pacienteSelecionado.nome}`, { method: 'DELETE' });
        
        const urgencia = pacienteSelecionado.urgencia;
        const newStats = { ...meusStats };
        
        if (urgencia >= 6) newStats.graves++;
        else if (urgencia >= 4) newStats.medios++;
        else newStats.leves++;

        setMeusStats(newStats);
        localStorage.setItem(`stats_${usuarioLogado}`, JSON.stringify(newStats)); 

        setPacientes(pacientes.filter(p => p.nome !== pacienteSelecionado.nome));
        setPacienteSelecionado(null); 
      } catch (error) {
        alert("Erro ao concluir o atendimento.");
      }
    }
  };

  const perguntarParaIA = async () => {
    if (!perguntaIA.trim()) return;
    setCarregandoIA(true);
    try {
      const res = await fetch('http://127.0.0.1:8000/IA/consultar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ texto: perguntaIA })
      });
      const data = await res.json();
      setRespostaIA(data.resposta);
    } catch (err) {
      setRespostaIA("Erro ao conectar com a IA. Verifique se o servidor Python está rodando.");
    }
    setCarregandoIA(false);
  };

  const renderPrioridade = (nivel: number) => {
    if (nivel >= 6) return <span className="text-red-500 font-bold">Alta (Urgente)</span>;
    if (nivel >= 4) return <span className="text-[#FFAF00] font-bold">Média (Atenção)</span>;
    return <span className="text-green-500 font-bold">Baixa (Rotina)</span>;
  };

  
  const filaDoMeuConsultorio = pacientes.filter(
    p => p.bairro && p.bairro.toLowerCase() === meuBairro.toLowerCase()
  );

  
  const pacientesFiltrados = filaDoMeuConsultorio.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

  
  const graves = filaDoMeuConsultorio.filter(p => p.urgencia >= 6).length;
  const medios = filaDoMeuConsultorio.filter(p => p.urgencia >= 4 && p.urgencia < 6).length;
  const leves = filaDoMeuConsultorio.filter(p => p.urgencia < 4).length;

  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans pt-[120px] pb-[60px] px-[20px] md:px-[5%] relative">
      <div className="max-w-[1200px] mx-auto">
        
        <div className="text-center mb-[50px]">
          <h2 className="text-[#333333] text-[2rem] md:text-[2.8rem] font-bold mt-0 mb-[15px] leading-tight">
            Painel de <span className="text-[#FF8C00]">Impacto Social</span>
          </h2>
          <p className="text-[#555555] text-[16px] md:text-[18px] max-w-[800px] mx-auto leading-relaxed">
            {userRole === 'dentista' 
              ? "Interface de gestão de atendimentos e prontuários para dentistas voluntários."
              : "Acompanhe em tempo real como a Turma do Bem está transformando vidas através da odontologia."}
          </p>
        </div>

        
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] md:gap-[30px] mb-[40px]">
          <div className="bg-white p-[25px] rounded-[12px] shadow-sm border-l-[5px] border-[#FF8C00]">
            <p className="text-[#666] font-bold text-[0.9rem] uppercase tracking-[1px] m-0">Pacientes na Fila Global</p>
            <h3 className="text-[#333] text-[2.5rem] font-[900] m-0 mt-[10px]">{pacientes.length}</h3>
          </div>
          <div className="bg-white p-[25px] rounded-[12px] shadow-sm border-l-[5px] border-[#4CAF50]">
            <p className="text-[#666] font-bold text-[0.9rem] uppercase tracking-[1px] m-0">Sorrisos Transformados</p>
            <h3 className="text-[#333] text-[2.5rem] font-[900] m-0 mt-[10px]">47</h3>
          </div>
          <div className="bg-white p-[25px] rounded-[12px] shadow-sm border-l-[5px] border-[#2196F3]">
            <p className="text-[#666] font-bold text-[0.9rem] uppercase tracking-[1px] m-0">Horas Voluntárias</p>
            <h3 className="text-[#333] text-[2.5rem] font-[900] m-0 mt-[10px]">142h</h3>
          </div>
        </div>

        
        {userRole === 'dentista' ? (
          <>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-[30px] mb-[50px]">
              
              
              <div className="bg-white p-[25px] rounded-[12px] shadow-sm border border-[#eee]">
                <h3 className="m-0 text-[#333] text-[1.2rem] font-bold mb-4 flex items-center justify-between">
                  Fila do Meu Consultório
                  <span className="text-xs font-bold text-gray-500 bg-gray-100 px-3 py-1 rounded-full border uppercase">
                    📍 Bairro: {meuBairro}
                  </span>
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <span className="text-red-500 font-bold text-2xl">{graves}</span>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Graves (Espera)</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <span className="text-[#FF8C00] font-bold text-2xl">{medios}</span>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Médios (Espera)</p>
                  </div>
                  <div className="bg-gray-50 p-3 rounded-lg border">
                    <span className="text-green-600 font-bold text-2xl">{leves}</span>
                    <p className="text-[10px] text-gray-500 font-bold uppercase mt-1">Leves (Espera)</p>
                  </div>
                </div>
              </div>

              
              <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-[25px] rounded-[12px] shadow-sm border border-blue-200 relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10 text-5xl">👨‍⚕️</div>
                <h3 className="m-0 text-[#333] text-[1.2rem] font-bold mb-4 flex items-center justify-between relative z-10">
                  Meu Desempenho
                  <span className="text-xs font-bold text-blue-700 bg-blue-200 px-3 py-1 rounded-full">
                    {usuarioLogado}
                  </span>
                </h3>
                <div className="grid grid-cols-3 gap-3 text-center relative z-10">
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    <span className="text-red-500 font-bold text-2xl">{meusStats.graves}</span>
                    <p className="text-[10px] text-blue-800 font-bold uppercase mt-1">Graves Atendidos</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    <span className="text-[#FF8C00] font-bold text-2xl">{meusStats.medios}</span>
                    <p className="text-[10px] text-blue-800 font-bold uppercase mt-1">Médios Atendidos</p>
                  </div>
                  <div className="bg-white p-3 rounded-lg border border-blue-100 shadow-sm">
                    <span className="text-green-600 font-bold text-2xl">{meusStats.leves}</span>
                    <p className="text-[10px] text-blue-800 font-bold uppercase mt-1">Leves Atendidos</p>
                  </div>
                </div>
              </div>

            </div>

            
            <div className="bg-white rounded-[12px] shadow-sm overflow-hidden mb-[50px]">
              <div className="bg-[#fafafa] p-[20px] border-b border-[#eee] flex flex-col sm:flex-row justify-between items-center gap-4">
                <h3 className="m-0 text-[#333] text-[1.2rem] font-bold">
                  Próximos Atendimentos Triados ({meuBairro})
                </h3>
                <input 
                  type="text" 
                  placeholder="Pesquisar paciente..." 
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  className="w-full sm:w-[300px] p-[10px] border border-[#ddd] rounded-[6px] outline-none focus:border-[#FF8C00]"
                />
              </div>

              <div className="p-[20px]">
                {pacientesFiltrados.length > 0 ? (
                  pacientesFiltrados.map((paciente, index) => (
                    <div key={index} className="flex justify-between items-center py-[15px] border-b border-[#eee] last:border-0">
                      <div>
                        <p className="m-0 font-bold text-[#333] text-[1.1rem]">{paciente.nome}, {paciente.idade} anos</p>
                        <p className="m-0 text-[#666] text-[0.9rem]">Prioridade: {renderPrioridade(paciente.urgencia)}</p>
                      </div>
                      <button
                        onClick={() => setPacienteSelecionado(paciente)}
                        className="bg-[#FF8C00] text-white px-[20px] py-[8px] rounded-[6px] font-bold text-[0.9rem] hover:bg-[#E67E22] transition-colors"
                      >
                        Ver Prontuário
                      </button>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 text-lg mb-2">Sua fila no <strong>{meuBairro}</strong> está vazia! 🎉</p>
                    <p className="text-sm text-gray-400">Nenhum paciente aguardando atendimento na sua região no momento.</p>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-white p-[40px] rounded-[12px] shadow-sm text-center border border-[#eee] mb-[50px]">
            <h3 className="text-[#333] text-[1.5rem] font-bold mb-2">Obrigado por fazer parte dessa rede!</h3>
            <p className="text-[#666] max-w-[600px] mx-auto mb-6">Suas informações de triagem são sigilosas.</p>
            <Link to="/Formulario" className="text-[#FF8C00] font-bold underline hover:text-[#E67E22]">
              Deseja atualizar sua ficha de triagem?
            </Link>
          </div>
        )}

      </div>

      
      {pacienteSelecionado && (
        <div className="fixed inset-0 bg-black/60 z-[3000] flex justify-center items-center p-4">
          <div className="bg-white w-full max-w-[600px] rounded-[12px] p-[30px] shadow-2xl relative animate-fade-in">
            <button 
              onClick={() => setPacienteSelecionado(null)}
              className="absolute top-[20px] right-[20px] text-gray-400 hover:text-red-500 font-bold text-xl"
            >
              ✕
            </button>
            <h2 className="text-2xl font-bold text-[#333] mb-1">Prontuário de Triagem</h2>
            <p className="text-gray-500 mb-6">Paciente: {pacienteSelecionado.nome}</p>

            <div className="grid grid-cols-2 gap-4 bg-[#F5F5DC] p-5 rounded-lg mb-6 border border-yellow-100">
              <div>
                <p className="text-sm text-gray-600 font-bold uppercase">Idade</p>
                <p className="text-lg">{pacienteSelecionado.idade} anos</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-bold uppercase">Bairro</p>
                <p className="text-lg capitalize">{pacienteSelecionado.bairro || 'Não informado'}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-bold uppercase">Tipo de Dor</p>
                <p className="text-lg capitalize text-red-600 font-semibold">{pacienteSelecionado.tipo_dor}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600 font-bold uppercase">Tempo de Dor</p>
                <p className="text-lg">{pacienteSelecionado.tempo_dor} dias</p>
              </div>
            </div>

            <div className="flex gap-3">
              <button 
                onClick={() => setPacienteSelecionado(null)}
                className="flex-1 border border-gray-300 text-gray-700 font-bold py-3 rounded-lg hover:bg-gray-100 transition-colors"
              >
                Fechar
              </button>
              <button 
                onClick={finalizarAtendimento} 
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center gap-2"
              >
                ✅ Finalizar Triagem
              </button>
            </div>
          </div>
        </div>
      )}

      
      {userRole === 'dentista' && (
        <div className="fixed bottom-6 right-6 z-[4000] font-sans">
          {chatAberto ? (
            <div className="bg-white w-[350px] h-[480px] shadow-2xl rounded-2xl flex flex-col border border-gray-200 overflow-hidden transition-all">
              <div className="bg-[#FF8C00] p-4 flex justify-between items-center text-white">
               <div className="flex items-center gap-2">
                 <img 
                    src={tdb} 
                    alt="Assistente" 
                    className="w-8 h-8 rounded-full object-cover border border-white/50 bg-white" 
                    />
                    <span className="font-bold">Assistente de IA</span>
                        </div>
                <button onClick={() => setChatAberto(false)} className="hover:bg-white/20 rounded px-2 font-bold text-lg">✕</button>
              </div>
              
              <div className="flex-1 p-4 overflow-y-auto bg-gray-50 flex flex-col gap-4">
                <div className="bg-white p-3 rounded-lg border text-sm text-gray-600 shadow-sm">
                  Olá, Doutor! Sou seu assistente virtual. Posso analisar a fila de pacientes para você. Pergunte sobre urgências, históricos ou quem deve ser atendido primeiro.
                </div>
                {respostaIA && (
                  <div className="bg-[#FFF3E0] p-3 rounded-lg border border-[#FFE0B2] text-sm text-gray-800 shadow-sm whitespace-pre-wrap">
                    <strong>IA:</strong><br/>{respostaIA.split('**').map((texto, i) => i % 2 === 1 ? <strong key={i}>{texto}</strong> : texto)}
                  </div>
                )}
              </div>

              <div className="p-4 bg-white border-t">
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    className="flex-1 border border-gray-300 p-2 rounded-lg text-sm outline-none focus:border-[#FF8C00]"
                    placeholder="Ex: Quem é o mais urgente?"
                    value={perguntaIA}
                    onChange={(e) => setPerguntaIA(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && perguntarParaIA()}
                  />
                  <button 
                    onClick={perguntarParaIA}
                    disabled={carregandoIA}
                    className="bg-[#FF8C00] text-white px-4 py-2 rounded-lg font-bold hover:bg-[#E67E22] disabled:opacity-50 transition-colors"
                  >
                    {carregandoIA ? '...' : '→'}
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button 
              onClick={() => setChatAberto(true)}
              className="bg-[#FF8C00] text-white w-14 h-14 rounded-full shadow-lg flex justify-center items-center hover:bg-[#E67E22] hover:scale-110 transition-transform border-[3px] border-white overflow-hidden"
            >
              <img src={tdb} alt="Abrir Chat" className="w-full h-full object-cover bg-white" />
            </button>
          )}
        </div>
      )}

    </main>
  );
}