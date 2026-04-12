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


interface AccordionProps {
  titulo: string;
  icone: LucideIcon;
  aberto: boolean;
  onToggle: () => void;
  children: ReactNode;
}

function Accordion({ titulo, icone: Icone, aberto, onToggle, children }: AccordionProps) {
  const conteudoRef = useRef<HTMLDivElement>(null);
  const [altura, setAltura] = useState(0);

  useEffect(() => {
    const el = conteudoRef.current;
    if (el) {
      setAltura(el.scrollHeight);
    }
  }, [aberto]);

  return (
    <section className="border-b border-[#ddd]">
      <h3 className="m-0">
        <button
          onClick={onToggle}
          aria-expanded={aberto}
          className="w-full flex items-center justify-between py-4 px-1 bg-transparent border-none cursor-pointer text-[#333] text-[1.1rem] font-semibold hover:text-orange-500 transition-colors focus:outline-none focus:ring-2 focus:ring-orange-300 focus:ring-offset-2 rounded"
        >
          <span className="flex items-center gap-3">
            {Icone && <Icone size={20} className="text-orange-500" />}
            {titulo}
          </span>
          <ChevronDown
            size={20}
            className={`transition-transform duration-300 ${aberto ? 'rotate-180' : ''}`}
          />
        </button>
      </h3>

      <div
        role="region"
        style={{
          maxHeight: aberto ? `${altura}px` : '0px',
          opacity: aberto ? 1 : 0,
        }}
        className="overflow-hidden transition-all duration-300 ease-in-out"
      >
        <div ref={conteudoRef} className="pb-4 px-1">
          {children}
        </div>
      </div>
    </section>
  );
}

export function Contato() {
  const [contatosOpen, setContatosOpen] = useState(true);
  const [localizacaoOpen, setLocalizacaoOpen] = useState(false);
  const [redesOpen, setRedesOpen] = useState(false);

  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans pt-[80px] lg:pt-[120px]">
      <div className="flex flex-col md:flex-row items-start gap-10 lg:gap-20 max-w-[1200px] mx-auto my-12 px-5">

        {/* ── Coluna esquerda ── */}
        <div className="flex-1 w-full">
          <h2 className="text-[#333] text-2xl lg:text-[34px] font-bold mb-2 mt-0">
            Contatos da empresa
          </h2>
          <p className="text-gray-500 text-sm mb-10">
            Entre em contato conosco por qualquer um dos canais abaixo.
          </p>

          {/* Contatos */}
          <Accordion
            titulo="Contatos"
            icone={Phone}
            aberto={contatosOpen}
            onToggle={() => setContatosOpen(!contatosOpen)}
          >
            <ul className="list-none p-0 m-0 space-y-3">
              {CONTATOS.map((c) => (
                <li key={c.label} className="flex items-center gap-3 text-[#333]">
                  <c.icon size={16} className="text-orange-400 shrink-0" />
                  <span>
                    <strong className="text-sm">{c.label}:</strong>{' '}
                    <span className="text-sm">{c.valor}</span>
                  </span>
                  {c.copiavel && <BotaoCopiar texto={c.valor} />}
                </li>
              ))}
            </ul>