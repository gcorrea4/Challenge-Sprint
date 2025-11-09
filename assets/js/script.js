document.addEventListener("DOMContentLoaded", function() {


    const form = document.getElementById("formaContato"); 
    const nomeInput = document.getElementById("nome");
    const emailInput = document.getElementById("email");
    const mensagemInput = document.getElementById("mensagem");

    const nomeError = document.getElementById("nomeError");
    const emailError = document.getElementById("emailError");
    const mensagemError = document.getElementById("mensagemErro"); 
    const successMessage = document.getElementById("mensagemsucesso"); 
    
    const nomeSalvo = localStorage.getItem('usuarioNome');
    if (nomeSalvo) {
        nomeInput.value = nomeSalvo; 
    }
    
  
    form.addEventListener("submit", function(event) {
        event.preventDefault();

        
        nomeError.style.display = "none";
        emailError.style.display = "none";
        mensagemError.style.display = "none";
        successMessage.style.display = "none";

        let isValid = true; 

        

        if (nomeInput.value.trim() === "") {
            nomeError.textContent = "Por favor, preencha seu nome.";
            nomeError.style.display = "block";
            isValid = false;
        }

        if (emailInput.value.trim() === "") {
            emailError.textContent = "Por favor, preencha seu email.";
            emailError.style.display = "block";
            isValid = false;
        } else if (!isValidEmail(emailInput.value.trim())) {
            emailError.textContent = "Por favor, digite um email válido.";
            emailError.style.display = "block";
            isValid = false;
        }

        if (mensagemInput.value.trim() === "") {
            mensagemError.textContent = "Por favor, escreva uma mensagem.";
            mensagemError.style.display = "block";
            isValid = false;
        }
        
        if (isValid) {
            
            successMessage.style.display = "block";
            
          
            localStorage.setItem('usuarioNome', nomeInput.value);
            
            form.reset();

        } else {
          
            let tentativas = sessionStorage.getItem('errosForm') || 0;
            tentativas = Number(tentativas) + 1;
            sessionStorage.setItem('errosForm', tentativas);

            console.log(`Erros de formulário nesta sessão: ${tentativas}`);
        }
    });

    function isValidEmail(email) {
        const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return regex.test(email);
    }
});