import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

export function Cadastro() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm();
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const navigate = useNavigate();

  const senha = watch('senha');
  const tipoPerfil = watch('tipo'); 

  
  const handleCPF = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.replace(/\D/g, ""); 
    if (value.length > 11) value = value.slice(0, 11);
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d)/, "$1.$2");
    value = value.replace(/(\d{3})(\d{1,2})$/, "$1-$2");
    setValue("documento", value); 
  };

  const handleCRO = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""); 
    if (value.length > 10) value = value.slice(0, 10);
    setValue("documento", value);
  };

  const onSubmit = async (data: any) => {
    try {
      if (data.tipo === 'dentista') {
        const resposta = await fetch('http://127.0.0.1:8000/cadastrar-dentista', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            nome: data.nome,
            usuario: data.email, 
            senha: data.senha,
            bairro: data.bairro
            
          })
        });
        
        const result = await resposta.json();
        if (result.status !== 'sucesso') throw new Error("Erro no backend");

      } else {
        if (localStorage.getItem("usuario_" + data.email)) {
          setMensagem({ texto: "Este e-mail já está cadastrado!", tipo: "erro" });
          return;
        }
        const novoUsuario = {
          nomeCompleto: data.nome,
          email: data.email,
          senha: data.senha,
          tipo: data.tipo, 
          documento: data.documento, // Salva o CPF no storage
          dataCadastro: new Date().toLocaleDateString('pt-BR')
        };
        localStorage.setItem("usuario_" + data.email, JSON.stringify(novoUsuario));
      }

      setMensagem({ texto: "Cadastro realizado com sucesso! Redirecionando...", tipo: "sucesso" });
      setTimeout(() => navigate('/login'), 2000);

    } catch (error) {
      setMensagem({ texto: "Erro ao cadastrar. Verifique o servidor.", tipo: "erro" });
    }
  };

  return (
    <main className="bg-[#F5F5DC] min-h-screen flex justify-center items-center py-[120px] px-[20px]">
      <div className="bg-white w-full max-w-[500px] p-[30px] sm:p-[40px] rounded-[16px] shadow-[0_10px_40px_rgba(0,0,0,0.08)] border border-black/5">
        
        <div className="text-center mb-[30px]">
          <h2 className="text-[#333] text-[2rem] m-[0_0_10px_0] font-bold">Crie sua Conta</h2>
          <p className="text-[#666] m-0 text-[0.95rem]">Faça parte da nossa rede e ajude a transformar sorrisos.</p>
        </div>

        {mensagem.texto && (
          <div className={`p-[15px] rounded-[8px] mb-[20px] font-semibold text-center text-[0.95rem] ${mensagem.tipo === 'erro' ? 'bg-[#FFEFEF] text-[#D8000C] border border-[#FFD2D2]' : 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-[15px] w-full">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Nome Completo</label>
            <input 
              type="text" 
              placeholder="Digite seu nome"
              className={`p-[14px_16px] border-[2px] ${errors.nome ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
              {...register("nome", { required: true })}
            />
          </div>
          
          <div className="flex flex-col mb-[15px] w-full">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">E-mail (Login)</label>
            <input 
              type="email" 
              placeholder="exemplo@email.com"
              className={`p-[14px_16px] border-[2px] ${errors.email ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
              {...register("email", { required: true })}
            />
          </div>

          <div className="flex flex-col mb-[15px] w-full">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Tipo de Perfil</label>
            <select 
              className="p-[14px_16px] border-[2px] border-[#E0E0E0] rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]"
              {...register("tipo", { required: true })}
            >
              <option value="">Selecione...</option>
              <option value="paciente">Sou Beneficiado (Paciente)</option>
              <option value="dentista">Sou Dentista Voluntário</option>
            </select>
          </div>

          
          {tipoPerfil === 'paciente' && (
            <div className="flex flex-col mb-[15px] w-full animate-fade-in">
              <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">CPF</label>
              <input 
                type="text" 
                placeholder="000.000.000-00"
                className={`p-[14px_16px] border-[2px] ${errors.documento ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                {...register("documento", { required: true, minLength: 14 })}
                onChange={handleCPF}
              />
            </div>
          )}

          {tipoPerfil === 'dentista' && (
            <div className="grid grid-cols-2 gap-3 animate-fade-in mb-[15px]">
              <div className="flex flex-col w-full">
                <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">CRO</label>
                <input 
                  type="text" 
                  placeholder="Ex: 12345-SP"
                  className={`p-[14px_16px] border-[2px] ${errors.documento ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                  {...register("documento", { required: true })}
                  onChange={handleCRO}
                />
              </div>
              <div className="flex flex-col w-full">
                <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Bairro da Clínica</label>
                <select 
                  className={`p-[14px_16px] border-[2px] ${errors.bairro ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                  {...register("bairro", { required: true })}
                >
                  <option value="">Selecione...</option>
                  <option value="Tatuapé">Tatuapé</option>
                  <option value="Morumbi">Morumbi</option>
                  <option value="Centro">Centro</option>
                </select>
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-0 sm:gap-[15px]">
            <div className="flex flex-col mb-[15px] w-full">
              <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Senha</label>
              <input 
                type="password" 
                className={`p-[14px_16px] border-[2px] ${errors.senha ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                {...register("senha", { required: true, minLength: 6 })}
              />
            </div>
            <div className="flex flex-col mb-[15px] w-full">
              <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Confirmar Senha</label>
              <input 
                type="password" 
                className={`p-[14px_16px] border-[2px] ${errors.confirma ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                {...register("confirma", { 
                  required: true, 
                  validate: value => value === senha || "As senhas não coincidem"
                })}
              />
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full mt-[10px] cursor-pointer bg-[#FF8C00] text-white px-[45px] py-[16px] text-[1.1rem] font-bold rounded-[30px] uppercase tracking-[1px] shadow-md transition-all hover:bg-[#E67E22] hover:-translate-y-1"
          >
            Cadastrar Agora
          </button>
        </form>

        <div className="mt-[25px] text-center border-t border-[#E0E0E0] pt-[20px]">
          <p className="text-[#666] text-[0.95rem]">Já tem uma conta? <Link to="/login" className="text-[#FF8C00] font-bold no-underline hover:underline">Faça login</Link></p>
        </div>
      </div>
    </main>
  );
}