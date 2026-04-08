import { Link } from 'react-router-dom';

export function SolucaoTriagem() {
  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans pt-[120px] pb-[60px] px-[20px] md:px-[5%]">
      
      <div className="max-w-[1200px] mx-auto">
        
        <div className="text-center mb-[60px]">
          <h2 className="text-[#333333] text-[2rem] md:text-[2.8rem] font-bold mt-0 mb-[15px] leading-tight">
            Triagem com <span className="text-[#FF8C00]">Inteligência Artificial</span>
          </h2>
          <p className="text-[#555555] text-[16px] md:text-[18px] max-w-[800px] mx-auto leading-relaxed">
            Nossa plataforma utiliza algoritmos avançados para agilizar o processo de seleção, conectando os jovens que mais precisam aos dentistas voluntários de forma rápida e justa.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-[30px] mb-[50px]">
          
          <article className="bg-white p-[30px] rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-t-[4px] border-[#FF8C00] transition-transform duration-300 hover:-translate-y-[5px]">
            <div className="bg-[#FFF3E0] w-[60px] h-[60px] rounded-full flex items-center justify-center mb-[20px]">
              <span className="text-[#FF8C00] text-[24px] font-bold">1</span>
            </div>
            <h3 className="text-[#333] text-[1.3rem] font-bold mb-[15px]">Análise Rápida</h3>
            <p className="text-[#666] leading-relaxed text-[0.95rem]">
              A IA processa formulários e fotos em segundos, identificando casos de urgência odontológica e vulnerabilidade social.
            </p>
          </article>

          <article className="bg-white p-[30px] rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-t-[4px] border-[#FF8C00] transition-transform duration-300 hover:-translate-y-[5px]">
            <div className="bg-[#FFF3E0] w-[60px] h-[60px] rounded-full flex items-center justify-center mb-[20px]">
              <span className="text-[#FF8C00] text-[24px] font-bold">2</span>
            </div>
            <h3 className="text-[#333] text-[1.3rem] font-bold mb-[15px]">Priorização Justa</h3>
            <p className="text-[#666] leading-relaxed text-[0.95rem]">
              Geração automática de uma fila de prioridade baseada na gravidade clínica, eliminando o viés humano da triagem inicial.
            </p>
          </article>

          <article className="bg-white p-[30px] rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] border-t-[4px] border-[#FF8C00] transition-transform duration-300 hover:-translate-y-[5px]">
            <div className="bg-[#FFF3E0] w-[60px] h-[60px] rounded-full flex items-center justify-center mb-[20px]">
              <span className="text-[#FF8C00] text-[24px] font-bold">3</span>
            </div>
            <h3 className="text-[#333] text-[1.3rem] font-bold mb-[15px]">Match com Dentistas</h3>
            <p className="text-[#666] leading-relaxed text-[0.95rem]">
              O sistema cruza a localização do beneficiário com a dos dentistas voluntários disponíveis, criando a conexão perfeita.
            </p>
          </article>

        </div>

        <div className="text-center">
          <Link to="/cadastro" className="inline-block bg-[#FF8C00] text-white px-[30px] py-[15px] rounded-[8px] font-bold text-[16px] shadow-[0_4px_15px_rgba(255,140,0,0.3)] transition-all duration-300 hover:bg-[#E67E22] hover:-translate-y-[2px] hover:shadow-[0_6px_20px_rgba(255,140,0,0.4)]">
            Faça parte dessa solução
          </Link>
        </div>

      </div>
    </main>
  );
}