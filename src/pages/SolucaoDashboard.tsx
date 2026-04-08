import { Link } from 'react-router-dom';
export function SolucaoDashboard() {
 return (
<main className="bg-[#F5F5DC] min-h-screen font-sans pt-[120px] pb-[60px] px-[20px] md:px-[5%]">
<div className="max-w-[1200px] mx-auto">
       {/* Cabeçalho da Página */}
<div className="text-center mb-[50px]">
<h2 className="text-[#333333] text-[2rem] md:text-[2.8rem] font-bold mt-0 mb-[15px] leading-tight">
           Painel do <span className="text-[#FF8C00]">Dentista Voluntário</span>
</h2>
<p className="text-[#555555] text-[16px] md:text-[18px] max-w-[800px] mx-auto leading-relaxed">
           Uma interface intuitiva para gerenciar seus atendimentos, visualizar o histórico clínico dos beneficiários e acompanhar o seu impacto social.
</p>
</div>
       {/* Grid de Estatísticas (Resumo) */}
<div className="grid grid-cols-1 sm:grid-cols-3 gap-[20px] md:gap-[30px] mb-[40px]">
<div className="bg-white p-[25px] rounded-[12px] shadow-[0_8px_20px_rgba(0,0,0,0.04)] border-l-[5px] border-[#FF8C00]">
<p className="text-[#666] font-bold text-[0.9rem] uppercase tracking-[1px] m-0">Pacientes na Fila</p>
<h3 className="text-[#333] text-[2.5rem] font-[900] m-0 mt-[10px]">12</h3>
</div>
<div className="bg-white p-[25px] rounded-[12px] shadow-[0_8px_20px_rgba(0,0,0,0.04)] border-l-[5px] border-[#4CAF50]">
<p className="text-[#666] font-bold text-[0.9rem] uppercase tracking-[1px] m-0">Sorrisos Transformados</p>
<h3 className="text-[#333] text-[2.5rem] font-[900] m-0 mt-[10px]">47</h3>
</div>
<div className="bg-white p-[25px] rounded-[12px] shadow-[0_8px_20px_rgba(0,0,0,0.04)] border-l-[5px] border-[#2196F3]">
<p className="text-[#666] font-bold text-[0.9rem] uppercase tracking-[1px] m-0">Horas Voluntárias</p>
<h3 className="text-[#333] text-[2.5rem] font-[900] m-0 mt-[10px]">142h</h3>
</div>
</div>
       {/* Fila de Atendimentos (Simulação de Tabela) */}
<div className="bg-white rounded-[12px] shadow-[0_10px_30px_rgba(0,0,0,0.05)] overflow-hidden mb-[50px]">
<div className="bg-[#fafafa] p-[20px] border-b border-[#eee] flex justify-between items-center">
<h3 className="m-0 text-[#333] text-[1.2rem] font-bold">Próximos Atendimentos Triados</h3>
</div>
<div className="p-[20px]">
           {/* Paciente 1 */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center py-[15px] border-b border-[#eee] gap-[10px] md:gap-0">
<div>
<p className="m-0 font-bold text-[#333] text-[1.1rem]">João Pedro, 14 anos</p>
<p className="m-0 text-[#666] text-[0.9rem]">Prioridade: <span className="text-red-500 font-bold">Alta (Dor aguda)</span></p>
</div>
<button
 onClick={() => alert('Este é um protótipo! Na versão final, isso abrirá o prontuário odontológico completo do paciente com raios-x e histórico.')}
 className="bg-[#FF8C00] text-white px-[20px] py-[8px] rounded-[6px] font-bold text-[0.9rem] transition-all hover:bg-[#E67E22] w-full md:w-auto"
>
 Ver Prontuário
</button>
</div>
           {/* Paciente 2 */}
<div className="flex flex-col md:flex-row justify-between items-start md:items-center py-[15px] gap-[10px] md:gap-0">
<div>
<p className="m-0 font-bold text-[#333] text-[1.1rem]">Maria Silva, 12 anos</p>
<p className="m-0 text-[#666] text-[0.9rem]">Prioridade: <span className="text-[#FFAF00] font-bold">Média (Cárie profunda)</span></p>
</div>
<button
 onClick={() => alert('Este é um protótipo! Na versão final, isso abrirá o prontuário odontológico completo do paciente com raios-x e histórico.')}
 className="bg-[#FF8C00] text-white px-[20px] py-[8px] rounded-[6px] font-bold text-[0.9rem] transition-all hover:bg-[#E67E22] w-full md:w-auto"
>
 Ver Prontuário
</button>
</div>
</div>
</div>
       {/* Call to Action */}
<div className="text-center">
<Link to="/cadastro" className="inline-block bg-transparent border-[2px] border-[#FF8C00] text-[#FF8C00] px-[30px] py-[15px] rounded-[8px] font-bold text-[16px] transition-all duration-300 hover:bg-[#FF8C00] hover:text-white">
           Quero me tornar um Dentista do Bem
</Link>
</div>
</div>
</main>
 );
}