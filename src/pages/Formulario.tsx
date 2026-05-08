import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Calendar, DollarSign, Activity, Clock, MapPin } from 'lucide-react';

interface TriagemFormData {
  nome: string;
  idade: string;
  renda: string;
  tipoDor: string;
  diasDor: string;
  pais: string;
  cidade: string;
}

export function Formulario() {
  const { register, handleSubmit, formState: { errors } } = useForm<TriagemFormData>({
    defaultValues: {
      tipoDor: 'leve'
    }
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });

  const onSubmit = async (data: TriagemFormData) => {
    setMensagem({ texto: 'Enviando triagem...', tipo: 'sucesso' });
    try {
      const response = await fetch('https://dentista-na-nuvem-production.up.railway.app/pacientes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          nome: data.nome,
          idade: Number(data.idade),
          rendaSalarioMinimo: Number(data.renda),
          tipoDor: data.tipoDor,
          tempoDorDias: Number(data.diasDor),
          pais: data.pais,
          cidade: data.cidade,
        }),
      });
      if (response.ok) {
        setMensagem({ texto: 'Triagem enviada com sucesso! Entraremos em contacto em breve.', tipo: 'sucesso' });
      } else {
        const err = await response.json().catch(() => null);
        setMensagem({ texto: err?.erro || 'Erro ao enviar triagem. Tente novamente.', tipo: 'erro' });
      }
    } catch {
      setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5DC] py-12 px-4 font-sans flex justify-center items-start md:items-center pt-[100px]">
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md border border-gray-200 overflow-hidden">
        
        {/* HEADER MINIMALISTA */}
        <div className="p-8 pb-6 text-center border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Triagem Dentária</h2>
          <p className="text-gray-500 text-sm mt-1">Preencha os dados para calcular sua urgência.</p>
        </div>

        {mensagem.texto && (
          <div className={`mx-8 mt-6 p-4 rounded-lg font-bold text-center ${mensagem.tipo === 'sucesso' ? 'bg-[#E8F5E9] text-[#2E7D32] border border-[#C8E6C9]' : 'bg-[#ffebee] text-[#c62828] border border-[#ffcdd2]'}`}>
            {mensagem.texto}
          </div>
        )}

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

            {/* País */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">País</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <select
                  {...register("pais", { required: true })}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="">Selecione...</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Colômbia">Colômbia</option>
                  <option value="México">México</option>
                  <option value="Chile">Chile</option>
                </select>
              </div>
              {errors.pais && <span className="text-red-500 text-xs mt-1">País é obrigatório</span>}
            </div>

            {/* Cidade */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Cidade</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <MapPin size={16} className="text-gray-400" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ex: São Paulo"
                  {...register("cidade", { required: true })}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
              {errors.cidade && <span className="text-red-500 text-xs mt-1">Cidade é obrigatória</span>}
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