import { Link, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';

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

  const navigate = useNavigate();
  const userRole = sessionStorage.getItem("userRole"); 
  const usuarioLogado = sessionStorage.getItem("usuarioLogado");

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
    if (!usuarioLogado) {
      navigate('/login');
    } else {
      carregarDados();
    }
  }, [navigate, usuarioLogado]);

  
  const finalizarAtendimento = async (nomePaciente: string) => {
    const confirmacao = window.confirm(`Tem certeza que deseja finalizar a triagem de ${nomePaciente}? Ele sairá da fila.`);
    if (confirmacao) {
      try {
        await fetch(`http://127.0.0.1:8000/paciente/${nomePaciente}`, { method: 'DELETE' });
        
        setPacientes(pacientes.filter(p => p.nome !== nomePaciente));
        setPacienteSelecionado(null); 
      } catch (error) {
        alert("Erro ao concluir o atendimento.");
      }
    }
  };

  const renderPrioridade = (nivel: number) => {
    if (nivel >= 6) return <span className="text-red-500 font-bold">Alta (Urgente)</span>;
    if (nivel >= 4) return <span className="text-[#FFAF00] font-bold">Média (Atenção)</span>;
    return <span className="text-green-500 font-bold">Baixa (Rotina)</span>;
  };

  
  const pacientesFiltrados = pacientes.filter(p => 
    p.nome.toLowerCase().includes(busca.toLowerCase())
  );

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
            <p className="text-[#666] font-bold text-[0.9rem] uppercase tracking-[1px] m-0">Pacientes na Fila</p>
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
          <div className="bg-white rounded-[12px] shadow-sm overflow-hidden mb-[50px]">
            
            
            <div className="bg-[#fafafa] p-[20px] border-b border-[#eee] flex flex-col sm:flex-row justify-between items-center gap-4">
              <h3 className="m-0 text-[#333] text-[1.2rem] font-bold">Próximos Atendimentos Triados</h3>
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
                <p className="text-center text-gray-500 py-4">Nenhum paciente encontrado.</p>
              )}
            </div>
          </div>
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
                onClick={() => finalizarAtendimento(pacienteSelecionado.nome)}
                className="flex-1 bg-green-600 text-white font-bold py-3 rounded-lg hover:bg-green-700 transition-colors flex justify-center items-center gap-2"
              >
                ✅ Finalizar Triagem
              </button>
            </div>
            
          </div>
        </div>
      )}
      
    </main>
  );
}