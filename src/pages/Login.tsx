import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

export function Login() {
  const { register, handleSubmit, formState: { errors } } = useForm();
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();

  const onSubmit = (data: any) => {
    
    const usuarioSalvo = localStorage.getItem("usuario_" + data.email);

    
    if (!usuarioSalvo) {
      setMensagem({ texto: "E-mail não encontrado. Por favor, cadastre-se primeiro!", tipo: "erro" });
      return;
    }

    
    const usuario = JSON.parse(usuarioSalvo);

    
    if (usuario.senha !== data.senha) {
      setMensagem({ texto: "Senha incorreta. Tente novamente.", tipo: "erro" });
      return;
    }

    
    setMensagem({ texto: `Login aprovado! Bem-vindo de volta, ${usuario.nomeCompleto}.`, tipo: "sucesso" });
    sessionStorage.setItem("usuarioLogado", usuario.nomeCompleto);

   
    setTimeout(() => {
      navigate('/');
    }, 2000);
  };

  return (
    <main className="bg-[#F5F5DC] min-h-screen flex justify-center items-center py-[120px] px-[20px]">
      <div className="bg-white w-full max-w-[500px] p-[30px] sm:p-[40px] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5">
        
        <div className="text-center mb-[30px]">
          <h2 className="text-[#333] text-[2rem] m-[0_0_10px_0] font-bold">Bem-vindo de volta!</h2>
          <p className="text-[#666] m-0 text-[0.95rem]">Faça login para acessar o painel da Turma do Bem.</p>
        </div>

        {mensagem.texto && (
          <div className={`p-[15px] rounded-[8px] mb-[20px] font-semibold text-center text-[0.95rem] ${mensagem.tipo === 'erro' ? 'bg-[#FFEFEF] text-[#D8000C] border border-[#FFD2D2]' : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-[20px] w-full">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">E-mail</label>
            <input 
              type="email" 
              placeholder="exemplo@email.com"
              className={`p-[14px_16px] border-[2px] ${errors.email ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] text-[#333] transition-all duration-300 bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,140,0,0.1)]`}
              {...register("email", { required: true })}
            />
          </div>
          
          <div className="flex flex-col mb-[20px] w-full">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Senha</label>
            <input 
              type="password" 
              className={`p-[14px_16px] border-[2px] ${errors.senha ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] text-[#333] transition-all duration-300 bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00] focus:bg-white focus:shadow-[0_0_0_4px_rgba(255,140,0,0.1)]`}
              {...register("senha", { required: true })}
            />
          </div>

          <div className="text-right mt-[-10px] mb-[25px]">
            <a href="#" className="text-[0.85rem] text-[#FF8C00] font-semibold no-underline transition-colors duration-300 hover:text-[#E67E22] hover:underline">Esqueci minha senha</a>
          </div>

          <button 
            type="submit" 
            className="w-full cursor-pointer bg-[#FF8C00] text-white px-[45px] py-[16px] text-[1.1rem] font-bold rounded-[30px] uppercase tracking-[1px] border border-white shadow-[0_4px_15px_rgba(255,140,0,0.2)] transition-all duration-300 hover:bg-[#E67E22] hover:-translate-y-[2px] hover:shadow-[0_0_30px_rgba(255,140,0,0.8)]"
          >
            Entrar
          </button>
        </form>

        <div className="mt-[25px] text-center border-t border-[#E0E0E0] pt-[20px]">
          <p className="text-[#666] text-[0.95rem]">Não tem uma conta? <Link to="/cadastro" className="text-[#FF8C00] font-bold no-underline hover:underline">Cadastre-se agora</Link></p>
        </div>
      </div>
    </main>
  );
}