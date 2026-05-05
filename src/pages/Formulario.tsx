import { useForm } from 'react-hook-form';
import { User, Calendar, DollarSign, Activity, Clock, MapPin } from 'lucide-react';

interface TriagemFormData {
  nome: string;
  idade: string;
  renda: string;
  tipoDor: string;
  diasDor: string;
  bairro: string;
}

export function Formulario() {
  const { register, handleSubmit, formState: { errors } } = useForm<TriagemFormData>({
    defaultValues: {
      tipoDor: 'leve' // valor padrão pro select
    }
  });

  const onSubmit = (data: TriagemFormData) => {
    console.log("Dados da Triagem (React Hook Form):", data);
    alert("Triagem enviada com sucesso!");
  };

  return (
    <main className="min-h-screen bg-[#F5F5DC] py-12 px-4 font-sans flex justify-center items-start md:items-center pt-[100px]">
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        
        {/* HEADER MINIMALISTA */}
        <div className="p-8 pb-6 text-center border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Triagem Dentária</h2>
          <p className="text-gray-500 text-sm mt-1">Preencha os dados para calcular sua urgência.</p>
        </div>

        {/* CORPO DO FORMULÁRIO */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-5">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            
            {/* Nome Completo */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Nome Completo</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User size={16} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ex: João da Silva"
                  {...register("nome", { required: true })}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
              {errors.nome && <span className="text-red-500 text-xs mt-1">Nome é obrigatório</span>}
            </div>

            {/* Idade */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Idade</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Calendar size={16} className="text-gray-400" />
                </div>
                <input 
                  type="number" 
                  min="0"
                  placeholder="Ex: 15"
                  {...register("idade", { required: true })}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
              {errors.idade && <span className="text-red-500 text-xs mt-1">Idade é obrigatória</span>}
            </div>

            {/* Renda */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Renda (Salários)</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <DollarSign size={16} className="text-gray-400" />
                </div>
                <input 
                  type="number" 
                  min="0"
                  step="0.1"
                  placeholder="Ex: 1.5"
                  {...register("renda", { required: true })}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
              {errors.renda && <span className="text-red-500 text-xs mt-1">Renda é obrigatória</span>}
            </div>

            {/* Tipo de Dor */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Tipo de Dor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Activity size={16} className="text-[#FF8C00]" />
                </div>
                <select 
                  {...register("tipoDor", { required: true })}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="leve">Leve</option>
                  <option value="forte">Forte</option>
                  <option value="dente quebrado">Dente Quebrado</option>
                </select>
              </div>
            </div>

            {/* Dias com Dor */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Dias com Dor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Clock size={16} className="text-gray-400" />
                </div>
                <input 
                  type="number" 
                  min="0"
                  placeholder="Ex: 5"
                  {...register("diasDor", { required: true })}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
              {errors.diasDor && <span className="text-red-500 text-xs mt-1">Obrigatório</span>}
            </div>

            {/* Bairro */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Bairro</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ex: Tatuapé"
                  {...register("bairro", { required: true })}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
              {errors.bairro && <span className="text-red-500 text-xs mt-1">Bairro é obrigatório</span>}
            </div>

          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-[#FF8C00] text-white font-bold py-3 rounded-lg hover:bg-[#E67E22] transition-colors"
            >
              Enviar para Triagem
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}