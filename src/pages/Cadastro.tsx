import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';

interface CadastroFormData {
  nome?: string;
  email?: string;
  senha?: string;
  tipo?: string;
  documento?: string;
  bairro?: string;
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
    setValue("documento", value); 
  };

  const handleCRO = (e: React.ChangeEvent<HTMLInputElement>) => {
    let value = e.target.value.toUpperCase().replace(/[^A-Z0-9-]/g, ""); 
    if (value.length > 10) value = value.slice(0, 10);
    setValue("documento", value);
  };

  const onSubmit = async (data: CadastroFormData) => {
    // Monta o objeto base
    const novoUsuario: any = {
      nome: data.nome,
      email: data.email,
      senha: data.senha,
      tipoPerfil: data.tipo,  // Alterado de tipo_perfil para tipoPerfil
      bairro: data.bairro
    };

    // Separa logicamente o documento em CPF ou CRO dependendo do tipo
    if (data.tipo === 'paciente') {
      novoUsuario.cpf = data.documento;
    } else if (data.tipo === 'dentista') {
      novoUsuario.cro = data.documento;
    }

    try {
      const response = await fetch('https://dentista-na-nuvem-production.up.railway.app/cadastrar-usuario', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario),
      });
      if (response.ok) {
        setMensagem({ texto: "Registo realizado com sucesso! Redirecionando...", tipo: "sucesso" });
        setTimeout(() => navigate('/login'), 2000);
      } else {
        const erroData = await response.json();
        
        let textoErro = "Erro ao realizar o registro.";
        if (erroData.detail) {
          if (Array.isArray(erroData.detail)) {
            textoErro = "Verifique os campos preenchidos. Formato inválido.";
          } else if (typeof erroData.detail === 'string') {
            textoErro = erroData.detail;
          }
        }
        
        setMensagem({ texto: textoErro, tipo: "erro" });
      }
    } catch (error) {
      setMensagem({ texto: "Erro ao conectar com o Servidor! Verifique a API.", tipo: "erro" });
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
            {/* ADICIONE ESTA LINHA ABAIXO DO INPUT */}
            {errors.nome && <span className="text-[#D8000C] text-xs mt-1 font-semibold">O nome é obrigatório.</span>}
          </div>
          
          <div className="flex flex-col mb-[15px] w-full">
  <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">E-mail (Login)</label>
  <input 
    type="email" 
    placeholder="exemplo@email.com"
    className={`p-[14px_16px] border-[2px] ${errors.email ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
    {...register("email", { 
      required: "O E-mail é obrigatório.",
      pattern: {
        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "E-mail em formato inválido."
      }
    })}
  />
  {errors.email && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.email.message}</span>}
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
            {errors.tipo && <span className="text-[#D8000C] text-xs mt-1 font-semibold">Escolha seu tipo de Perfil.</span>}
          </div>

          {tipoPerfil && (
             <div className="flex flex-col mb-[15px] w-full animate-fade-in">
                <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">
                  {tipoPerfil === 'paciente' ? 'Escolha a região mais próxima da sua residência:' : 'Região de atendimento da sua Clínica:'}
                </label>
                <select 
                  className={`p-[14px_16px] border-[2px] ${errors.bairro ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
                  {...register("bairro", { required: true })}
                >
                  <option value="">Selecione a região...</option>
                  <option value="Capão Redondo">Zona Sul (Capão Redondo / Grajaú)</option>
                  <option value="Heliópolis">Zona Sul (Heliópolis / Ipiranga)</option>
                  <option value="Itaquera">Zona Leste (Itaquera / Guaianases)</option>
                  <option value="Brasilândia">Zona Norte (Brasilândia / Cachoeirinha)</option>
                  <option value="Paraisópolis">Zona Oeste (Paraisópolis / Campo Limpo)</option>
                  <option value="Osasco">Grande SP (Osasco / Carapicuíba)</option>
                  <option value="Centro">Centro (Luz / República)</option>
                </select>
                {errors.bairro && <span className="text-[#D8000C] text-xs mt-1 font-semibold">Selecione a região!</span>}
             </div>
          )}

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
              {errors.documento && <span className="text-[#D8000C] text-xs mt-1 font-semibold">Digite seu CPF</span>}
            </div>
          )}

          {tipoPerfil === 'dentista' && (
            <div className="flex flex-col mb-[15px] w-full animate-fade-in">
  <label className="text-[0.9rem] font-semibold text-[#444] mb-[8px]">CRO</label>
  <input 
    type="text" 
    placeholder="Ex: 12345-SP"
    className={`p-[14px_16px] border-[2px] ${errors.documento ? 'border-[#dc3545]' : 'border-[#E0E0E0]'} rounded-[8px] text-[1rem] bg-[#FAFAFA] focus:outline-none focus:border-[#FF8C00]`}
    {...register("documento", { 
      required: "Digite seu CRO",
      pattern: {
        value: /^\d{4,6}-[A-Z]{2}$/i,
        message: "Formato inválido. Use Ex: 12345-SP"
      }
    })}
    onChange={handleCRO}
  />
  {errors.documento && <span className="text-[#D8000C] text-xs mt-1 font-semibold">{errors.documento.message}</span>}
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
              {errors.senha && <span className="text-[#D8000C] text-xs mt-1 font-semibold">Digite sua senha!</span>}
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
              {errors.confirma && <span className="text-[#D8000C] text-xs mt-1 font-semibold">As senhas devem ser iguais.</span>}
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
        
        
        <p className="text-[#666] text-[0.95rem] bg-orange-50 py-2 rounded-lg border border-orange-100">
            Deseja apoiar a causa? <Link to="/doador" className="text-[#FF8C00] font-black no-underline hover:underline">Seja um Doador</Link>
          </p>
          </div>
      </div>
    </main>
  );
}