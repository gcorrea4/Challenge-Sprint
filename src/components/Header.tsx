import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <>
      <header className="flex justify-between items-center px-[5%] h-[65px] fixed top-0 left-0 w-full box-border z-[1000] bg-black/20 backdrop-blur-[12px] border-b border-[#FF8C00]/20 shadow-[0_4px_30px_rgba(0,0,0,0.05)]">
        
        {/* 1. ESQUERDA: Logo */}
        <div className="flex-1 flex justify-start">
          <h1 className="m-0 font-[900] tracking-[-1px] leading-none" style={{ fontFamily: '"Arial Black", Arial, sans-serif' }}>
            <Link to="/" className="text-[22px] md:text-[33px] whitespace-nowrap text-[#FF8C00] transition-transform duration-300 ease-in-out hover:-translate-y-[2px] flex items-center h-full">
              Turma do Bem
            </Link>
          </h1>
        </div>
        
        {/* 2. CENTRO: Links de Navegação (Oculto no mobile, visível a partir de telas 'lg') */}
        <nav className="hidden lg:flex justify-center items-center gap-[15px] xl:gap-[25px]">
          <Link to="/" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Início</Link>
          <Link to="/faq" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">FAQ</Link>
          <Link to="/quem-somos" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Quem Somos</Link>
          <Link to="/sobre" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Sobre</Link>
          <Link to="/reconhecimentos" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Reconhecimentos</Link>
          <Link to="/SolucaoTriagem" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Solução</Link>
          <Link to="/SolucaoDashboard" className="text-white font-[600] text-[16px] hover:text-[#FF8C00] transition-colors duration-300">Dashboard</Link>


        </nav>

        {/* 3. DIREITA: Botão Contato + Menu Hambúrguer */}
        <div className="flex-1 flex justify-end items-center gap-[12px] md:gap-[20px]">
          <Link to="/contato" className="hidden sm:block bg-[#FF8C00] text-white px-[15px] lg:px-[20px] py-[6px] rounded-[6px] font-bold text-[13px] lg:text-[14px] shadow-[0_4px_10px_rgba(255,140,0,0.3)] transition-all duration-300 ease-in-out hover:bg-[#E67E22] hover:-translate-y-[2px] hover:shadow-[0_6px_15px_rgba(255,140,0,0.4)]">
            Contato
          </Link>

          <button 
            onClick={() => setIsMenuOpen(true)} 
            className="bg-transparent border-none text-[#FF8C00] cursor-pointer transition-transform duration-300 hover:scale-110 flex items-center justify-center p-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-[26px] h-[26px] md:w-[28px] md:h-[28px] lg:w-[30px] lg:h-[30px]">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
            </svg>
          </button>
        </div>
        
      </header>

      {/* OVERLAY ESCURO */}
      <div 
        onClick={() => setIsMenuOpen(false)} 
        className={`fixed inset-0 bg-black/50 backdrop-blur-[4px] z-[1999] transition-all duration-300 ${isMenuOpen ? 'opacity-100 visible' : 'opacity-0 invisible'}`}
      ></div>

      {/* MENU LATERAL */}
      <div 
        className={`fixed top-0 w-[85%] max-w-[320px] h-screen bg-white z-[2000] shadow-[-5px_0_30px_rgba(0,0,0,0.15)] flex flex-col p-[30px_25px] transition-all duration-500 ease-[cubic-bezier(0.25,0.8,0.25,1)] ${isMenuOpen ? 'right-0' : 'right-[-100%]'}`}
      >
        <div className="flex justify-between items-center border-b-[2px] border-[#f0f0f0] pb-[15px] mb-[25px]">
          <h3 className="m-0 text-[#333] text-[1.2rem] md:text-[1.3rem] font-bold">Minha Conta</h3>
          <button 
            onClick={() => setIsMenuOpen(false)} 
            className="bg-transparent border-none text-[1.5rem] text-[#888] cursor-pointer transition-all duration-300 hover:text-red-500 hover:rotate-90 p-0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-7 h-7">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex flex-col">
          <p className="text-[#666] text-[0.9rem] md:text-[0.95rem] mb-[25px] leading-[1.5]">Acesse o painel ou crie sua conta para ajudar a ONG.</p>
          <Link to="/login" onClick={() => setIsMenuOpen(false)} className="block text-center p-[12px] md:p-[15px] rounded-[8px] font-bold no-underline mb-[15px] transition-all duration-300 bg-[#f5f5f5] text-[#333] border border-[#ddd] hover:bg-[#e9e9e9]">Entrar</Link>
          <Link to="/cadastro" onClick={() => setIsMenuOpen(false)} className="block text-center p-[12px] md:p-[15px] rounded-[8px] font-bold no-underline mb-[15px] transition-all duration-400 bg-[#FF8C00] text-white shadow-[0_4px_15px_rgba(255,140,0,0.2)] hover:bg-[#E67E22] hover:-translate-y-[3px] hover:scale-105 hover:shadow-[0_0_30px_rgba(255,140,0,0.8)]">Cadastrar Agora</Link>
        </div>

        {/* Links adicionados para o mobile, já que o menu central sumiu */}
        <div className="mt-auto border-t border-[#f0f0f0] pt-[20px] flex flex-col gap-[15px] overflow-y-auto">
          <Link to="/" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00] transition-colors">Início</Link>
          <Link to="/sobre" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00] transition-colors">Sobre o Projeto</Link>
          <Link to="/quem-somos" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00] transition-colors">Quem Somos</Link>
          <Link to="/faq" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00] transition-colors">FAQ</Link>
          <Link to="/reconhecimentos" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00] transition-colors">Reconhecimentos</Link>
          <Link to="/contato" onClick={() => setIsMenuOpen(false)} className="text-[#666] font-bold hover:text-[#FF8C00] transition-colors">Contato</Link>
        </div>
      </div>
    </>
  );
}