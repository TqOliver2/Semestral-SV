// MENU RESPONSIVE
document.getElementById("menuBtn").addEventListener("click", () => {
    document.getElementById("navRight").classList.toggle("show");
});

// CARRITO
let carrito = [];
let total = 0;

function agregarCarrito(nombre, precio) {
    carrito.push({ nombre, precio });
    total += precio;
    actualizarCarrito();
}

function quitarCarrito(indice) {
    total -= carrito[indice].precio;
    carrito.splice(indice, 1);
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById("listaCarrito");
    lista.innerHTML = "";

    carrito.forEach((item, i) => {
        const li = document.createElement("li");
        li.innerHTML = `
            ${item.nombre} - $${item.precio}
            <button class="btn-quitar" onclick="quitarCarrito(${i})">Quitar</button>
        `;
        lista.appendChild(li);
    });

    document.getElementById("total").textContent = `Total: $${total.toFixed(2)}`;
}

function mostrarFormulario() {
    if (carrito.length === 0) {
        alert("El carrito está vacío.");
        return;
    }
    document.getElementById("formularioCompra").style.display = "block";
    window.scrollTo(0, document.body.scrollHeight);
}

function enviarCompra() {
    let nombre = document.getElementById("nombre").value.trim();
    let email = document.getElementById("email").value.trim();

    if (nombre === "" || email === "") {
        alert("Por favor llena los campos obligatorios.");
        return;
    }

    alert("¡Solicitud enviada! Te contactaremos pronto.");

    carrito = [];
    total = 0;
    actualizarCarrito();
    document.getElementById("formularioCompra").style.display = "none";
}
