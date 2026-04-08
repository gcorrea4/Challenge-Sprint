export function Sobre() {
  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans py-[40px] px-[20px]">
      
      
      <div className="max-w-[1100px] mx-auto">
        
        
        <div className="text-center mb-[50px]">
          <h2 className="text-black text-[2rem] md:text-[2.5rem] font-bold mb-[10px] mt-[50px]">Sobre o Nosso Projeto</h2>
          <p className="text-[#555555] text-[1.1rem] ">Conheça a essência da nossa solução para a Turma do Bem.</p>
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

        
        <img 
          src="/src/img/fiap.jpeg" 
          alt="Logo FIAP" 
          className="w-full max-w-[500px] block mx-auto mt-[60px] mb-[20px] rounded-[10px]" 
        />

      </div>
    </main>
  );
}