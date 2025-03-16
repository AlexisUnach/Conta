// script.js
// Función para manejar el cambio entre pestañas
function openTab(tabName) {
    const tabs = document.getElementsByClassName("tab-content");
    const buttons = document.getElementsByClassName("tab-button");

    // Ocultar todas las pestañas y quitar la clase active de los botones
    for (let tab of tabs) {
        tab.classList.remove("active");
    }
    for (let button of buttons) {
        button.classList.remove("active");
    }

    // Mostrar la pestaña seleccionada y marcar el botón como activo
    document.getElementById(tabName).classList.add("active");
    event.target.classList.add("active");

    // Actualizar las vistas según la pestaña seleccionada
    if (tabName === "libro-mayor") {
        actualizarCuentasT();
    } else if (tabName === "balanza-comprobacion") {
        actualizarBalanzaComprobacion();
    } else if (tabName === "balance-general") {
        actualizarBalanceGeneral();
    }
}