import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Send, ArrowLeft, User, Mail, HelpCircle, MessageSquare } from 'lucide-react';

export function FormularioContato() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    nome: '',
    email: '',
    assunto: '',
    mensagem: ''
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log("Mensagem de Contacto Institucional:", formData);
    alert("Mensagem enviada com sucesso! A nossa equipa entrará em contacto em breve.");
    navigate('/contato'); 
  };

  return (
    <main className="min-h-screen bg-[#F5F5DC] flex justify-center items-center py-[120px] px-6 font-sans">
      
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-md border border-gray-200 overflow-hidden relative">
        
        {/* BOTÃO DE VOLTAR */}
        <div className="absolute top-6 left-6">
          <Link 
            to="/contato" 
            className="text-gray-400 hover:text-[#FF8C00] font-bold text-sm flex items-center gap-1 transition-colors no-underline"
          >
            <ArrowLeft size={16} /> Voltar
          </Link>
        </div>

        {/* CABEÇALHO */}
        <div className="pt-12 pb-6 px-8 text-center border-b border-gray-100">
          <h2 className="text-2xl font-bold text-gray-800">Fale Connosco</h2>
          <p className="text-gray-500 text-sm mt-1">
            Tem alguma dúvida, quer ser doador ou falar com a imprensa? Envie a sua mensagem.
          </p>
        </div>

        {/* FORMULÁRIO */}
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

            {/* E-mail */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">E-mail de Contacto</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail size={16} className="text-gray-400" />
                </div>
                <input 
                  type="email" 
                  name="email"
                  required
                  placeholder="exemplo@email.com"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors"
                />
              </div>
            </div>

            {/* Assunto */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">Assunto</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <HelpCircle size={16} className="text-[#FF8C00]" />
                </div>
                <select 
                  name="assunto"
                  required
                  value={formData.assunto}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors appearance-none cursor-pointer"
                >
                  <option value="" disabled>Selecione o motivo do contacto...</option>
                  <option value="Dúvida Geral">Dúvida Geral</option>
                  <option value="Quero ser Doador">Quero ser Doador</option>
                  <option value="Imprensa">Imprensa / Comunicação</option>
                  <option value="Parcerias">Parcerias com Clínicas</option>
                  <option value="Outros">Outros</option>
                </select>
              </div>
            </div>

            {/* Mensagem */}
            <div className="md:col-span-2">
              <label className="block text-sm font-bold text-gray-700 mb-1.5">A sua Mensagem</label>
              <div className="relative">
                <div className="absolute top-3 left-0 pl-3 pointer-events-none">
                  <MessageSquare size={16} className="text-gray-400" />
                </div>
                <textarea 
                  name="mensagem"
                  required
                  rows={4}
                  placeholder="Escreva aqui a sua mensagem..."
                  value={formData.mensagem}
                  onChange={handleChange}
                  className="w-full pl-9 pr-4 py-2.5 bg-white border border-gray-300 rounded-lg text-sm text-gray-700 focus:ring-1 focus:ring-[#FF8C00] focus:border-[#FF8C00] outline-none transition-colors resize-none"
                />
              </div>
            </div>

          </div>

          <div className="pt-4">
            <button 
              type="submit" 
              className="w-full bg-[#FF8C00] text-white font-bold py-3.5 rounded-lg hover:bg-[#E67E22] transition-colors flex items-center justify-center gap-2 shadow-sm"
            >
              <Send size={18} />
              Enviar Mensagem
            </button>
          </div>

        </form>
      </div>
    </main>
  );
}