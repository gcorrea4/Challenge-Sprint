# 🦷 Painel de Triagem - Turma do Bem (Front-End)

Este é o protótipo Front-End desenvolvido para o Challenge da ONG **Turma do Bem** (FIAP). O projeto visa otimizar a triagem e o atendimento de jovens em situação de vulnerabilidade social, conectando-os a dentistas voluntários através de uma plataforma web inteligente, rápida e acessível.

---

## 🔗 Dependência da API (Back-End)

> ⚠️ **Atenção:** Este projeto é o Front-End e depende da execução da API (Python) para carregar os dados dos pacientes, executar o algoritmo de Match e acessar o Assistente de IA. **Certifique-se de que o servidor Python está rodando antes de acessar as funcionalidades.**

**Repositório do Back-End:** [https://github.com/gcorrea4/Back-End--Challenge-Sprint-](https://github.com/gcorrea4/Back-End--Challenge-Sprint-)

---

## 💻 Tecnologias Utilizadas

- **React.js** com **Vite** — Alta performance e build ultrarrápido
- **TypeScript** — Tipagem estática e segurança no código
- **Tailwind CSS** — Estilização e responsividade total
- **React Router Dom** — Navegação SPA fluida
- **React Hook Form** — Validação avançada de formulários

---

## ✨ Funcionalidades Implementadas

- **Layout 100% Responsivo:** Adaptado para Mobile, Tablet e Desktop.
- **Navegação SPA:** Sem recarregamentos de página (Single Page Application).
- **Match por Geolocalização:** O painel do Dentista exibe automaticamente apenas os pacientes de sua região.
- **Painéis Exclusivos:** Visão gerencial e gamificada para Dentistas, e interface de impacto para Pacientes.
- **Sistema de Login:** Níveis de acesso e validação de sessão.

---

## 🚀 Como Rodar o Projeto

Este projeto utiliza o **Vite** como ferramenta de build. Não é necessário ter o Vite instalado previamente de forma global; o comando de instalação abaixo baixará tudo o que é necessário.

**Pré-requisito:** Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no seu computador.

1. Faça o clone do repositório ou extraia os arquivos do projeto.
2. Abra a pasta do projeto no seu editor de código (ex: VS Code).
3. Abra um novo terminal na pasta raiz do projeto e instale todas as dependências executando:

```bash
   npm install
```

4. Após o término da instalação, inicie o servidor de desenvolvimento:

```bash
   npm run dev
```

5. O terminal exibirá um link local (geralmente `http://localhost:5173/`). Segure o `Ctrl` e clique no link para abrir a aplicação no seu navegador.

---

## 🧪 Instruções de Teste

Para vivenciar a experiência completa da plataforma, certifique-se de que o Back-End está rodando e utilize a tela de **"Cadastre-se"**:

- **Perfil Dentista:** Crie uma conta como dentista para visualizar a fila filtrada por bairros, preencher dados profissionais (CRO) e interagir com o Assistente Virtual (IA Gemini).
- **Perfil Paciente:** Crie uma conta ou logue para visualizar as estatísticas globais da ONG e atualizar dados de triagem.

---

## 📸 Screenshots

![Extra Large Menu Screenshot](/src/img/extra-large-screenshot.png)
![Mobile Menu Screenshot](/src/img/mobile-screenshot.png)



---

## 👥 Equipe de Desenvolvimento (Turma 1TDSPB)

| Nome | RM | GitHub | LinkedIn |
|------|----|--------|----------|
| Gabriel Correa | 567903 | [GitHub](#) | [LinkedIn](#) |
| Kayque Duarte | 567980 | [GitHub](#) | [LinkedIn](#) |
| Eric Maciel | 567398 | [GitHub](#) | [LinkedIn](#) |