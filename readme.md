# 🦷 Painel de Triagem - Turma do Bem (Front-End - Sprint 3)

Este é o protótipo Front-End desenvolvido para o Challenge da ONG **Turma do Bem** (FIAP). O projeto visa otimizar a triagem e o atendimento de jovens em situação de vulnerabilidade social, conectando-os a dentistas voluntários através de uma plataforma web inteligente, rápida e acessível.

---

## 📌 Nota sobre a Sprint 3 (Simulação Local)

> ⚠️ **Atenção Avaliador:** Para atender estritamente às regras da **Sprint 3**, esta aplicação **não consome APIs externas (sem fetch/axios)**.
> Todo o fluxo de dados (Cadastro, Login, Triagem e Dashboard) está sendo simulado utilizando o `localStorage` e o estado local do React para fins de demonstração da interface (SPA) e das lógicas de componentização. A integração real com o Back-End (Python) será habilitada na Sprint 4.

---

## 💻 Tecnologias Utilizadas

- **React.js** com **Vite** — Alta performance e build ultrarrápido.
- **TypeScript** — Tipagem estática e segurança no código.
- **Tailwind CSS** — Estilização moderna e responsividade total sem CSS externo.
- **React Router Dom** — Navegação SPA (Single Page Application) fluida.
- **React Hook Form** — Validação avançada e nativa de formulários.

---

## ✨ Funcionalidades Implementadas

- **Layout 100% Responsivo:** Adaptado perfeitamente para Mobile, Tablet e Desktop.
- **Navegação SPA:** Transição entre páginas sem recarregamento.
- **Simulação de Match e Dashboard:** O painel do Dentista exibe uma fila dinâmica (mockada) para demonstrar a geolocalização.
- **Painéis Exclusivos:** Visão gerencial e gamificada para Dentistas, e interface de impacto para Pacientes.
- **Sistema de Login Local:** Níveis de acesso e validação de sessão usando `sessionStorage` e `localStorage`.

---

## 🚀 Como Rodar o Projeto

Este projeto utiliza o **Vite** como ferramenta de build. Não é necessário ter o Vite instalado previamente de forma global; o comando de instalação abaixo baixará tudo o que é necessário.

**Pré-requisito:** Certifique-se de ter o [Node.js](https://nodejs.org/) instalado no seu computador.

1. Faça o clone do repositório ou extraia o arquivo `.zip` fornecido.
2. Abra a pasta do projeto no seu editor de código (ex: VS Code).
3. Abra um novo terminal na pasta raiz do projeto e instale todas as dependências:

```bash
npm install
```

4. Após o término da instalação, inicie o servidor de desenvolvimento:

```bash
npm run dev
```

5. O terminal exibirá um link local (geralmente `http://localhost:5173/`). Segure o `Ctrl` e clique no link para abrir a aplicação no seu navegador.

---

## 🧪 Instruções de Teste (Fluxo Offline)

Para vivenciar a experiência da plataforma, utilize a tela de **"Cadastre-se"**:

- **Perfil Dentista:** Crie uma conta escolhendo o perfil de Dentista. Preencha os dados (como CRO e Bairro). Faça o login logo em seguida para visualizar o Dashboard interativo, a fila filtrada simulada e a simulação de resposta do Assistente de IA.
- **Perfil Paciente:** Crie uma conta como Paciente (fornecendo CPF). Teste a página de formulário de triagem, que calculará a urgência localmente e exibirá o resultado em tempo real.

---

## 📸 Screenshots


![Extra Large Screenshot](/src/img/extra-large-screenshot.png)
![Mobile Screenshot](/src/img/mobile-screenshot.png)

---

## 👥 Equipe de Desenvolvimento (Turma 1TDSPB)

| Nome | RM | GitHub | LinkedIn |
|---|---|---|---|
| Gabriel Correa | 567903 | [GitHub](https://github.com/gcorrea4) | [LinkedIn](https://www.linkedin.com/in/gabriel-correa-souza-763135271/) |
| Kayque Duarte | 567980 | [GitHub](https://github.com/Kayque2012) | [LinkedIn](https://www.linkedin.com/in/kayque-duarte-b24313361/) |
| Eric Maciel | 567398 | [GitHub](https://github.com/Eric-devops-tech) | [LinkedIn](https://www.linkedin.com/in/eric-maciel-144058389/) |