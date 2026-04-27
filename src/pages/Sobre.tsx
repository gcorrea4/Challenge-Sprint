import { useState, useEffect } from 'react';
import { Calculator, Star, CheckCircle2 } from 'lucide-react';

export function Sobre() {
  // Estados para o Simulador
  const [idade, setIdade] = useState(14);
  const [renda, setRenda] = useState(1);
  const [dor, setDor] = useState(15); 
  const [score, setScore] = useState(0);

  useEffect(() => {
    let pontos = 0;
    // Lógica do main.py
    if (idade >= 11 && idade <= 17) pontos += 40;
    else if (idade >= 18 && idade <= 21) pontos += 20;

    if (renda <= 1.0) pontos += 30;
    else if (renda <= 2.0) pontos += 15;

    pontos += dor;
    pontos += 10; // Bônus de proximidade simulado
    
    setScore(pontos);
  }, [idade, renda, dor]);

  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans py-[40px] px-[20px]">
      
      <div className="max-w-[1100px] mx-auto">
        
        <div className="text-center mb-[50px]">
          <h2 className="text-black text-[2rem] md:text-[2.5rem] font-bold mb-[10px] mt-[50px]">Sobre o Nosso Projeto</h2>
          <p className="text-[#555555] text-[1.1rem]">Conheça a essência da nossa solução para a Turma do Bem.</p>
        </div>

        <section className="flex flex-col md:flex-row gap-[30px] mb-[50px]">
          <div className="bg-white p-[30px] rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex-1 border-t-[5px] border-orange-500">
            <h3 className="text-orange-500 text-[1.5rem] font-bold mb-[15px] mt-0">💡 A Ideia</h3>
            <p className="text-[#555555] leading-[1.6] text-justify m-0">
              A ideia por trás deste projeto nasceu da observação de que o primeiro contato entre o paciente e o consultório odontológico pode ser demorado e repetitivo. Buscamos uma forma de agilizar essa etapa, garantindo que o dentista receba as informações essenciais do paciente de forma clara e organizada antes mesmo da primeira consulta, otimizando o tempo de todos e melhorando a qualidade do atendimento inicial.
            </p>
          </div>

          <div className="bg-white p-[30px] rounded-[15px] shadow-[0_4px_15px_rgba(0,0,0,0.05)] flex-1 border-t-[5px] border-orange-500">
            <h3 className="text-orange-500 text-[1.5rem] font-bold mb-[15px] mt-0">🚀 O Projeto</h3>
            <p className="text-[#555555] leading-[1.6] text-justify m-0">
              Nosso projeto é um web app de gestão e triagem de pacientes. Através de um chatbot interativo, o sistema realiza o primeiro atendimento, coletando dados cadastrais e o histórico inicial do paciente. Essas informações são então processadas e armazenadas de forma segura, sendo apresentadas ao dentista em um painel de controle intuitivo, que facilita o acesso rápido a todo o histórico do cliente e otimiza o fluxo de trabalho da clínica.
            </p>
          </div>
        </section>

        <section className="mb-[60px]">
          <h2 className="text-[#333333] text-[1.5rem] md:text-[2rem] font-bold mt-[60px] mb-[30px] border-b-[2px] border-orange-500 inline-block pb-[10px] relative left-1/2 -translate-x-1/2 text-center">
            Tecnologias Utilizadas
          </h2>
          
          <div className="grid grid-cols-[repeat(auto-fit,minmax(220px,1fr))] gap-[20px]">
            <div className="bg-white p-[20px] rounded-[10px] text-center border border-[#E0E0E0] transition-all duration-300 hover:-translate-y-[5px] hover:border-orange-500 hover:shadow-[0_10px_20px_rgba(255,165,0,0.15)]">
              <h3 className="text-[#333333] font-bold mb-[10px] mt-0">Front-End</h3>
              <p className="text-[#666666] text-[0.95rem] m-0">HTML, CSS e JavaScript para criar uma interface de usuário interativa e amigável.</p>
            </div>
            <div className="bg-white p-[20px] rounded-[10px] text-center border border-[#E0E0E0] transition-all duration-300 hover:-translate-y-[5px] hover:border-orange-500 hover:shadow-[0_10px_20px_rgba(255,165,0,0.15)]">
              <h3 className="text-[#333333] font-bold mb-[10px] mt-0">Back-End</h3>
              <p className="text-[#666666] text-[0.95rem] m-0">Java e Python para construir a lógica do servidor, processamento de dados e regras de negócio.</p>
            </div>
            <div className="bg-white p-[20px] rounded-[10px] text-center border border-[#E0E0E0] transition-all duration-300 hover:-translate-y-[5px] hover:border-orange-500 hover:shadow-[0_10px_20px_rgba(255,165,0,0.15)]">
              <h3 className="text-[#333333] font-bold mb-[10px] mt-0">Banco de Dados</h3>
              <p className="text-[#666666] text-[0.95rem] m-0">Um sistema de banco de dados relacional para garantir a segurança e a integridade das informações dos pacientes.</p>
            </div>
            <div className="bg-white p-[20px] rounded-[10px] text-center border border-[#E0E0E0] transition-all duration-300 hover:-translate-y-[5px] hover:border-orange-500 hover:shadow-[0_10px_20px_rgba(255,165,0,0.15)]">
              <h3 className="text-[#333333] font-bold mb-[10px] mt-0">Inteligência Artificial</h3>
              <p className="text-[#666666] text-[0.95rem] m-0">Um chatbot para a automação da triagem inicial.</p>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-[#333333] text-[1.5rem] md:text-[2rem] font-bold mt-[60px] mb-[30px] border-b-[2px] border-orange-500 inline-block pb-[10px] relative left-1/2 -translate-x-1/2 text-center">
            Nosso Roadmap
          </h2>
          
          <div className="flex flex-col gap-[15px] max-w-[800px] mx-auto text-left">
            <div className="bg-white p-[20px_25px] rounded-[10px] border-l-[5px] border-[#CCCCCC] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <span className="inline-block bg-[#333333] text-white px-[12px] py-[5px] rounded-[20px] text-[0.85rem] font-bold mb-[10px]">Sprint 1</span>
              <p className="text-[#555555] m-0">Definição do escopo, planejamento, e desenvolvimento da estrutura base do front-end com as páginas estáticas.</p>
            </div>

            <div className="bg-white p-[20px_25px] rounded-[10px] border-l-[5px] border-[#CCCCCC] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <span className="inline-block bg-[#333333] text-white px-[12px] py-[5px] rounded-[20px] text-[0.85rem] font-bold mb-[10px]">Sprint 2</span>
              <p className="text-[#555555] m-0">Foco no desenvolvimento do back-end, modelagem do banco de dados e criação das principais regras de negócio.</p>
            </div>

            <div className="bg-orange-500/5 p-[20px_25px] rounded-[10px] border-l-[5px] border-orange-500 shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <span className="inline-block bg-orange-500 text-white px-[12px] py-[5px] rounded-[20px] text-[0.85rem] font-bold mb-[10px]">Sprint 3 (Atual)</span>
              <p className="text-[#555555] m-0">Implementação do chatbot e início da integração entre o front-end e o back-end para a troca de dados.</p>
            </div>

            <div className="bg-white p-[20px_25px] rounded-[10px] border-l-[5px] border-[#CCCCCC] shadow-[0_2px_10px_rgba(0,0,0,0.05)]">
              <span className="inline-block bg-[#333333] text-white px-[12px] py-[5px] rounded-[20px] text-[0.85rem] font-bold mb-[10px]">Sprint 4</span>
              <p className="text-[#555555] m-0">Integração final de todas as tecnologias, fase de testes, refatoração de código e preparação da solução para a apresentação final.</p>
            </div>
          </div>
        </section>
        <div className="text-center mb-[40px]">
          <h2 className="text-[#333333] text-[1.5rem] md:text-[2rem] font-bold mt-[60px] mb-[20px] border-b-[3px] border-orange-500 inline-block pb-[10px]">
            Nossa tecnologia diferencial
          </h2>
        </div>

        <section className="grid grid-cols-1 md:grid-cols-2 gap-[50px] items-center mb-[80px]">
          
          
          <div className="space-y-6 text-left">
            <p className="text-[#555555] text-[1.1rem] leading-relaxed">
              Diferente de uma fila comum, nosso sistema utiliza um <strong>Algoritmo de Match Inteligente</strong> para calcular o Score de Impacto Social de cada caso. 
              Priorizamos jovens entre 11 e 17 anos em situação de vulnerabilidade econômica, com quadros clínicos agudos e <strong>que residem próximos ao consultório voluntário</strong>.
            </p>
            
            <div className="space-y-5 mt-8">
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-500"><CheckCircle2 size={24}/></div>
                <div>
                  <p className="text-base font-bold text-gray-800 m-0">Foco em Jovens (11-17 anos)</p>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider m-0 mt-1">Peso: +40 Pontos</p>
                </div>
              </div>
              
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-500"><CheckCircle2 size={24}/></div>
                <div>
                  <p className="text-base font-bold text-gray-800 m-0">Baixa Renda Familiar</p>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider m-0 mt-1">Peso: +30 Pontos</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-500"><CheckCircle2 size={24}/></div>
                <div>
                  <p className="text-base font-bold text-gray-800 m-0">Gravidade da Dor e Clínica</p>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider m-0 mt-1">Peso: +20 Pontos</p>
                </div>
              </div>

              
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
                <div className="bg-orange-100 p-3 rounded-xl text-orange-500"><CheckCircle2 size={24}/></div>
                <div>
                  <p className="text-base font-bold text-gray-800 m-0">Proximidade Geográfica (Geolocalização)</p>
                  <p className="text-[11px] text-gray-500 font-bold uppercase tracking-wider m-0 mt-1">Peso: +10 Pontos</p>
                </div>
              </div>

            </div>
          </div>

          
          <div className="bg-white p-8 rounded-[32px] shadow-xl border border-gray-100 relative overflow-hidden text-left">
            <div className="absolute top-0 right-0 p-6 opacity-5"><Star size={100} className="text-orange-600"/></div>
            
            <div className="flex items-center gap-3 mb-8 relative z-10">
              <div className="p-2.5 bg-orange-50 rounded-xl text-orange-600 border border-orange-100"><Calculator size={20}/></div>
              <span className="font-black text-gray-800 uppercase tracking-widest text-[10px]">Simulador de Match TdB</span>
            </div>

            <div className="space-y-8 relative z-10">
            
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Idade do Paciente</label>
                  <span className="text-orange-600 font-black text-lg">{idade} anos</span>
                </div>
                <input 
                  type="range" min="5" max="60" value={idade} 
                  onChange={(e) => setIdade(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500" 
                />
              </div>

             
              <div>
                <div className="flex justify-between items-center mb-3">
                  <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Renda (Salários Mínimos)</label>
                  <span className="text-orange-600 font-black text-lg">{renda} SM</span>
                </div>
                <input 
                  type="range" min="0" max="5" step="0.5" value={renda} 
                  onChange={(e) => setRenda(Number(e.target.value))}
                  className="w-full h-1.5 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-orange-500" 
                />
              </div>

             
              <div className="flex flex-col gap-2">
                <label className="text-[10px] font-black text-gray-400 uppercase tracking-wider">Nível de Dor relatado</label>
                <div className="grid grid-cols-3 gap-2">
                  {[
                    { label: 'Leve', pts: 5 },
                    { label: 'Forte', pts: 15 },
                    { label: 'Urgente', pts: 20 }
                  ].map(item => (
                    <button 
                      key={item.label} 
                      onClick={() => setDor(item.pts)}
                      className={`py-3 rounded-2xl text-[10px] font-black uppercase transition-all duration-300 ${dor === item.pts ? 'bg-orange-500 text-white shadow-lg shadow-orange-200 scale-105' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            
            <div className="mt-12 pt-8 border-t border-dashed border-gray-200 text-center relative z-10">
              <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-2">Score de Prioridade</p>
              <div className="text-7xl font-black text-orange-500 drop-shadow-sm">{score}</div>
              <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden mt-6 shadow-inner">
                <div 
                  className="bg-gradient-to-r from-orange-400 to-orange-600 h-full transition-all duration-700 ease-out" 
                  style={{ width: `${score}%` }}
                ></div>
              </div>
            </div>
          </div>
        </section>

        <img 
          src="/fiap.jpeg" 
          alt="Logo FIAP" 
          className="w-full max-w-[500px] block mx-auto mt-[60px] mb-[20px] rounded-[10px]" 
        />

      </div>
    </main>
  );
}