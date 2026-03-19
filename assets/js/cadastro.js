document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formCadastro");
    const msgRetorno = document.getElementById("msg-retorno");

    form.addEventListener("submit", (event) => {
        // Impede a página de recarregar
        event.preventDefault();

        // Pega os valores digitados
        const nome = document.getElementById("cad-nome").value;
        const email = document.getElementById("cad-email").value;
        const senha = document.getElementById("cad-senha").value;
        const confirma = document.getElementById("cad-confirma").value;

        // Validação simples: As senhas batem?
        if (senha !== confirma) {
            mostrarMensagem("As senhas não coincidem. Tente novamente!", "erro");
            return;
        }

        // Validação: O e-mail já existe no banco de dados falso?
        if (localStorage.getItem("usuario_" + email)) {
            mostrarMensagem("Este e-mail já está cadastrado!", "erro");
            return;
        }

        // Cria o "Objeto" do usuário (A estrutura do nosso banco de dados)
        // Obs: Num sistema real com back-end, NUNCA salvamos a senha assim, ela é criptografada!
        const novoUsuario = {
            nomeCompleto: nome,
            email: email,
            senha: senha,
            dataCadastro: new Date().toLocaleDateString('pt-BR')
        };

        // Salva no LocalStorage. 
        // JSON.stringify transforma o objeto num texto para o navegador conseguir salvar.
        localStorage.setItem("usuario_" + email, JSON.stringify(novoUsuario));

        // Mostra o sucesso
        mostrarMensagem("Cadastro realizado com sucesso! Bem-vindo(a) à Turma do Bem.", "sucesso");
        
        // Limpa os campos do formulário
        form.reset();

        /* OPCIONAL: Se você tiver uma página de login pronta, descomente o código abaixo para mandar ele pra lá após 2 segundos:
        setTimeout(() => {
            window.location.href = "login.html";
        }, 2000);
        */
    });

    // Função auxiliar para mostrar a mensagem verde (sucesso) ou vermelha (erro)
    function mostrarMensagem(texto, tipo) {
        msgRetorno.textContent = texto;
        msgRetorno.className = `msg-retorno ${tipo}`;
        msgRetorno.style.display = "block";
    }
});