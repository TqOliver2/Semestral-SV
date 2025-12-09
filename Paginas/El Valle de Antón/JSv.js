/* -------- MENÚ RESPONSIVE -------- */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

/* -------- CARRITO -------- */
let carrito = [];
let total = 0;

function agregarPaquete(nombre, precio) {
    carrito.push({ nombre, precio });
    total += precio;
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById("listaCarrito");
    lista.innerHTML = "";

    carrito.forEach(item => {
        let li = document.createElement("li");
        li.textContent = `${item.nombre} - $${item.precio}`;
        lista.appendChild(li);
    });

    document.getElementById("total").textContent = "Total: $" + total;
}

function finalizarCompra() {
    document.getElementById("formularioCompra").style.display = "block";
    window.scrollTo(0, document.body.scrollHeight);
}
