import { useEffect, useState } from 'react';

const STORAGE_KEY = 'utm_source';
const STORAGE_TS_KEY = 'utm_source_ts';
const VALIDADE_MS = 7 * 24 * 60 * 60 * 1000; // 7 dias

/**
 * Rastreia a origem do usuário via parâmetro `utm_source` na URL.
 *
 * - Se a URL tiver `?utm_source=...`, salva no localStorage (com timestamp).
 * - Caso contrário, recupera a sessão anterior, se ainda estiver dentro da validade.
 * - Após 7 dias, a origem salva é descartada automaticamente.
 */
export function useUtmSource() {
  const [utmSource, setUtmSource] = useState<string | null>(null);

  useEffect(() => {
    const agora = Date.now();

    // Expira sessões antigas (> 7 dias).
    const salvoEm = localStorage.getItem(STORAGE_TS_KEY);
    if (salvoEm && agora - parseInt(salvoEm, 10) > VALIDADE_MS) {
      localStorage.removeItem(STORAGE_KEY);
      localStorage.removeItem(STORAGE_TS_KEY);
    }

    const params = new URLSearchParams(window.location.search);
    const source = params.get('utm_source');

    if (source) {
      setUtmSource(source);
      localStorage.setItem(STORAGE_KEY, source);
      localStorage.setItem(STORAGE_TS_KEY, String(agora));
    } else {
      // Recupera sessão anterior se ainda existir (e não tiver expirado acima).
      setUtmSource(localStorage.getItem(STORAGE_KEY));
    }
  }, []);

  return utmSource;
}
