import React, { useState, useEffect } from 'react';
import { Calculator, Star } from 'lucide-react';

export function CalculadoraScore() {
  const [idade, setIdade] = useState(14);
  const [renda, setRenda] = useState(1);
  const [dor, setDor] = useState(15); // Forte
  const [mesmoBairro, setMesmoBairro] = useState(true);
  const [score, setScore] = useState(0);

  useEffect(() => {
    let pontos = 0;
    // Lógica do main.py
    if (idade >= 11 && idade <= 17) pontos += 40;
    else if (idade >= 18 && idade <= 21) pontos += 20;

    if (renda <= 1) pontos += 30;
    else if (renda <= 2) pontos += 15;

    pontos += dor;
    if (mesmoBairro) pontos += 10;

    setScore(pontos);
  }, [idade, renda, dor, mesmoBairro]);

  return (
    <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-xl max-w-md mx-auto">
      <div className="flex items-center gap-2 mb-6">
        <div className="p-2 bg-orange-100 rounded-lg text-[#FF8C00]">
          <Calculator size={20} />
        </div>
        <h3 className="font-bold text-gray-800">Simulador de Score TdB</h3>
      </div>

      <div className="space-y-4">
        {/* Idade */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Idade: {idade} anos</label>
          <input type="range" min="5" max="60" value={idade} onChange={(e) => setIdade(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]" />
        </div>

        {/* Renda */}
        <div>
          <label className="text-xs font-bold text-gray-400 uppercase">Renda Familiar: {renda} Salários</label>
          <input type="range" min="0" max="5" step="0.5" value={renda} onChange={(e) => setRenda(Number(e.target.value))}
            className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-[#FF8C00]" />
        </div>

        {/* Gravidade */}
        <div className="grid grid-cols-3 gap-2">
          {[
            { label: 'Leve', pts: 5 },
            { label: 'Forte', pts: 15 },
            { label: 'Urgente', pts: 20 }
          ].map((item) => (
            <button key={item.label} onClick={() => setDor(item.pts)}
              className={`py-2 rounded-xl text-xs font-bold transition-all ${dor === item.pts ? 'bg-[#FF8C00] text-white shadow-md' : 'bg-gray-50 text-gray-400 hover:bg-gray-100'}`}>
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* Resultado Final */}
      <div className="mt-8 pt-6 border-t border-dashed border-gray-100 text-center">
        <p className="text-sm font-medium text-gray-500 mb-1">Prioridade Calculada</p>
        <div className="text-5xl font-black text-[#FF8C00] mb-2">{score}</div>
        <div className="w-full bg-gray-100 h-3 rounded-full overflow-hidden">
          <div className="bg-[#FF8C00] h-full transition-all duration-500" style={{ width: `${score}%` }}></div>
        </div>
      </div>
    </div>
  );
}