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

function quitarPaquete(indice) {
    total -= carrito[indice].precio;
    carrito.splice(indice, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById("listaCarrito");
    lista.innerHTML = "";

    carrito.forEach((item, index) => {
        let li = document.createElement("li");
        li.innerHTML = `
            ${item.nombre} - $${item.precio}
            <button class="btn-quitar" onclick="quitarPaquete(${index})">Quitar</button>
        `;
        lista.appendChild(li);
    });

    document.getElementById("total").textContent = "Total: $" + total;
}

function finalizarCompra() {
    document.getElementById("formularioCompra").style.display = "block";
    window.scrollTo(0, document.body.scrollHeight);
}
