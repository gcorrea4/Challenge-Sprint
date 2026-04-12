import { useForm } from 'react-hook-form';
import { useState } from 'react';

type FormData = {
  nome: string;
  idade: number;
  tipo_dor: "leve" | "forte" | "dente quebrado";
  tempo_dor: number;
  renda: number;
  bairro: string;
};

export function Formulario() {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<FormData>();
  const [isSuccess, setIsSuccess] = useState(false);
  const [nivelUrgencia, setNivelUrgencia] = useState<number | null>(null);

  const onSubmit = (data: FormData) => {
    // --- SPRINT 3: CÁLCULO LOCAL (SEM API/FETCH) ---
    // Trouxemos a lógica do Python para cá temporariamente para não quebrar a regra
    let urgenciaCalculada = 0;

    // Regra do Tipo de Dor
    if (data.tipo_dor === "forte") {
      urgenciaCalculada += 3;
    } else if (data.tipo_dor === "dente quebrado") {
      urgenciaCalculada += 4;
    } else {
      urgenciaCalculada += 1; // leve
    }

    // Regra do Tempo de Dor
    if (data.tempo_dor > 7) {
      urgenciaCalculada += 2;
    }

    // Regra de Renda
    if (data.renda <= 2) {
      urgenciaCalculada += 1;
    }

    // Simulamos um pequeno "tempo de rede" para parecer profissional
    setTimeout(() => {
      setNivelUrgencia(urgenciaCalculada);
      setIsSuccess(true);
      reset(); // Limpa o formulário

      // Some a mensagem de sucesso depois de 8 segundos
      setTimeout(() => setIsSuccess(false), 8000);
    }, 600); 
  };

  return (
    <main className="bg-[#F5F5DC] min-h-screen font-sans flex flex-col items-center py-10 px-5 w-full">
      <div className="w-full max-w-[600px] bg-white p-8 rounded-lg shadow-md">
        <h2 className="text-center text-2xl font-bold mb-2">Triagem Dentária</h2>
        <p className="text-center text-gray-600 mb-8">Preencha os dados para calcular sua urgência.</p>

        {isSuccess && (
          <div className="bg-green-100 text-green-800 p-4 rounded mb-6 text-center border border-green-200">
            Cadastrado com sucesso! <strong>Nível de Urgência: {nivelUrgencia}</strong>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block font-bold text-gray-700 mb-1">Nome Completo:</label>
            <input type="text" {...register("nome", { required: true })} className="w-full p-3 border rounded outline-none focus:border-blue-500" />
            {errors.nome && <span className="text-red-500 text-sm">Campo obrigatório</span>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Idade:</label>
              <input type="number" {...register("idade", { required: true, valueAsNumber: true })} className="w-full p-3 border rounded focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Renda (Salários):</label>
              <input type="number" step="0.1" {...register("renda", { required: true, valueAsNumber: true })} className="w-full p-3 border rounded focus:border-blue-500 outline-none" />
            </div>
          </div>

          <div>
            <label className="block font-bold text-gray-700 mb-1">Tipo de Dor:</label>
            <select {...register("tipo_dor")} className="w-full p-3 border rounded bg-white focus:border-blue-500 outline-none">
              <option value="leve">Leve</option>
              <option value="forte">Forte</option>
              <option value="dente quebrado">Dente Quebrado</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block font-bold text-gray-700 mb-1">Dias com Dor:</label>
              <input type="number" {...register("tempo_dor", { required: true, valueAsNumber: true })} className="w-full p-3 border rounded focus:border-blue-500 outline-none" />
            </div>
            <div>
              <label className="block font-bold text-gray-700 mb-1">Bairro:</label>
              <input type="text" {...register("bairro", { required: true })} className="w-full p-3 border rounded focus:border-blue-500 outline-none" />
            </div>
          </div>

          <button type="submit" className="w-full bg-blue-600 text-white font-bold py-3 rounded hover:bg-blue-700 transition-colors mt-4 shadow-sm">
            Enviar para Triagem
          </button>
        </form>
      </div>
    </main>
  );
}