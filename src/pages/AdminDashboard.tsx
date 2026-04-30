import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, LogOut, MapPin, Heart, CalendarDays, Clock } from 'lucide-react';
// Importing Map components
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet.heat';

// Define approximate coordinates for major São Paulo neighborhoods
// In a real scenario, your API would return latitude/longitude, but we can map them here for the prototype
// Define as coordenadas baseadas nas novas regiões de periferia/vulnerabilidade
const SP_COORDINATES: Record<string, [number, number]> = {
  'Itaquera': [-23.5375, -46.4566],
  'Capão Redondo': [-23.6693, -46.7744],
  'Brasilândia': [-23.4568, -46.6853],
  'Heliópolis': [-23.6145, -46.5941],
  'Paraisópolis': [-23.6163, -46.7281],
  'Osasco': [-23.5329, -46.7917],
  'Centro': [-23.5489, -46.6388],
};
// Component to handle the heatmap layer
function HeatmapLayer({ data }: { data: Record<string, number> }) {
  const map = useMap();

  useEffect(() => {
    // Convert your API neighborhood data into Leaflet heat points
    const heatPoints = Object.entries(data)
      .filter(([bairro]) => SP_COORDINATES[bairro]) // Only use known coordinates
      .map(([bairro, qtd]) => {
        const [lat, lng] = SP_COORDINATES[bairro];
        // 1. TIREI a multiplicação (* 5) para não explodir a intensidade
        return [lat, lng, qtd]; 
      });

    if (heatPoints.length > 0) {
      // @ts-ignore - leaflet.heat types are sometimes tricky, ignore for prototype
      const heat = L.heatLayer(heatPoints, {
        radius: 25,       // 2. DIMINUÍ O RAIO das bolas (antes era 40)
        blur: 18,         // 3. AJUSTEI O BLUR para a borda ficar mais suave
        maxZoom: 12,
        max: 5,           // 4. LIMITE MÁXIMO: Diz que 5 pacientes já é o "vermelho máximo"
        gradient: { 0.4: 'blue', 0.6: 'cyan', 0.7: 'lime', 0.8: 'yellow', 1.0: 'red' }
      }).addTo(map);

      return () => {
        map.removeLayer(heat);
      };
    }
  }, [map, data]);

  return null;
}

interface AgendamentoAdmin {
  paciente: string;
  prioridade: string;
  proc: string;
  dentista: string;
  data: string;
  hora: string;
  bairro: string;
}

