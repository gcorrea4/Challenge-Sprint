import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import { useUtmSource } from '../hooks/useUtmSource';

function setSearch(search: string) {
  window.history.replaceState({}, '', `/contato${search}`);
}

describe('useUtmSource', () => {
  beforeEach(() => {
    localStorage.clear();
    setSearch('');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('lê o utm_source da URL e persiste no localStorage', () => {
    setSearch('?utm_source=telegram');
    const { result } = renderHook(() => useUtmSource());

    expect(result.current).toBe('telegram');
    expect(localStorage.getItem('utm_source')).toBe('telegram');
    expect(localStorage.getItem('utm_source_ts')).not.toBeNull();
  });

  it('recupera a sessão anterior quando não há utm_source na URL', () => {
    localStorage.setItem('utm_source', 'instagram');
    localStorage.setItem('utm_source_ts', String(Date.now()));

    const { result } = renderHook(() => useUtmSource());

    expect(result.current).toBe('instagram');
  });

  it('retorna null quando não há utm_source na URL nem no storage', () => {
    const { result } = renderHook(() => useUtmSource());
    expect(result.current).toBeNull();
  });

  it('descarta a origem salva após 7 dias', () => {
    const oitoDiasAtras = Date.now() - 8 * 24 * 60 * 60 * 1000;
    localStorage.setItem('utm_source', 'instagram');
    localStorage.setItem('utm_source_ts', String(oitoDiasAtras));

    const { result } = renderHook(() => useUtmSource());

    expect(result.current).toBeNull();
    expect(localStorage.getItem('utm_source')).toBeNull();
    expect(localStorage.getItem('utm_source_ts')).toBeNull();
  });
});
