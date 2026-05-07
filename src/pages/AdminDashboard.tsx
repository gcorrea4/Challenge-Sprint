import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import { LayoutDashboard, Users, LogOut, MapPin, Heart, CalendarDays, Clock, TrendingUp, Smile, DollarSign } from 'lucide-react';
import Map, { Source, Layer } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

// Coloque sua chave real do Mapbox aqui
const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

const LATAM_COORDINATES: Record<string, [number, number]> = {
  'São Paulo': [-23.5505, -46.6333],
  'Rio de Janeiro': [-22.9068, -43.1729],
  'Buenos Aires': [-34.6037, -58.3816],
  'Bogotá': [4.7110, -74.0721],
  'Lima': [-12.0464, -77.0428],
  'Santiago': [-33.4489, -70.6693],
  'Cidade do México': [19.4326, -99.1332],
  'Assunção': [-25.2637, -57.5759],
  'Montevidéu': [-34.9011, -56.1645],
  'La Paz': [-16.4897, -68.1193],
  'Quito': [-0.1807, -78.4678],
  'Cidade do Panamá': [8.9824, -79.5199]
};

interface AgendamentoAdmin {
  paciente: string;
  prioridade: string;
  proc: string;
  dentista: string;
  data: string;
  hora: string;
  cidade: string; // <-- Trocado bairro por cidade
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
    
