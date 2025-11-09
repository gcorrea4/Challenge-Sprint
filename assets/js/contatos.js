document.addEventListener('DOMContentLoaded', function() {
    // Pega os botões (os H3)
    const btnContatos = document.getElementById('btn-contatos');
    const btnLocalizacao = document.getElementById('btn-localizacao');
    const btnRedes = document.getElementById('btn-redes');

    // Pega os conteúdos (as DIVs)
    const contentContatos = document.getElementById('content-contatos');
    const contentLocalizacao = document.getElementById('content-localizacao');
    const contentRedes = document.getElementById('content-redes');

    // Função para mostrar um e esconder os outros
    function mostrarSecao(secaoParaMostrar) {
        // Esconde todos primeiro
        contentContatos.style.display = 'none';
        contentLocalizacao.style.display = 'none';
        contentRedes.style.display = 'none';
        
        // Mostra apenas o escolhido
        secaoParaMostrar.style.display = 'block';
    }

    // Adiciona os eventos de clique
    btnContatos.addEventListener('click', function() {
        mostrarSecao(contentContatos);
    });

    btnLocalizacao.addEventListener('click', function() {
        mostrarSecao(contentLocalizacao);
    });

    btnRedes.addEventListener('click', function() {
        mostrarSecao(contentRedes);
    });
});