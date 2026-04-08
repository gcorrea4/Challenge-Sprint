export function QuemSomos() {
  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans text-center py-[40px] px-[20px] md:py-[60px] md:px-[5%]">
      
      
      <h2 className="text-[#333333] text-[2.5rem] font-bold mt-0 mb-0">Nossa Equipe</h2>
      <p className="text-[#555555] text-[18px] mt-[15px] mb-[60px] max-sm:mb-[30px]">
        Nosso time de desenvolvedores para o Challenge
      </p>

      
      <div className="flex flex-wrap justify-center gap-[40px] xl:gap-[30px] lg:gap-[25px]">

       
       
        <article className="group bg-white border border-[#e0e0e0] rounded-[10px] shadow-[0_64px_128px_rgba(0,0,0,0.05)] w-[300px] p-[30px] max-lg:w-[280px] max-md:w-[80%] max-md:max-w-[300px] max-sm:w-[90%] max-sm:p-[20px] transition-all duration-[1000ms] hover:-translate-y-[5px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
          <img 
            src="/src/img/foto-correa.jpg" 
            alt="Gabriel Correa" 
            className="w-[150px] h-[150px] rounded-full object-cover mb-[20px] border-[3px] border-[#eee] mx-auto"
          />
          <h3 className="text-[22px] m-0 font-bold text-[#333333] transition-colors duration-[1000ms] group-hover:text-orange-500">Gabriel Correa</h3>
          <p className="text-[#777] mb-[20px] mt-[10px]"><strong>RM:</strong> 567903 &nbsp;<strong>Turma:</strong> 1TDSPB</p>
          <div>
            <a href="https://github.com/gcorrea4" target="_blank" rel="noreferrer" className="font-bold mx-[10px] text-[#333333] transition-colors duration-500 hover:text-orange-500">GitHub</a>
            <a href="https://www.linkedin.com/in/gabriel-correa-souza-763135271/" target="_blank" rel="noreferrer" className="font-bold mx-[10px] text-[#333333] transition-colors duration-500 hover:text-orange-500">LinkedIn</a>
          </div>
        </article>

        
        <article className="group bg-white border border-[#e0e0e0] rounded-[10px] shadow-[0_64px_128px_rgba(0,0,0,0.05)] w-[300px] p-[30px] max-lg:w-[280px] max-md:w-[80%] max-md:max-w-[300px] max-sm:w-[90%] max-sm:p-[20px] transition-all duration-[1000ms] hover:-translate-y-[5px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
          <img 
            src="/src/img/foto-kay.jpg" 
            alt="Kayque" 
            className="w-[150px] h-[150px] rounded-full object-cover mb-[20px] border-[3px] border-[#eee] mx-auto"
          />
          <h3 className="text-[22px] m-0 font-bold text-[#333333] transition-colors duration-[1000ms] group-hover:text-orange-500">Kayque Duarte</h3>
          <p className="text-[#777] mb-[20px] mt-[10px]"><strong>RM:</strong> 567980 &nbsp;<strong>Turma:</strong> 1TDSPB</p>
          <div>
            <a href="https://github.com/Kayque2012" target="_blank" rel="noreferrer" className="font-bold mx-[10px] text-[#333333] transition-colors duration-500 hover:text-orange-500">GitHub</a>
            <a href="https://www.linkedin.com/in/kayque-duarte-b24313361" target="_blank" rel="noreferrer" className="font-bold mx-[10px] text-[#333333] transition-colors duration-500 hover:text-orange-500">LinkedIn</a>
          </div>
        </article>

        
        <article className="group bg-white border border-[#e0e0e0] rounded-[10px] shadow-[0_64px_128px_rgba(0,0,0,0.05)] w-[300px] p-[30px] max-lg:w-[280px] max-md:w-[80%] max-md:max-w-[300px] max-sm:w-[90%] max-sm:p-[20px] transition-all duration-[1000ms] hover:-translate-y-[5px] hover:shadow-[0_8px_16px_rgba(0,0,0,0.1)]">
          <img 
            src="/src/img/foto-eric.jpg" 
            alt="Eric Maciel" 
            className="w-[150px] h-[150px] rounded-full object-cover mb-[20px] border-[3px] border-[#eee] mx-auto"
          />
          <h3 className="text-[22px] m-0 font-bold text-[#333333] transition-colors duration-[1000ms] group-hover:text-orange-500">Eric Maciel</h3>
          <p className="text-[#777] mb-[20px] mt-[10px]"><strong>RM:</strong> 567398 &nbsp;<strong>Turma:</strong> 1TDSPB</p>
          <div>
            <a href="https://github.com/Eric-devops-tech" target="_blank" rel="noreferrer" className="font-bold mx-[10px] text-[#333333] transition-colors duration-500 hover:text-orange-500">GitHub</a>
            <a href="https://www.linkedin.com/in/eric-maciel-144058389" target="_blank" rel="noreferrer" className="font-bold mx-[10px] text-[#333333] transition-colors duration-500 hover:text-orange-500">LinkedIn</a>
          </div>
        </article>

      </div>
    </main>
  );
}