document.addEventListener('DOMContentLoaded', function() {
    
    const btnContatos = document.getElementById('btn-contatos');
    const btnLocalizacao = document.getElementById('btn-localizacao');
    const btnRedes = document.getElementById('btn-redes');

   
    const contentContatos = document.getElementById('content-contatos');
    const contentLocalizacao = document.getElementById('content-localizacao');
    const contentRedes = document.getElementById('content-redes');

   
    function mostrarSecao(secaoParaMostrar) {
       
        contentContatos.style.display = 'none';
        contentLocalizacao.style.display = 'none';
        contentRedes.style.display = 'none';
        
       
        secaoParaMostrar.style.display = 'block';
    }

    
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