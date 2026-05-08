import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { User, Calendar, DollarSign, Activity, Clock, MapPin, ShieldAlert } from 'lucide-react';

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
  const { register, handleSubmit, formState: { errors }, reset } = useForm<TriagemFormData>({
    defaultValues: {
      tipoDor: 'leve'
    }
  });
  const [mensagem, setMensagem] = useState({ texto: '', tipo: '' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (data: TriagemFormData) => {
    setIsSubmitting(true);
    setMensagem({ texto: 'A processar a triagem...', tipo: 'sucesso' });
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
        setMensagem({ texto: 'Triagem enviada com sucesso! A nossa equipa entrará em contacto.', tipo: 'sucesso' });
        reset(); // Limpa o form após sucesso
      } else {
        const err = await response.json().catch(() => null);
        setMensagem({ texto: err?.erro || 'Erro ao enviar triagem. Tente novamente.', tipo: 'erro' });
      }
    } catch {
      setMensagem({ texto: 'Erro de conexão com o servidor.', tipo: 'erro' });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <main className="min-h-screen bg-[#F5F5DC] py-12 px-4 font-sans flex justify-center items-start md:items-center pt-[100px]">
      
      <div className="bg-white w-full max-w-3xl rounded-[24px] shadow-[0_20px_50px_-12px_rgba(0,0,0,0.1)] border border-gray-100 overflow-hidden">
        
        {/* HEADER PREMIUM */}
        <div className="bg-gray-50/50 p-8 pb-6 text-center border-b border-gray-100 relative">
          <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-orange-200">
            <ShieldAlert size={28} className="text-orange-500" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-gray-800 tracking-tight">Triagem Odontológica</h2>
          <p className="text-gray-500 text-sm md:text-base mt-2 max-w-md mx-auto">
            Preencha os dados abaixo com precisão. O nosso algoritmo avaliará o seu caso para priorizar o atendimento.
          </p>
        </div>

        {mensagem.texto && (
          <div className={`mx-8 mt-6 p-4 rounded-xl font-medium text-center text-sm flex items-center justify-center gap-2 ${mensagem.tipo === 'sucesso' ? 'bg-green-50 text-green-700 border border-green-200' : 'bg-red-50 text-red-700 border border-red-200'}`}>
            {mensagem.texto}
          </div>
        )}

        {/* CORPO DO FORMULÁRIO */}
        <form onSubmit={handleSubmit(onSubmit)} className="p-8 space-y-6">
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="md:col-span-2">
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">Nome Completo</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <User size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ex: João da Silva"
                  {...register("nome", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
              {errors.nome && <span className="text-red-500 text-xs mt-1.5 block font-medium">Nome é obrigatório</span>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">Idade</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Calendar size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="number" 
                  min="0"
                  placeholder="Ex: 15"
                  {...register("idade", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
              {errors.idade && <span className="text-red-500 text-xs mt-1.5 block font-medium">Idade é obrigatória</span>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">Renda Familiar (Salários)</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <DollarSign size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="number" 
                  min="0"
                  step="0.1"
                  placeholder="Ex: 1.5"
                  {...register("renda", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
              {errors.renda && <span className="text-red-500 text-xs mt-1.5 block font-medium">Renda é obrigatória</span>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">Gravidade da Dor</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Activity size={18} className="text-orange-500" />
                </div>
                <select 
                  {...register("tipoDor", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 appearance-none cursor-pointer font-medium"
                >
                  <option value="leve">Leve (Suportável)</option>
                  <option value="forte">Forte (Incomoda muito)</option>
                  <option value="dente quebrado">Dente Quebrado / Urgência</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">Dias com a Dor</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <Clock size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="number" 
                  min="0"
                  placeholder="Ex: 5"
                  {...register("diasDor", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
              {errors.diasDor && <span className="text-red-500 text-xs mt-1.5 block font-medium">Obrigatório</span>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">País de Residência</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <select
                  {...register("pais", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200 appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecione...</option>
                  <option value="Brasil">Brasil</option>
                  <option value="Argentina">Argentina</option>
                  <option value="Colômbia">Colômbia</option>
                  <option value="México">México</option>
                  <option value="Chile">Chile</option>
                </select>
              </div>
              {errors.pais && <span className="text-red-500 text-xs mt-1.5 block font-medium">País é obrigatório</span>}
            </div>

            <div>
              <label className="block text-[13px] font-bold text-gray-700 uppercase tracking-wide mb-2">Cidade Atual</label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
                  <MapPin size={18} className="text-gray-400 group-focus-within:text-orange-500 transition-colors" />
                </div>
                <input 
                  type="text" 
                  placeholder="Ex: São Paulo"
                  {...register("cidade", { required: true })}
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl text-gray-800 focus:bg-white focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 outline-none transition-all duration-200"
                />
              </div>
              {errors.cidade && <span className="text-red-500 text-xs mt-1.5 block font-medium">Cidade é obrigatória</span>}
            </div>

          </div>

          <div className="pt-6 mt-6 border-t border-gray-100">
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="w-full bg-gradient-to-r from-[#FF8C00] to-[#f39c12] text-white font-bold text-lg py-4 rounded-xl shadow-[0_8px_20px_rgba(255,140,0,0.25)] hover:shadow-[0_10px_25px_rgba(255,140,0,0.35)] hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.98] transition-all duration-200 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'A enviar...' : 'Enviar para Triagem'}
            </button>
            <p className="text-center text-xs text-gray-400 mt-4">
              Os seus dados estão protegidos e serão utilizados apenas para fins médicos.
            </p>
          </div>

        </form>
      </div>
    </main>
  );
}