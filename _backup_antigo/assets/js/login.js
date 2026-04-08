document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formLogin");
    const msgRetorno = document.getElementById("msg-retorno");

    form.addEventListener("submit", (event) => {
        event.preventDefault(); // Impede a página de recarregar

        const email = document.getElementById("login-email").value;
        const senha = document.getElementById("login-senha").value;

        // 1. Busca o usuário no "banco de dados" (localStorage) usando o e-mail
        const usuarioSalvo = localStorage.getItem("usuario_" + email);

        // 2. Se não encontrar nada, o usuário não existe
        if (!usuarioSalvo) {
            mostrarMensagem("E-mail não encontrado. Por favor, cadastre-se primeiro!", "erro");
            return;
        }

        // 3. Se encontrou, transforma o texto do localStorage de volta em um Objeto JS
        const usuario = JSON.parse(usuarioSalvo);

        // 4. Verifica se a senha digitada é igual à senha guardada
        if (usuario.senha !== senha) {
            mostrarMensagem("Senha incorreta. Tente novamente.", "erro");
            return;
        }

        // 5. Se tudo estiver certo, Login aprovado!
        mostrarMensagem(`Login aprovado! Bem-vindo de volta, ${usuario.nomeCompleto}.`, "sucesso");

        // Opcional: Salva uma "sessão" dizendo quem está logado no momento
        sessionStorage.setItem("usuarioLogado", usuario.nomeCompleto);

        // Redireciona o usuário para a página inicial após 2 segundos
        setTimeout(() => {
            window.location.href = "../../index.html"; 
        }, 2000);
    });

    // Função para exibir as mensagens de erro ou sucesso na tela
    function mostrarMensagem(texto, tipo) {
        msgRetorno.textContent = texto;
        msgRetorno.className = `msg-retorno ${tipo}`;
        msgRetorno.style.display = "block";
    }
});