let carrito = [];
let reservasPendientes = JSON.parse(localStorage.getItem("reservas")) || [];

/* AGREGAR RESERVA */
function agregarReserva(nombre, precio) {
    carrito.push({ nombre, precio });
    mostrarCarrito();
}

function mostrarCarrito() {
    let lista = document.getElementById("listaCarrito");
    let total = 0;

    lista.innerHTML = "";

    carrito.forEach(r => {
        lista.innerHTML += `<li>${r.nombre} - $${r.precio}</li>`;
        total += r.precio;
    });

    document.getElementById("total").textContent = "Total: $" + total;
}

/* ENVIAR RESERVACIÓN */
function enviarReservacion() {
    if (carrito.length === 0) {
        alert("Agrega un paquete antes.");
        return;
    }

    reservasPendientes.push({
        id: Date.now(),
        paquetes: carrito,
        estado: "Pendiente"
    });

    localStorage.setItem("reservas", JSON.stringify(reservasPendientes));

    alert("Reservación enviada. Espera aprobación del administrador.");
    carrito = [];
    mostrarCarrito();
}

/* LOGIN ADMIN */
function loginAdmin() {
    let u = document.getElementById("user").value;
    let p = document.getElementById("pass").value;
    let msg = document.getElementById("msg");

    if (u === "admin1" && p === "1234") {
        window.location.href = "admin.html";
    } else {
        msg.textContent = "Credenciales incorrectas";
        msg.style.color = "red";
    }
}

/* PANEL ADMIN */
function cargarAdmin() {
    let div = document.getElementById("adminReservas");

    reservasPendientes = JSON.parse(localStorage.getItem("reservas")) || [];

    div.innerHTML = "";

    reservasPendientes.forEach(r => {
        let botones = "";

        if (r.estado === "Pendiente") {
            botones = `
                <button onclick="aceptar(${r.id})">Aceptar</button>
                <button onclick="rechazar(${r.id})" style="background:red">Rechazar</button>
            `;
        } else if (r.estado === "Aceptada") {
            botones = `<p style="color: green; font-weight: bold;">✔ Reserva aprobada</p>`;
        }

        div.innerHTML += `
            <div class="admin-item">
                <h3>Reserva #${r.id}</h3>
                ${r.paquetes.map(p => `<p>${p.nombre} - $${p.precio}</p>`).join("")}
                <p><b>Estado:</b> ${r.estado}</p>
                ${botones}
            </div>
        `;
    });
}

if (window.location.pathname.includes("admin.html")) {
    cargarAdmin();
}

function aceptar(id) {
    reservasPendientes.forEach(r => {
        if (r.id === id) r.estado = "Aceptada";
    });

    localStorage.setItem("reservas", JSON.stringify(reservasPendientes));
    alert("Reserva aceptada. El usuario recibirá su confirmación.");
    cargarAdmin();
}

function rechazar(id) {
    reservasPendientes = reservasPendientes.filter(r => r.id !== id);
    localStorage.setItem("reservas", JSON.stringify(reservasPendientes));
    alert("Reserva rechazada.");
    cargarAdmin();
}
