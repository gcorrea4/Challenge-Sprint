import { useState } from 'react';
import { User, Calendar, DollarSign, Activity, Clock, MapPin } from 'lucide-react';

export function Formulario() {
  const [formData, setFormData] = useState({
    nome: '',
    idade: '',
    renda: '',
    tipoDor: 'Leve',
    diasDor: '',
    bairro: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Dados da Triagem:", formData);
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
        <form onSubmit={handleSubmit} className="p-8 space-y-5">
          
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
                  name="nome"
                  required
                  placeholder="Ex: João da Silva"
                  value={formData.nome}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
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
                  name="idade"
                  required
                  min="0"
                  placeholder="Ex: 15"
                  value={formData.idade}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
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
                  name="renda"
                  required
                  min="0"
                  step="0.1"
                  placeholder="Ex: 1.5"
                  value={formData.renda}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Tipo de Dor */}
            <div>
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Tipo de Dor</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Activity size={16} className="text-[#FF8C00]" />
                </div>
                <select 
                  name="tipoDor"
                  value={formData.tipoDor}
                  onChange={handleChange}
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
                  name="diasDor"
                  required
                  min="0"
                  placeholder="Ex: 5"
                  value={formData.diasDor}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
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
                  name="bairro"
                  required
                  placeholder="Ex: Tatuapé"
                  value={formData.bairro}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
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