import { Link } from 'react-router-dom';

export function Home() {
  return (
    <main className="bg-[#F5F5DC] text-[#333333] font-sans overflow-x-hidden">
      
      
      <section 
        className="relative w-full min-h-screen flex justify-center items-center text-center pt-20 box-border bg-cover bg-center bg-no-repeat"
        style={{ 
          
          backgroundImage: `linear-gradient(to bottom, rgba(0,0,0,0.6), rgba(0,0,0,0.8)), url('/src/img/turma-do-bem-hero.jpg')` 
        }}
      >
        <div className="relative z-10 max-w-[800px] p-5">
          <h1 className="text-white text-5xl md:text-[3.5rem] font-black leading-[1.1] mb-5">
            Otimizando o Atendimento, <br />
            
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-[#FF8C00] to-[#FFD700]">
              Transformando Vidas
            </span>
          </h1>
          
          <p className="text-[#E0E0E0] text-lg md:text-[1.2rem] mb-10 font-normal leading-[1.6]">
            Uma solução integrada para agilizar a triagem e a gestão de atendimentos da maior rede de voluntariado odontológico do mundo.
          </p>
          
          
          <Link 
            to="/sobre" 
            className="inline-block bg-[#FF8C00] text-white px-[45px] py-[16px] text-[1.1rem] font-bold rounded-[30px] uppercase tracking-[1px] border border-white shadow-[0_4px_15px_rgba(255,140,0,0.2)] transition-all duration-400 ease-in-out hover:bg-[#E67E22] hover:-translate-y-[3px] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,140,0,0.8)]"
          >
            Conheça a Solução
          </Link>
        </div>
      </section>

     
      <section className="py-[80px] px-[5%] bg-[#F5F5DC]">
        <div className="flex flex-wrap justify-center gap-[30px] max-w-[1200px] mx-auto">
          
          
          <div className="bg-white p-[40px_30px] rounded-[16px] flex-1 min-w-[280px] text-center border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out hover:-translate-y-[10px] hover:shadow-[0_20px_40px_rgba(255,140,0,0.15)] hover:border-[#FF8C00]/30">
            <div className="text-[3rem] font-bold mb-[20px]">1°</div>
            <h3 className="text-[#333333] text-[1.3rem] font-bold mb-[15px]">Chatbot assistente</h3>
            <p className="text-[#666] leading-[1.5]">
              Chatbot assistente para ajudar os medicos a consultarem informações especificas sobre o cliente/beneficiado
            </p>
          </div>

          
          <div className="bg-white p-[40px_30px] rounded-[16px] flex-1 min-w-[280px] text-center border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out hover:-translate-y-[10px] hover:shadow-[0_20px_40px_rgba(255,140,0,0.15)] hover:border-[#FF8C00]/30">
            <div className="text-[3rem] font-bold mb-[20px]">2°</div>
            <h3 className="text-[#333333] text-[1.3rem] font-bold mb-[15px]">Gestão Centralizada</h3>
            <p className="text-[#666] leading-[1.5]">
              Painel de controle unificado para organizar todos os atendimentos da ONG em um só lugar.
            </p>
          </div>

          
          <div className="bg-white p-[40px_30px] rounded-[16px] flex-1 min-w-[280px] text-center border border-black/5 shadow-[0_10px_30px_rgba(0,0,0,0.02)] transition-all duration-300 ease-in-out hover:-translate-y-[10px] hover:shadow-[0_20px_40px_rgba(255,140,0,0.15)] hover:border-[#FF8C00]/30">
            <div className="text-[3rem] font-bold mb-[20px]">3°</div>
            <h3 className="text-[#333333] text-[1.3rem] font-bold mb-[15px]">Atendimento Rápido</h3>
            <p className="text-[#666] leading-[1.5]">
              Conexão direta e eficiente entre pacientes vulneráveis e a rede de dentistas voluntários.
            </p>
          </div>

        </div>
      </section>

    </main>
  );
}