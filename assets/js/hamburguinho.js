document.addEventListener("DOMContentLoaded", () => {
    const btnHamburguer = document.getElementById("btn-hamburguer");
    const btnFechar = document.getElementById("btn-fechar");
    const menuLateral = document.getElementById("menu-lateral");
    const overlayMenu = document.getElementById("overlay-menu");

    // Função para abrir o menu
    btnHamburguer.addEventListener("click", () => {
        menuLateral.classList.add("ativo");
        overlayMenu.classList.add("ativo");
    });

    // Função para fechar o menu clicando no X
    btnFechar.addEventListener("click", () => {
        menuLateral.classList.remove("ativo");
        overlayMenu.classList.remove("ativo");
    });

    // Função para fechar o menu clicando fora dele (no fundo escuro)
    overlayMenu.addEventListener("click", () => {
        menuLateral.classList.remove("ativo");
        overlayMenu.classList.remove("ativo");
    });
});