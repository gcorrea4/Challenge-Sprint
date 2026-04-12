export function FAQ() {
  return (
   
    <main className="bg-[#F5F5DC] min-h-screen py-[60px] px-[20px] md:px-[60px] font-sans">
      
      
      <section className="max-w-[1200px] mx-auto text-center">
        
        
        <h2 className="text-[#333333] text-[32px] md:text-[40px] font-bold mt-[20px] mb-[40px]">
          Perguntas frequentes
        </h2>
        
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-[30px] text-left">
          
          {/* CARD 1 */}
          <div className="bg-white border border-black/10 p-[30px] rounded-[16px] shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-[10px] hover:border-[#FF8C00] hover:shadow-[0_0_20px_rgba(255,140,0,0.2)]">
            <h3 className="text-[#FF8C00] text-[1.3rem] font-bold mb-[10px]">
              O que é este projeto?
            </h3>
            <p className="text-[#666666] leading-[1.5] text-[18px] md:text-[20px] text-justify">
              Este é um projeto acadêmico desenvolvido por alunos do curso de Análise e Desenvolvimento de Sistemas da FIAP. A plataforma é uma ferramenta de gestão integrada, criada como uma solução para otimizar o fluxo de atendimento e comunicação da ONG Turma do Bem.
            </p>
          </div>

          
          <div className="bg-white border border-black/10 p-[30px] rounded-[16px] shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-[10px] hover:border-[#FF8C00] hover:shadow-[0_0_20px_rgba(255,140,0,0.2)] active:scale-95 active:duration-75">            <h3 className="text-[#FF8C00] text-[1.3rem] font-bold mb-[10px]">
              Qual problema ele resolve?
            </h3>
            <p className="text-[#666666] leading-relaxed text-[18px] md:text-[20px] text-justify tracking-tight">
              A Turma do Bem recebe um grande volume de contatos por diversos canais (e-mail, WhatsApp), o que dificulta o controle e a agilidade. Nossa plataforma busca centralizar todas as solicitações, automatizar o encaminhamento e permitir o acompanhamento de cada caso, tornando o processo mais rápido e organizado.
            </p>
          </div>

          
          <div className="bg-white border border-black/10 p-[30px] rounded-[16px] shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-[10px] hover:border-[#FF8C00] hover:shadow-[0_0_20px_rgba(255,140,0,0.2)]">
            <h3 className="text-[#FF8C00] text-[1.3rem] font-bold mb-[10px]">
              Quais tecnologias foram utilizadas?
            </h3>
            <p className="text-[#666666] leading-[1.5] text-[18px] md:text-[20px] text-justify">
              A solução integra diversas tecnologias estudadas em nossa grade curricular, incluindo HTML e CSS para o Front-End, Java e Python para o Back-End, um banco de dados relacional para o armazenamento seguro das informações e um chatbot para a triagem inicial.
            </p>
          </div>

          
          <div className="bg-white border border-black/10 p-[30px] rounded-[16px] shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-[10px] hover:border-[#FF8C00] hover:shadow-[0_0_20px_rgba(255,140,0,0.2)]">
            <h3 className="text-[#FF8C00] text-[1.3rem] font-bold mb-[10px]">
              Este sistema já está em uso pela Turma do Bem?
            </h3>
            <p className="text-[#666666] leading-[1.5] text-[18px] md:text-[20px] text-justify">
              Atualmente, o projeto é um protótipo funcional (MVP - Mínimo Produto Viável) desenvolvido para o Challenge da FIAP. Ele serve como uma prova de conceito e demonstra como a tecnologia pode ser aplicada para solucionar o desafio proposto pela Turma do Bem.
            </p>
          </div>

        
          <div className="bg-white border border-black/10 p-[30px] rounded-[16px] shadow-sm transition-all duration-300 ease-in-out hover:-translate-y-[10px] hover:border-[#FF8C00] hover:shadow-[0_0_20px_rgba(255,140,0,0.2)]">
            <h3 className="text-[#FF8C00] text-[1.3rem] font-bold mb-[10px]">
              Como posso saber mais sobre a Turma do Bem ou ajudar?
            </h3>
            <p className="text-[#666666] leading-[1.5] text-[18px] md:text-[20px] text-justify">
              A Turma do Bem é a maior rede de voluntariado especializado do mundo! Para conhecer mais sobre o incrível trabalho que realizam, fazer doações ou se voluntariar, recomendamos visitar o site oficial da organização.
            </p>
          </div>

        </div>
      </section>
    </main>
  );
}