import { useState, useEffect, useRef, useCallback } from 'react';
import Map, { Source, Layer, Marker, NavigationControl } from 'react-map-gl';
import 'mapbox-gl/dist/mapbox-gl.css';
import { X, Navigation, Car, Footprints, ExternalLink, AlertCircle, ArrowRight } from 'lucide-react';

const MAPBOX_TOKEN = import.meta.env.VITE_MAPBOX_TOKEN;

type Modo = 'driving-traffic' | 'walking';

interface RouteInfo {
  distancia: string;
  duracao: string;
  instrucaoAtual: string;
  geometry: { type: 'LineString'; coordinates: number[][] };
}

interface Props {
  dentistaCidade: string;
  dentistaNome: string;
  data: string;
  hora: string;
  onClose: () => void;
}

type Status = 'localizando' | 'geocodificando' | 'calculando' | 'pronto' | 'erro';

const STATUS_LABEL: Record<Status, string> = {
  localizando: 'Obtendo sua localização…',
  geocodificando: 'Localizando o destino…',
  calculando: 'Calculando a melhor rota…',
  pronto: '',
  erro: '',
};

/** Distância entre dois pontos [lng, lat] em metros (Haversine) */
function haversine(a: [number, number], b: [number, number]): number {
  const R = 6_371_000;
  const dLat = ((b[1] - a[1]) * Math.PI) / 180;
  const dLng = ((b[0] - a[0]) * Math.PI) / 180;
  const x =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((a[1] * Math.PI) / 180) *
      Math.cos((b[1] * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function formatarDistancia(metros: number): string {
  return metros < 1000
    ? `${Math.round(metros)} m`
    : `${(metros / 1000).toFixed(1)} km`;
}

function formatarDuracao(segundos: number): string {
  if (segundos < 60) return `${Math.round(segundos)} seg`;
  if (segundos < 3600) return `${Math.round(segundos / 60)} min`;
  const h = Math.floor(segundos / 3600);
  const m = Math.round((segundos % 3600) / 60);
  return m > 0 ? `${h}h ${m}min` : `${h}h`;
}

export function MapaRota({ dentistaCidade, dentistaNome, data, hora, onClose }: Props) {
  const [status, setStatus] = useState<Status>('localizando');
  const [erroMsg, setErroMsg] = useState('');
  const [userLocation, setUserLocation] = useState<[number, number] | null>(null);
  const [destLocation, setDestLocation] = useState<[number, number] | null>(null);
  const [routeInfo, setRouteInfo] = useState<RouteInfo | null>(null);
  const [modo, setModo] = useState<Modo>('driving-traffic');
  const [viewState, setViewState] = useState({
    longitude: -46.6333,
    latitude: -23.5505,
    zoom: 11,
  });

  const watchIdRef = useRef<number | null>(null);
  const lastUserLocRef = useRef<[number, number] | null>(null);
  const destRef = useRef<[number, number] | null>(null);
  const modoRef = useRef<Modo>('driving-traffic');

  // Sincroniza modoRef com estado
  useEffect(() => { modoRef.current = modo; }, [modo]);

  // ── Geocoding ──────────────────────────────────────────────────────────────
  const geocodeCidade = useCallback(async (cidade: string): Promise<[number, number]> => {
    const query = encodeURIComponent(cidade);
    const url =
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json` +
      `?types=place,locality,district&limit=1&language=pt&access_token=${MAPBOX_TOKEN}`;
    const res = await fetch(url);
    if (!res.ok) throw new Error('Geocoding falhou');
    const json = await res.json();
    if (!json.features?.length) throw new Error('Cidade não encontrada');
    return json.features[0].center as [number, number]; // [lng, lat]
  }, []);

  // ── Directions ─────────────────────────────────────────────────────────────
  const buscarRota = useCallback(
    async (
      origin: [number, number],
      dest: [number, number],
      modoBusca: Modo,
    ): Promise<RouteInfo> => {
      const coords = `${origin[0]},${origin[1]};${dest[0]},${dest[1]}`;
      const url =
        `https://api.mapbox.com/directions/v5/mapbox/${modoBusca}/${coords}` +
        `?geometries=geojson&steps=true&language=pt&overview=full&access_token=${MAPBOX_TOKEN}`;
      const res = await fetch(url);
      if (!res.ok) throw new Error('Directions falhou');
      const json = await res.json();
      if (!json.routes?.length) throw new Error('Sem rota disponível');
      const route = json.routes[0];
      const step = route.legs?.[0]?.steps?.[0]?.maneuver?.instruction ?? 'Siga em frente';
      return {
        distancia: formatarDistancia(route.distance),
        duracao: formatarDuracao(route.duration),
        instrucaoAtual: step,
        geometry: route.geometry,
      };
    },
    [],
  );

  // ── Inicialização: pega GPS → geocoda destino → calcula rota ───────────────
  useEffect(() => {
    if (!navigator.geolocation) {
      setStatus('erro');
      setErroMsg('Geolocalização não suportada neste dispositivo.');
      return;
    }

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        const userLoc: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(userLoc);
        lastUserLocRef.current = userLoc;
        setStatus('geocodificando');

        try {
          const dest = await geocodeCidade(dentistaCidade);
          destRef.current = dest;
          setDestLocation(dest);
          setStatus('calculando');

          // Centraliza o mapa entre os dois pontos
          setViewState({
            longitude: (userLoc[0] + dest[0]) / 2,
            latitude: (userLoc[1] + dest[1]) / 2,
            zoom: 9,
          });

          const info = await buscarRota(userLoc, dest, modoRef.current);
          setRouteInfo(info);
          setStatus('pronto');
        } catch {
          setStatus('erro');
          setErroMsg('Não foi possível calcular a rota. Verifique sua conexão e tente novamente.');
        }
      },
      () => {
        setStatus('erro');
        setErroMsg('Permissão de localização negada. Ative o GPS no seu dispositivo e tente novamente.');
      },
      { enableHighAccuracy: true, timeout: 15_000 },
    );

    // Rastreamento em tempo real
    watchIdRef.current = navigator.geolocation.watchPosition(
      (pos) => {
        const newLoc: [number, number] = [pos.coords.longitude, pos.coords.latitude];
        setUserLocation(newLoc);

        // Só recalcula se o usuário se moveu mais de 30 m
        if (
          lastUserLocRef.current &&
          destRef.current &&
          haversine(lastUserLocRef.current, newLoc) > 30
        ) {
          lastUserLocRef.current = newLoc;
          buscarRota(newLoc, destRef.current, modoRef.current)
            .then(setRouteInfo)
            .catch(() => {});
        }
      },
      undefined,
      { enableHighAccuracy: true, maximumAge: 3_000 },
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Recalcula rota ao trocar modo de transporte ────────────────────────────
  useEffect(() => {
    if (!userLocation || !destLocation || status !== 'pronto') return;
    setStatus('calculando');
    buscarRota(userLocation, destLocation, modo)
      .then((info) => { setRouteInfo(info); setStatus('pronto'); })
      .catch(() => setStatus('pronto'));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [modo]);

  // ── GeoJSON da rota ────────────────────────────────────────────────────────
  const routeGeoJSON = routeInfo
    ? { type: 'Feature' as const, properties: {}, geometry: routeInfo.geometry }
    : null;

  // ── Links externos ─────────────────────────────────────────────────────────
  const wazeUrl = destLocation
    ? `https://waze.com/ul?ll=${destLocation[1]},${destLocation[0]}&navigate=yes`
    : '#';
  const gmapsUrl = destLocation
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(dentistaCidade)}&travelmode=${modo === 'walking' ? 'walking' : 'driving'}`
    : '#';

  const isLoading = status === 'localizando' || status === 'geocodificando' || status === 'calculando';

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-gray-950">
      {/* ── Mapa ── */}
      <div className="flex-1 relative">
        {/* @ts-ignore */}
        <Map
          {...viewState}
          onMove={(e) => setViewState(e.viewState)}
          style={{ width: '100%', height: '100%' }}
          mapStyle="mapbox://styles/mapbox/navigation-night-v1"
          mapboxAccessToken={MAPBOX_TOKEN}
        >
          {/* Glow da rota */}
          {routeGeoJSON && (
            <Source id="route-glow" type="geojson" data={routeGeoJSON}>
              {/* @ts-ignore */}
              <Layer
                id="route-glow-layer"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{ 'line-color': '#FF8C00', 'line-width': 18, 'line-opacity': 0.2 }}
              />
            </Source>
          )}

          {/* Linha da rota */}
          {routeGeoJSON && (
            <Source id="route" type="geojson" data={routeGeoJSON}>
              {/* @ts-ignore */}
              <Layer
                id="route-layer"
                type="line"
                layout={{ 'line-join': 'round', 'line-cap': 'round' }}
                paint={{ 'line-color': '#FF8C00', 'line-width': 6, 'line-opacity': 1 }}
              />
            </Source>
          )}

          {/* Marcador do usuário — ponto azul animado */}
          {userLocation && (
            <Marker longitude={userLocation[0]} latitude={userLocation[1]} anchor="center">
              <div className="relative flex items-center justify-center">
                <div className="absolute w-10 h-10 bg-blue-400 rounded-full opacity-30 animate-ping" />
                <div className="absolute w-6 h-6 bg-blue-400 rounded-full opacity-50" />
                <div className="w-4 h-4 bg-blue-500 rounded-full border-2 border-white shadow-lg relative z-10" />
              </div>
            </Marker>
          )}

          {/* Marcador do destino */}
          {destLocation && (
            <Marker longitude={destLocation[0]} latitude={destLocation[1]} anchor="bottom">
              <div className="flex flex-col items-center drop-shadow-lg">
                <div className="bg-[#FF8C00] text-white rounded-xl px-3 py-1.5 text-xs font-bold shadow-lg whitespace-nowrap border border-orange-400/50">
                  🦷 {dentistaCidade}
                </div>
                <div className="w-2.5 h-2.5 bg-[#FF8C00] rotate-45 -mt-1.5 shadow-sm" />
              </div>
            </Marker>
          )}

          {/* @ts-ignore */}
          <NavigationControl position="bottom-right" style={{ marginBottom: '200px' }} />
        </Map>

        {/* ── Header flutuante ── */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-start justify-between pointer-events-none">
          <div
            className="bg-gray-900/80 backdrop-blur-md rounded-2xl px-4 py-3 border border-white/10 shadow-2xl pointer-events-auto"
            style={{ maxWidth: 'calc(100% - 60px)' }}
          >
            <div className="flex items-center gap-2 mb-0.5">
              <Navigation size={14} className="text-[#FF8C00] flex-shrink-0" />
              <span className="text-white font-bold text-sm leading-tight">Rota para a Consulta</span>
            </div>
            <p className="text-white/60 text-xs">
              Dr(a). {dentistaNome} · {data.split('-').reverse().join('/')} às {hora}
            </p>
          </div>

          <button
            onClick={onClose}
            className="bg-gray-900/80 backdrop-blur-md hover:bg-gray-800 border border-white/10 rounded-full p-2.5 text-white transition-colors shadow-2xl pointer-events-auto"
          >
            <X size={18} />
          </button>
        </div>

        {/* ── Overlay de carregamento ── */}
        {isLoading && (
          <div className="absolute inset-0 bg-gray-950/60 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-gray-900 border border-white/10 rounded-3xl p-7 flex flex-col items-center gap-4 shadow-2xl mx-6 w-full max-w-xs">
              <div className="w-12 h-12 border-4 border-[#FF8C00] border-t-transparent rounded-full animate-spin" />
              <div className="text-center">
                <p className="text-white font-bold text-sm">{STATUS_LABEL[status]}</p>
                <p className="text-white/40 text-xs mt-1">Usando Mapbox Directions API</p>
              </div>
            </div>
          </div>
        )}

        {/* ── Overlay de erro ── */}
        {status === 'erro' && (
          <div className="absolute inset-0 bg-gray-950/80 backdrop-blur-sm flex items-center justify-center z-20">
            <div className="bg-gray-900 border border-red-500/30 rounded-3xl p-7 flex flex-col items-center gap-4 shadow-2xl mx-6 w-full max-w-xs text-center">
              <div className="w-14 h-14 bg-red-500/10 rounded-full flex items-center justify-center">
                <AlertCircle size={28} className="text-red-400" />
              </div>
              <div>
                <p className="text-white font-bold">Ops!</p>
                <p className="text-white/60 text-sm mt-1">{erroMsg}</p>
              </div>
              <button
                onClick={onClose}
                className="w-full bg-white/10 hover:bg-white/20 text-white font-bold py-3 rounded-xl text-sm transition-colors border border-white/10"
              >
                Fechar
              </button>
            </div>
          </div>
        )}
      </div>

      {/* ── Painel inferior ── */}
      {status === 'pronto' && routeInfo && (
        <div className="bg-gray-900 border-t border-white/10 rounded-t-3xl px-5 pt-5 pb-6 shadow-2xl">
          {/* Stats da rota */}
          <div className="flex items-center gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-baseline gap-2">
                <span className="text-white font-black text-3xl">{routeInfo.duracao}</span>
              </div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <div className="w-2 h-2 bg-[#FF8C00] rounded-full" />
                <span className="text-white/50 text-sm">{routeInfo.distancia} até {dentistaCidade}</span>
              </div>
            </div>

            {/* Toggle modo */}
            <div className="flex bg-white/10 rounded-xl p-1 gap-1">
              <button
                onClick={() => setModo('driving-traffic')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  modo === 'driving-traffic'
                    ? 'bg-[#FF8C00] text-white shadow-md'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Car size={13} /> Carro
              </button>
              <button
                onClick={() => setModo('walking')}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-bold transition-all ${
                  modo === 'walking'
                    ? 'bg-[#FF8C00] text-white shadow-md'
                    : 'text-white/50 hover:text-white/80'
                }`}
              >
                <Footprints size={13} /> A Pé
              </button>
            </div>
          </div>

          {/* Próxima instrução */}
          <div className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 mb-4 flex items-center gap-3">
            <div className="w-8 h-8 bg-[#FF8C00]/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <ArrowRight size={16} className="text-[#FF8C00]" />
            </div>
            <p className="text-white/90 text-sm font-medium leading-snug">{routeInfo.instrucaoAtual}</p>
          </div>

          {/* Links externos */}
          <div className="grid grid-cols-2 gap-3">
            <a
              href={wazeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-sky-600 hover:bg-sky-500 active:bg-sky-700 text-white font-bold py-3.5 rounded-xl text-sm transition-colors shadow-md"
            >
              <ExternalLink size={14} /> Abrir no Waze
            </a>
            <a
              href={gmapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 active:bg-white/5 text-white font-bold py-3.5 rounded-xl text-sm transition-colors border border-white/10"
            >
              <ExternalLink size={14} /> Google Maps
            </a>
          </div>

          <p className="text-white/20 text-[10px] text-center mt-3">
            Localização atualizada em tempo real · Rota via Mapbox Directions API
          </p>
        </div>
      )}
    </div>
  );
}
