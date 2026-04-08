function abrirAba(evt, idAba) {
    // 1. Esconde todos os conteúdos das abas
    let conteudos = document.getElementsByClassName("content-item");
    for (let i = 0; i < conteudos.length; i++) {
        conteudos[i].classList.remove("active");
    }

    // 2. Remove a classe 'active' de todos os botões (tira a cor laranja)
    let botoes = document.getElementsByClassName("panel-btn");
    for (let i = 0; i < botoes.length; i++) {
        botoes[i].classList.remove("active");
    }

    // 3. Mostra o conteúdo da aba clicada e pinta o botão selecionado
    document.getElementById(idAba).classList.add("active");
    evt.currentTarget.classList.add("active");
}