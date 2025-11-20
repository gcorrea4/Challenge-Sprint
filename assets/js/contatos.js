document.addEventListener('DOMContentLoaded', function() {
    
    const btnContatos = document.getElementById('btn-contatos');
    const btnLocalizacao = document.getElementById('btn-localizacao');
    const btnRedes = document.getElementById('btn-redes');

    const contentContatos = document.getElementById('content-contatos');
    const contentLocalizacao = document.getElementById('content-localizacao');
    const contentRedes = document.getElementById('content-redes');

    function mostrarSecao(secaoParaMostrar) {
        
      
        
        contentContatos.classList.add('oculto');
        contentLocalizacao.classList.add('oculto');
        contentRedes.classList.add('oculto');
        
       
        if (secaoParaMostrar) {
            secaoParaMostrar.classList.remove('oculto');
        }
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