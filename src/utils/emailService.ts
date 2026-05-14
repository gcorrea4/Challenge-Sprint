/**
 * Serviço de e-mail via backend Quarkus (Gmail SMTP).
 *
 * O backend expõe  POST /email/enviar  e envia via Gmail usando
 * quarkus-mailer + App Password do Google.
 *
 * Para ativar:
 *   1. No Gmail: Minha Conta > Segurança > Verificação em 2 etapas > Senhas de app
 *   2. Gere uma senha para "Correio" (16 chars sem espaços)
 *   3. No backend (application.properties ou variáveis de ambiente):
 *        GMAIL_USER=seuemail@gmail.com
 *        GMAIL_APP_PASSWORD=abcdefghijklmnop
 *        GMAIL_FROM=seuemail@gmail.com
 *   Em dev local, o Quarkus usa modo mock (nenhum e-mail real é enviado,
 *   mas aparece no console). Para envio real em dev, defina as vars acima
 *   e remova a linha  %dev.quarkus.mailer.mock=true  do application.properties.
 */

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8080';

// ─── tipos ───────────────────────────────────────────────────────────────────

export interface DadosLembrete {
  email:        string;
  nome:         string;
  procedimento: string;
  data:         string; // "YYYY-MM-DD"
  hora:         string;
  dentista:     string;
}

interface EmailPayload {
  tipo:         'confirmacao' | 'lembrete';
  para:         string;
  nome:         string;
  procedimento: string;
  data:         string; // "DD/MM/YYYY" — o backend recebe já formatado
  hora:         string;
  dentista:     string;
  diasAntes?:   number;
}

// ─── helpers ─────────────────────────────────────────────────────────────────

const chaveEnviado = (dados: DadosLembrete, diasAntes: number) =>
  `tdb_lembrete_${dados.nome}_${dados.data}_D${diasAntes}`;

const dataFormatada = (iso: string) => iso.split('-').reverse().join('/');

async function chamarBackend(payload: EmailPayload): Promise<void> {
  try {
    await fetch(`${API_URL}/email/enviar`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.warn('[Email] Backend indisponível — e-mail não enviado:', err);
  }
}

// ─── API pública ─────────────────────────────────────────────────────────────

/** Salva os dados de lembrete no localStorage quando o paciente confirma um slot. */
export function salvarDadosLembrete(dados: DadosLembrete) {
  localStorage.setItem(`tdb_emailLembrete_${dados.nome}`, JSON.stringify(dados));
}

/** Lê os dados de lembrete salvos para um paciente. */
export function lerDadosLembrete(nomePaciente: string): DadosLembrete | null {
  const raw = localStorage.getItem(`tdb_emailLembrete_${nomePaciente}`);
  return raw ? JSON.parse(raw) : null;
}

/** Retorna os 4 lembretes (D-3 … D-0) com status enviado/pendente. */
export function lembretesStatus(dados: DadosLembrete): {
  diasAntes: number;
  label: string;
  dataEnvio: string;
  enviado: boolean;
}[] {
  const consultaDate = new Date(dados.data + 'T00:00:00');

  return [3, 2, 1, 0].map(d => {
    const dataEnvio = new Date(consultaDate);
    dataEnvio.setDate(consultaDate.getDate() - d);

    const dd = String(dataEnvio.getDate()).padStart(2, '0');
    const mm = String(dataEnvio.getMonth() + 1).padStart(2, '0');

    return {
      diasAntes: d,
      label: d === 0 ? 'No dia da consulta' : `${d} dia(s) antes`,
      dataEnvio: `${dd}/${mm}/${dataEnvio.getFullYear()}`,
      enviado: !!localStorage.getItem(chaveEnviado(dados, d)),
    };
  });
}

/** Envia e-mail de confirmação imediata ao paciente (fire-and-forget). */
export function enviarConfirmacao(dados: DadosLembrete): void {
  chamarBackend({
    tipo:         'confirmacao',
    para:         dados.email,
    nome:         dados.nome,
    procedimento: dados.procedimento,
    data:         dataFormatada(dados.data),
    hora:         dados.hora,
    dentista:     dados.dentista,
  });
}

/**
 * Verifica se há lembretes pendentes para HOJE e os envia via backend.
 * Chamado no useEffect do dashboard do paciente (a cada abertura).
 */
export async function verificarEEnviarLembretes(nomePaciente: string): Promise<void> {
  const dados = lerDadosLembrete(nomePaciente);
  if (!dados) return;

  const hoje = new Date();
  hoje.setHours(0, 0, 0, 0);
  const consultaDate = new Date(dados.data + 'T00:00:00');
  const diffMs   = consultaDate.getTime() - hoje.getTime();
  const diffDias = Math.round(diffMs / (1000 * 60 * 60 * 24));

  if (![3, 2, 1, 0].includes(diffDias)) return;

  const chave = chaveEnviado(dados, diffDias);
  if (localStorage.getItem(chave)) return; // já enviado

  await chamarBackend({
    tipo:         'lembrete',
    para:         dados.email,
    nome:         dados.nome,
    procedimento: dados.procedimento,
    data:         dataFormatada(dados.data),
    hora:         dados.hora,
    dentista:     dados.dentista,
    diasAntes:    diffDias,
  });

  // Marca como enviado mesmo se o backend retornou erro
  // (evita spam em caso de falha intermitente)
  localStorage.setItem(chave, 'enviado');
  console.log(`[Email] Lembrete D-${diffDias} enviado para ${dados.email}`);
}
