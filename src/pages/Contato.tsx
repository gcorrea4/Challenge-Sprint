import { useState, useRef, useEffect, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import type { LucideIcon } from 'lucide-react';
import {
  Phone,
  Mail,
  MessageCircle,
  MapPin,
  Clock,
  Globe,
  ChevronDown,
  Copy,
  Check,
  Send,
  ExternalLink,
} from 'lucide-react';

const ENDERECO = {
  rua: 'Rua Maurício Francisco Klabin, 449',
  bairro: 'Vila Mariana',
  cidade: 'São Paulo - SP',
  cep: '04120-020',
};

const MAPA_URL = `https://maps.google.com/maps?q=${encodeURIComponent(
  ENDERECO.rua
)}&t=&z=15&ie=UTF8&iwloc=&output=embed`;

const CONTATOS = [
  { icon: Phone, label: 'Telefone', valor: '+55 11 5084-7276', copiavel: true },
  { icon: Mail, label: 'Email Presidente', valor: 'turmadobem@tdb.org.br', copiavel: true },
  { icon: Mail, label: 'Email Comunicação', valor: 'comunicacao@tdb.org.br', copiavel: true },
  { icon: MessageCircle, label: 'Dúvidas e Sugestões', valor: 'faleconosco@tdb.org.br', copiavel: true },
];

const REDES_SOCIAIS = [
  { icon: ExternalLink, nome: 'Facebook', url: 'https://www.facebook.com/turmadobem' },
  { icon: ExternalLink, nome: 'Twitter / X', url: 'https://x.com/turmadobem' },
  { icon: ExternalLink, nome: 'Instagram', url: 'https://www.instagram.com/ongturmadobem/' },
  { icon: ExternalLink, nome: 'LinkedIn', url: 'https://www.linkedin.com/company/turma-do-bem?originalSubdomain=br' },
  { icon: Globe, nome: 'Site Oficial', url: 'https://turmadobem.org.br/' },
];

const HORARIOS = [
  { dia: 'Segunda a Sexta', horario: '9h às 18h' },
  { dia: 'Sábado', horario: '9h às 13h' },
  { dia: 'Domingo', horario: 'Fechado' },
];

function BotaoCopiar({ texto }: { texto: string }) {
  const [copiado, setCopiado] = useState(false);

  const copiar = async () => {
    try {
      await navigator.clipboard.writeText(texto);
      setCopiado(true);
      setTimeout(() => setCopiado(false), 2000);
    } catch {
      /* fallback silencioso */
    }
  };

  return (
    <button
      onClick={copiar}
      aria-label={`Copiar ${texto}`}
      title="Copiar"
      className="ml-2 p-1 rounded hover:bg-orange-100 transition-colors text-gray-400 hover:text-orange-500 focus:outline-none focus:ring-2 focus:ring-orange-300"
    >
      {copiado ? <Check size={14} className="text-green-500" /> : <Copy size={14} />}
    </button>
  );
} 


          <section>
            <h3 
              onClick={() => setRedesOpen(!redesOpen)}
              className="text-[#333333] text-[1.17em] font-bold mt-[30px] border-b border-[#ccc] pb-[5px] cursor-pointer hover:text-orange-500 transition-colors flex justify-between"
            >
              Redes Sociais <span>{redesOpen ? '−' : '+'}</span>
            </h3>
            
            {redesOpen && (
              <div className="mt-[15px]">
                <ul className="list-none pl-0 m-0">
                  <li className="mb-[10px]"><a href="https://www.facebook.com/turmadobem" target="_blank" rel="noreferrer" className="text-black hover:text-orange-500 transition-colors font-medium">Facebook</a></li>
                  <li className="mb-[10px]"><a href="https://x.com/turmadobem" target="_blank" rel="noreferrer" className="text-black hover:text-orange-500 transition-colors font-medium">Twitter</a></li>
                  <li className="mb-[10px]"><a href="https://www.instagram.com/ongturmadobem/" target="_blank" rel="noreferrer" className="text-black hover:text-orange-500 transition-colors font-medium">Instagram</a></li>
                  <li className="mb-[10px]"><a href="https://www.linkedin.com/company/turma-do-bem?originalSubdomain=br" target="_blank" rel="noreferrer" className="text-black hover:text-orange-500 transition-colors font-medium">LinkedIn</a></li>
                  <li className="mb-[10px]"><a href="https://turmadobem.org.br/" target="_blank" rel="noreferrer" className="text-black hover:text-orange-500 transition-colors font-medium">Site Oficial</a></li>
                </ul>
              </div>
            )}
          </section>
        </div>

        
        <div className="flex-1 w-full">
          <iframe 
            src="https://maps.google.com/maps?q=Rua%20Maur%C3%ADcio%20Francisco%20Klabin,%20449&t=&z=15&ie=UTF8&iwloc=&output=embed" 
            allowFullScreen 
            loading="lazy" 
            referrerPolicy="no-referrer-when-downgrade"
            className="w-full h-[300px] sm:h-[350px] md:h-[400px] lg:h-[500px] border-none rounded-[8px] shadow-md"
          ></iframe>
        </div>

      </div>
    </main>
  );
}