export function AdminDashboard() {
  const navigate = useNavigate();
  const usuarioLogado = sessionStorage.getItem("usuarioLogado") || "Admin";
  
  const [statsAdmin, setStatsAdmin] = useState({
    total_beneficiarios: 0, 
    total_dentistas: 0, 
    por_cidade: {} as Record<string, number>, 
    ultimos_agendamentos: [] as AgendamentoAdmin[]
  });

  useEffect(() => {
    if (!sessionStorage.getItem("usuarioLogado") || (sessionStorage.getItem("userRole") !== "admin" && sessionStorage.getItem("userRole") !== "dev")) {
      navigate('/login');
      return;
    }
    fetch('http://127.0.0.1:8000/admin/estatisticas')
      .then(res => res.json())
      .then(data => setStatsAdmin(data))
      .catch(err => console.error("Erro stats:", err));
  }, [navigate]);

  const handleLogout = () => { sessionStorage.clear(); navigate('/login'); };

  const renderSidebar = () => (
    <aside className="w-[260px] min-w-[260px] bg-white border-r border-gray-200 hidden md:flex flex-col sticky top-[65px] self-start h-[calc(100vh-65px)] z-10 shadow-sm">
      <div className="p-6 border-b border-gray-100 flex items-center gap-3">
        <div className="w-12 h-12 rounded-full bg-[#FFF3E0] text-[#FF8C00] flex items-center justify-center font-bold text-xl border-2 border-[#FF8C00]">
          {usuarioLogado.charAt(0).toUpperCase()}
        </div>
        <div><p className="text-sm font-bold text-gray-800 truncate w-[160px]">{usuarioLogado}</p><p className="text-[0.7rem] uppercase tracking-wider text-[#FF8C00] font-bold">Administrador</p></div>
      </div>
      <nav className="p-4 space-y-2 flex-1 overflow-y-auto">
        <button className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold bg-[#FF8C00] text-white shadow-md"><LayoutDashboard size={20} /> Visão Geral</button>
      </nav>
      <div className="p-4 border-t border-gray-100"><button onClick={handleLogout} className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-sm font-bold text-gray-500 hover:text-red-600"><LogOut size={20} /> Sair</button></div>
    </aside>
  );

  return (
    <div className="flex min-h-screen bg-[#F5F5DC] font-sans pt-[65px] items-start">
      {renderSidebar()}
      <main className="flex-1 p-6 md:p-8 max-w-[1400px] mx-auto w-full animate-fade-in">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-800">Painel Administrativo</h2>
          <p className="text-gray-500 mt-1">Visão geral da operação global da Turma do Bem.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Users size={100} className="text-[#8dc63f]"/></div>
            <div className="relative z-10">
              <h3 className="text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest">Jovens na Fila (Beneficiários)</h3>
              <p className="text-6xl font-black text-gray-800">{statsAdmin.total_beneficiarios}</p>
            </div>
          </div>
          
          <div className="bg-white p-8 rounded-3xl border border-gray-100 shadow-sm relative overflow-hidden group hover:shadow-md transition-shadow">
            <div className="absolute top-0 right-0 p-6 opacity-10 group-hover:scale-110 transition-transform"><Heart size={100} className="text-[#FF8C00]"/></div>
            <div className="relative z-10">
              <h3 className="text-gray-500 text-sm font-bold mb-2 uppercase tracking-widest">Dentistas Voluntários</h3>
              <p className="text-6xl font-black text-gray-800">{statsAdmin.total_dentistas}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          
          {/* NEW HEATMAP SECTION */}
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><MapPin size={24} className="text-[#FF8C00]"/> Mapa de Calor (Demandas)</h3>
            <div className="flex-1 w-full rounded-2xl overflow-hidden border border-gray-200" style={{ minHeight: '350px' }}>
              <MapContainer 
                center={[-23.5505, -46.6333]} // Center of São Paulo
                zoom={11} 
                style={{ height: '100%', width: '100%', zIndex: 0 }}
              >
                <TileLayer
                  url="https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png"
                  attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>'
                />
                {/* Render the Heatmap layer using the data from your API */}
                <HeatmapLayer data={statsAdmin.por_cidade} />
              </MapContainer>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center font-medium">As zonas mais vermelhas indicam maior concentração de jovens na fila de espera.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><CalendarDays size={24} className="text-[#8dc63f]"/> Agenda da Rede (Global)</h3>
            <div className="space-y-4">
              {statsAdmin.ultimos_agendamentos && statsAdmin.ultimos_agendamentos.map((ag: AgendamentoAdmin, index: number) => (
                <div key={index} className="p-5 rounded-2xl border border-gray-100 shadow-[0_2px_8px_rgba(0,0,0,0.02)] hover:border-orange-200 transition-colors flex flex-col gap-2 relative">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-800 text-lg">{ag.paciente}</p>
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-md ${ag.prioridade === 'Urgente' ? 'bg-red-100 text-red-600' : ag.prioridade === 'Alta' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>
                      {ag.prioridade}
                    </span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{ag.proc} com <strong className="text-gray-700">{ag.dentista}</strong></p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg"><CalendarDays size={14}/> {ag.data}</span>
                    <span className="text-xs font-bold text-[#FF8C00] flex items-center gap-1 bg-orange-50 px-2.5 py-1.5 rounded-lg"><Clock size={14}/> {ag.hora}</span>
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg"><MapPin size={14}/> {ag.bairro}</span>
                  </div>
                </div>
              ))}
              
              {(!statsAdmin.ultimos_agendamentos || statsAdmin.ultimos_agendamentos.length === 0) && (
                <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                  <CalendarDays size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-400 font-bold">Sem atendimentos previstos.</p>
                  <p className="text-gray-400 text-sm">Os dentistas voluntários ainda não agendaram consultas.</p>
                </div>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}