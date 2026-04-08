import { useState } from 'react';
import { Link } from 'react-router-dom';

export function Contato() {
 
  const [contatosOpen, setContatosOpen] = useState(true); 
  const [localizacaoOpen, setLocalizacaoOpen] = useState(false);
  const [redesOpen, setRedesOpen] = useState(false);

  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans">
      
     
      <div className="flex flex-col md:flex-row items-start gap-[40px] lg:gap-[80px] max-w-[1200px] mx-auto my-[40px] px-[20px]">

        
        <div className="flex-1 w-full">
          <h2 className="text-[#333333] text-[26px] lg:text-[30px] font-bold mb-[5px] mt-0">Contatos da empresa</h2>
          
          
          <section>
            <h3 
              onClick={() => setContatosOpen(!contatosOpen)}
              className="text-[#333333] text-[1.17em] font-bold mt-[30px] border-b border-[#ccc] pb-[5px] cursor-pointer hover:text-orange-500 transition-colors flex justify-between"
            >
              Contatos <span>{contatosOpen ? '−' : '+'}</span>
            </h3>
            
            
            {contatosOpen && (
              <div className="mt-[15px]">
                <ul className="list-none pl-0 m-0">
                  <li className="mb-[10px] text-[#333333]"><strong>Telefone:</strong> +55 11 5084-7276</li>
                  <li className="mb-[10px] text-[#333333]"><strong>Email Presidente:</strong> turmadobem@tdb.org.br</li>
                  <li className="mb-[10px] text-[#333333]"><strong>Email Comunicação:</strong> comunicacao@tdb.org.br</li>
                  <li className="mb-[10px] text-[#333333]"><strong>Dúvidas e Sugestões:</strong> faleconosco@tdb.org.br</li>
                </ul>
                <p className="mt-[15px] text-[#333333]">
                  <strong>Formulário para contato:</strong>{' '}
                  <Link to="/formulario" className="text-orange-500 underline hover:text-orange-600 transition-colors">
                    Clique Aqui
                  </Link>
                </p>
              </div>
            )}
          </section>

          
          <section>
            <h3 
              onClick={() => setLocalizacaoOpen(!localizacaoOpen)}
              className="text-[#333333] text-[1.17em] font-bold mt-[30px] border-b border-[#ccc] pb-[5px] cursor-pointer hover:text-orange-500 transition-colors flex justify-between"
            >
              Localização <span>{localizacaoOpen ? '−' : '+'}</span>
            </h3>
            
            {localizacaoOpen && (
              <div className="mt-[15px]">
                <p className="text-[#333333] m-0 leading-relaxed">Rua Maurício Francisco Klabin, 449<br/>Vila Mariana, São Paulo - SP, 04120-020</p>
              </div>
            )}
          </section>

          
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