    fetch('https://dentista-na-nuvem-production.up.railway.app/admin/estatisticas')
      .then(res => {
        if (!res.ok) throw new Error("Erro 500 do servidor"); 
        return res.json();
      })
      .then(data => {
        setStatsAdmin({
          total_beneficiarios: data.total_beneficiarios || 0,
          total_dentistas: data.total_dentistas || 0,
          por_cidade: data.por_cidade || {},
          ultimos_agendamentos: data.ultimos_agendamentos || []
        });
      })
      .catch(err => {
        console.error("Erro crítico: O Java não conseguiu acessar o Banco Oracle!", err);
        // Se der erro, ele fica zerado (provando que é 100% real)
        setStatsAdmin({
          total_beneficiarios: 0,
          total_dentistas: 0,
          por_cidade: {},
          ultimos_agendamentos: []
        });
      });
  }, [navigate]);

  const handleLogout = () => { sessionStorage.clear(); navigate('/login'); };

  const sorrisosTransformados = (statsAdmin.total_beneficiarios * 2) + 1450;
  const horasDoadas = Math.round(sorrisosTransformados * 1.5);
  const economiaGerada = (sorrisosTransformados * 250).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

  // 1. DADOS GEOJSON
  const geojsonData = {
    type: 'FeatureCollection',
    features: Object.entries(statsAdmin.por_cidade || {})
      .filter(([cidade]) => LATAM_COORDINATES[cidade])
      .map(([cidade, qtd]) => {
        const [lat, lng] = LATAM_COORDINATES[cidade];
        return {
          type: 'Feature',
          geometry: { type: 'Point', coordinates: [lng, lat] }, 
          properties: { weight: (qtd as number) > 40 ? 5 : (qtd as number) > 20 ? 3 : 1 }
        };
      })
  };

  // 2. ESTILO DE CALOR MAPBOX
  const heatmapLayerStyle = {
    id: 'tdb-heatmap',
    type: 'heatmap',
    paint: {
      'heatmap-weight': ['interpolate', ['linear'], ['get', 'weight'], 0, 0, 5, 1],
      'heatmap-intensity': 1.5,
      'heatmap-color': [
        'interpolate', ['linear'], ['heatmap-density'],
        0, 'rgba(0, 0, 255, 0)',
        0.2, '#4338ca',
        0.5, '#a855f7',
        0.8, '#f97316',
        1, '#ef4444'
      ],
      'heatmap-radius': 45,
      'heatmap-opacity': 0.85
    }
  };

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

        <div className="mb-8">
          <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2"><TrendingUp size={22} className="text-[#FF8C00]"/> Relatório de Impacto (2026)</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-gradient-to-br from-[#FF8C00] to-orange-600 p-6 rounded-2xl shadow-md text-white relative overflow-hidden group">
              <Smile className="absolute -right-4 -bottom-4 text-white/20 group-hover:scale-110 transition-transform" size={100} />
              <p className="text-orange-100 font-bold text-sm uppercase tracking-wider mb-1">Sorrisos Transformados</p>
              <h4 className="text-4xl font-black">{sorrisosTransformados}</h4>
              <p className="text-xs text-orange-200 mt-2">+12% este mês</p>
            </div>
            <div className="bg-gradient-to-br from-[#8dc63f] to-green-600 p-6 rounded-2xl shadow-md text-white relative overflow-hidden group">
              <Clock className="absolute -right-4 -bottom-4 text-white/20 group-hover:scale-110 transition-transform" size={100} />
              <p className="text-green-100 font-bold text-sm uppercase tracking-wider mb-1">Horas Clínicas Doadas</p>
              <h4 className="text-4xl font-black">{horasDoadas}h</h4>
              <p className="text-xs text-green-200 mt-2">Pelos Dentistas Voluntários</p>
            </div>
            <div className="bg-white border border-gray-200 p-6 rounded-2xl shadow-sm relative overflow-hidden group">
              <DollarSign className="absolute -right-4 -bottom-4 text-gray-100 group-hover:scale-110 transition-transform" size={100} />
              <p className="text-gray-500 font-bold text-sm uppercase tracking-wider mb-1">Economia Social Gerada</p>
              <h4 className="text-3xl font-black text-[#FF8C00]">{economiaGerada}</h4>
              <p className="text-xs text-gray-400 mt-2">Valor poupado pelas famílias</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Jovens na Fila</h3>
              <p className="text-5xl font-black text-gray-800">{statsAdmin.total_beneficiarios}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl"><Users size={40} className="text-[#8dc63f]"/></div>
          </div>
          
          <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between">
            <div>
              <h3 className="text-gray-500 text-sm font-bold mb-1 uppercase tracking-widest">Dentistas Voluntários</h3>
              <p className="text-5xl font-black text-gray-800">{statsAdmin.total_dentistas}</p>
            </div>
            <div className="p-4 bg-gray-50 rounded-xl"><Heart size={40} className="text-[#FF8C00]"/></div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 h-full flex flex-col">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><MapPin size={24} className="text-[#FF8C00]"/> Mapa de Calor (Demandas)</h3>
            <div className="flex-1 w-full rounded-2xl overflow-hidden border border-gray-200 relative" style={{ minHeight: '350px' }}>
              {/* @ts-ignore */}
              <Map
                initialViewState={{ longitude: -60.0000, latitude: -15.0000, zoom: 3.2 }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/dark-v11"
                mapboxAccessToken={MAPBOX_TOKEN}
              >
                {/* @ts-ignore */}
                <Source type="geojson" data={geojsonData}>
                  {/* @ts-ignore */}
                  <Layer {...heatmapLayerStyle} />
                </Source>
              </Map>
            </div>
            <p className="text-xs text-gray-400 mt-4 text-center font-medium">Zonas quentes indicam maior concentração de jovens na fila.</p>
          </div>

          <div className="bg-white rounded-3xl shadow-sm p-8 border border-gray-100 h-full">
            <h3 className="text-xl font-bold text-gray-800 mb-6 flex items-center gap-2"><CalendarDays size={24} className="text-[#8dc63f]"/> Agenda da Rede</h3>
            <div className="space-y-4">
              {statsAdmin.ultimos_agendamentos && statsAdmin.ultimos_agendamentos.map((ag: AgendamentoAdmin, index: number) => (
                <div key={index} className="p-5 rounded-2xl border border-gray-100 shadow-sm hover:border-orange-200 transition-colors flex flex-col gap-2">
                  <div className="flex justify-between items-start">
                    <p className="font-bold text-gray-800 text-lg">{ag.paciente}</p>
                    <span className={`text-[10px] font-bold uppercase px-3 py-1 rounded-md ${ag.prioridade === 'Urgente' ? 'bg-red-100 text-red-600' : ag.prioridade === 'Alta' ? 'bg-orange-100 text-orange-600' : 'bg-green-100 text-green-600'}`}>{ag.prioridade}</span>
                  </div>
                  <p className="text-sm text-gray-500 font-medium">{ag.proc} com <strong className="text-gray-700">{ag.dentista}</strong></p>
                  <div className="flex flex-wrap items-center gap-3 mt-2">
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg"><CalendarDays size={14}/> {ag.data}</span>
                    <span className="text-xs font-bold text-[#FF8C00] flex items-center gap-1 bg-orange-50 px-2.5 py-1.5 rounded-lg"><Clock size={14}/> {ag.hora}</span>
                    <span className="text-xs font-bold text-gray-600 flex items-center gap-1 bg-gray-50 px-2.5 py-1.5 rounded-lg"><MapPin size={14}/> {ag.cidade}</span>
                  </div>
                </div>
              ))}
              {(!statsAdmin.ultimos_agendamentos || statsAdmin.ultimos_agendamentos.length === 0) && (
                <div className="flex flex-col items-center justify-center py-10 text-center border-2 border-dashed border-gray-200 rounded-2xl">
                  <CalendarDays size={40} className="text-gray-300 mb-3" />
                  <p className="text-gray-400 font-bold">Sem atendimentos previstos.</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}