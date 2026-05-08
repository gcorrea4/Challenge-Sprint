import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

interface CadastroFormData {
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: string;
  documento?: string;
  pais?: string;
  cidade?: string;
  confirma?: string;
}

export function Cadastro() {
  const { register, handleSubmit, watch, setValue, formState: { errors } } = useForm<CadastroFormData>();
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
    setValue("documento", value, { shouldValidate: true }); 
  };

  // Nova máscara do CRO que aceita 4 a 6 números + Estado
  const handleCRO = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9]/g, "");
    if (value.length > 8) value = value.slice(0, 8);
    
    const numeros = value.replace(/[^0-9]/g, '');
    const letras = value.replace(/[0-9]/g, '');
    
    if (letras.length > 0) {
      value = numeros + "-" + letras.slice(0, 2);
    } else {
      value = numeros;
    }
    
    setValue("documento", value, { shouldValidate: true }); 
  };

  const onSubmit = async (data: CadastroFormData) => {
    setMensagem({ texto: 'A processar o seu registo...', tipo: 'sucesso' });
    
    try {
      const url = data.tipo === 'paciente' 
        ? 'https://dentista-na-nuvem-production.up.railway.app/pacientes'
        : 'https://dentista-na-nuvem-production.up.railway.app/dentistas';

      const payload = data.tipo === 'paciente' ? {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cpf: data.documento,
        tipo: data.tipo,
        pais: data.pais,
        cidade: data.cidade
      } : {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
        cro: data.documento,
        tipo: data.tipo,
        pais: data.pais,
        cidade: data.cidade
      };

      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        setMensagem({ texto: 'Registo concluído com sucesso! A redirecionar...', tipo: 'sucesso' });
        setTimeout(() => navigate('/login'), 2500);
      } else {
        const errorData = await response.json().catch(() => null);
        setMensagem({ texto: errorData?.erro || 'Erro ao realizar o registo. Verifique os dados.', tipo: 'erro' });
      }
    } catch (error) {
      console.error(error);
      setMensagem({ texto: 'Erro de conexão. O servidor pode estar offline.', tipo: 'erro' });
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-[#F5F5DC] p-[20px] pt-[85px] font-sans">
      <div className="bg-white p-[40px] rounded-[20px] shadow-lg max-w-[600px] w-full relative">
        <div className="text-center mb-[30px]">
          <h2 className="text-[2rem] text-[#FF8C00] font-black tracking-[1px] mb-[10px]">Crie a sua Conta</h2>
          <p className="text-[#666] text-[1rem]">Junte-se à Turma do Bem e faça a diferença!</p>
        </div>

        {mensagem.texto && (
          <div className={`p-[15px] mb-[20px] rounded-[8px] font-bold text-center animate-fade-in ${mensagem.tipo === 'sucesso' ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]' : 'bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]'}`}>
            {mensagem.texto}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="flex flex-col mb-[15px] w-full">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Nome Completo</label>
            <input 
              type="text" 
              placeholder="Ex: João da Silva"
              className={`p-[14px_16px] border-[2px] ${errors.nome ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
              {...register("nome", { required: "O nome é obrigatório" })}
            />
            {errors.nome && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.nome.message}</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-0 sm:gap-[15px] mb-[15px]">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Eu sou...</label>
              <select 
                className={`p-[14px_16px] border-[2px] ${errors.tipo ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                {...register("tipo", { required: "Selecione o perfil" })}
              >
                <option value="">Selecione...</option>
                <option value="paciente">Beneficiário (Paciente)</option>
                <option value="dentista">Dentista Voluntário</option>
              </select>
              {errors.tipo && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.tipo.message}</span>}
            </div>

            {tipoPerfil === 'paciente' && (
               <div className="flex flex-col w-full sm:w-1/2 mt-[15px] sm:mt-0 animate-fade-in">
                  <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">CPF</label>
                  <input 
                    type="text" 
                    placeholder="123.456.789-00"
                    className={`p-[14px_16px] border-[2px] ${errors.documento ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                    {...register("documento", { 
                      required: "O CPF é obrigatório",
                      pattern: { value: /^\d{3}\.\d{3}\.\d{3}-\d{2}$/, message: "CPF incompleto" },
                      onChange: handleCPF 
                    })}
                  />
                  {errors.documento && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.documento.message}</span>}
               </div>
            )}

            {tipoPerfil === 'dentista' && (
               <div className="flex flex-col w-full sm:w-1/2 mt-[15px] sm:mt-0 animate-fade-in">
                  <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">CRO</label>
                  <input 
                    type="text" 
                    placeholder="12345-SP"
                    className={`p-[14px_16px] border-[2px] ${errors.documento ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                    {...register("documento", { 
                      required: "O CRO é obrigatório",
                      pattern: { value: /^\d{4,6}-[A-Z]{2}$/, message: "Formato: 12345-UF" },
                      onChange: handleCRO 
                    })}
                  />
                  {errors.documento && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.documento.message}</span>}
               </div>
            )}
          </div>

          {tipoPerfil && (
             <div className="flex flex-col sm:flex-row gap-0 sm:gap-[15px] mb-[15px] animate-fade-in">
                <div className="flex flex-col w-full sm:w-1/2">
                  <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">País</label>
                  <select 
                    className={`p-[14px_16px] border-[2px] ${errors.pais ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                    {...register("pais", { required: "Selecione o país" })}
                  >
                    <option value="">Selecione...</option>
                    <option value="Brasil">Brasil</option>
                    <option value="Argentina">Argentina</option>
                    <option value="México">México</option>
                    <option value="Colômbia">Colômbia</option>
                    <option value="Peru">Peru</option>
                    <option value="Chile">Chile</option>
                    <option value="Panamá">Panamá</option>
                  </select>
                </div>

                <div className="flex flex-col w-full sm:w-1/2 mt-[15px] sm:mt-0">
                  <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Cidade</label>
                  <input 
                    type="text"
                    placeholder="Ex: São Paulo"
                    className={`p-[14px_16px] border-[2px] ${errors.cidade ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                    {...register("cidade", { required: "A cidade é obrigatória" })}
                  />
                </div>
             </div>
          )}

          <div className="flex flex-col mb-[15px] w-full">
            <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">E-mail</label>
            <input 
              type="email" 
              placeholder="exemplo@email.com"
              className={`p-[14px_16px] border-[2px] ${errors.email ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
              {...register("email", { 
                required: "O E-mail é obrigatório",
                pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "E-mail inválido" }
              })}
            />
            {errors.email && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.email.message}</span>}
          </div>

          <div className="flex flex-col sm:flex-row gap-0 sm:gap-[15px] mb-[25px]">
            <div className="flex flex-col w-full sm:w-1/2">
              <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Senha</label>
              <input 
                type="password" 
                placeholder="Mínimo 6 dígitos"
                className={`p-[14px_16px] border-[2px] ${errors.senha ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                {...register("senha", { 
                  required: "Senha obrigatória", 
                  minLength: { value: 6, message: "No mínimo 6 caracteres" } 
                })}
              />
              {errors.senha && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.senha.message}</span>}
            </div>

            <div className="flex flex-col w-full sm:w-1/2 mt-[15px] sm:mt-0">
              <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">Confirmar Senha</label>
              <input 
                type="password" 
                placeholder="Repita a senha"
                className={`p-[14px_16px] border-[2px] ${errors.confirma ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                {...register("confirma", { 
                  required: "Confirme a senha", 
                  validate: value => value === senha || "As senhas não coincidem"
                })}
              />
              {errors.confirma && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.confirma.message}</span>}
            </div>
          </div>

          <button 
            type="submit" 
            className="w-full mt-[10px] cursor-pointer bg-[#FF8C00] text-white px-[45px] py-[16px] text-[1.1rem] font-bold rounded-[30px] uppercase tracking-[1px] shadow-md transition-all hover:bg-[#E67E22] hover:-translate-y-1"
          >
            Concluir Registo
          </button>
        </form>

        <div className="mt-[25px] text-center border-t border-[#E0E0E0] pt-[20px]">
          <p className="text-[#666] text-[0.95rem]">Já tem uma conta? <Link to="/login" className="text-[#FF8C00] font-bold no-underline hover:underline">Faça Login</Link></p>
        </div>
      </div>
    </div>
  );
}