import { useForm } from 'react-hook-form';
import { useState } from 'react';


type FormData = {
  nome: string;
  email: string;
  assunto: string;
  mensagem: string;
};

export function Formulario() {
  
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  
  
  const [isSuccess, setIsSuccess] = useState(false);

  
  const onSubmit = (data: FormData) => {
    console.log("Dados enviados:", data); 
    setIsSuccess(true);
    reset(); 
    
    
    setTimeout(() => setIsSuccess(false), 5000);
  };

  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans flex flex-col items-center py-[40px] px-[20px] w-full box-border">
      
      <div className="w-full max-w-[700px] bg-white p-[30px] rounded-[8px] shadow-[0_4px_12px_rgba(0,0,0,0.05)] box-border">
        <h2 className="text-center mt-0 text-[#333333] text-[24px] font-bold mb-[10px]">Formulário de Contato</h2>
        <p className="text-center mb-[30px] text-[#555555]">Envie-nos uma mensagem para saber mais.</p>

        
        {isSuccess && (
          <div className="bg-[#d4edda] text-[#155724] p-[15px] border border-[#c3e6cb] rounded-[5px] text-center mb-[20px]">
            Mensagem enviada com sucesso!
          </div>
        )}

        
        <form onSubmit={handleSubmit(onSubmit)}>
          
          
          <div className="flex flex-col mb-[20px]">
            <label htmlFor="nome" className="mb-[8px] font-bold text-[#555]">Nome:</label>
            <input
              type="text"
              id="nome"
              className={`w-full p-[12px] border ${errors.nome ? 'border-[#dc3545]' : 'border-[#ccc]'} rounded-[5px] text-[16px] box-border outline-none focus:border-orange-500`}
              {...register("nome", { required: "O nome é obrigatório" })}
            />
            
            {errors.nome && <span className="text-[#dc3545] text-[0.9em] mt-[5px]">{errors.nome.message}</span>}
          </div>
          
          
          <div className="flex flex-col mb-[20px]">
            <label htmlFor="email" className="mb-[8px] font-bold text-[#555]">Email:</label>
            <input
              type="email"
              id="email"
              className={`w-full p-[12px] border ${errors.email ? 'border-[#dc3545]' : 'border-[#ccc]'} rounded-[5px] text-[16px] box-border outline-none focus:border-orange-500`}
              {...register("email", { 
                required: "O email é obrigatório",
                pattern: { value: /^\S+@\S+$/i, message: "Insira um email válido" }
              })}
            />
            
            {errors.email && <span className="text-[#dc3545] text-[0.9em] mt-[5px]">{errors.email.message}</span>}
          </div>
          
          
          <div className="flex flex-col mb-[20px]">
            <label htmlFor="assunto" className="mb-[8px] font-bold text-[#555]">Assunto:</label>
            <input
              type="text"
              id="assunto"
              className="w-full p-[12px] border border-[#ccc] rounded-[5px] text-[16px] box-border outline-none focus:border-orange-500"
              {...register("assunto")}
            />
          </div>
          
          
          <div className="flex flex-col mb-[20px]">
            <label htmlFor="mensagem" className="mb-[8px] font-bold text-[#555]">Mensagem:</label>
            <textarea
              id="mensagem"
              rows={6}
              className={`w-full p-[12px] border ${errors.mensagem ? 'border-[#dc3545]' : 'border-[#ccc]'} rounded-[5px] text-[16px] box-border resize-y outline-none focus:border-orange-500`}
              {...register("mensagem", { required: "A mensagem é obrigatória" })}
            ></textarea>
            
            {errors.mensagem && <span className="text-[#dc3545] text-[0.9em] mt-[5px]">{errors.mensagem.message}</span>}
          </div>
          
         
          <div className="flex flex-col mb-[20px]">
            <button 
              type="submit" 
              className="text-[1em] p-[12px_20px] bg-[#007BFF] text-white border-none rounded-[5px] cursor-pointer w-full transition-colors duration-300 hover:bg-[#0056b3]"
            >
              Enviar Mensagem
            </button>
          </div>

        </form>
      </div>
      
    </main>
  );
}