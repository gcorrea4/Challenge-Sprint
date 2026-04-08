document.addEventListener("DOMContentLoaded", () => {
    const btnHamburguer = document.getElementById("btn-hamburguer");
    const btnFechar = document.getElementById("btn-fechar");
    const menuLateral = document.getElementById("menu-lateral");
    const overlayMenu = document.getElementById("overlay-menu");

    
    btnHamburguer.addEventListener("click", () => {
        menuLateral.classList.add("ativo");
        overlayMenu.classList.add("ativo");
    });

   
    btnFechar.addEventListener("click", () => {
        menuLateral.classList.remove("ativo");
        overlayMenu.classList.remove("ativo");
    });

    
    overlayMenu.addEventListener("click", () => {
        menuLateral.classList.remove("ativo");
        overlayMenu.classList.remove("ativo");
    });
});