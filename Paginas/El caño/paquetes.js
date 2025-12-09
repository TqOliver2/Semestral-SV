let carrito = [];
let total = 0;

function agregarPaquete(nombre, precio) {
    carrito.push({nombre, precio});
    total += precio;
    actualizarCarrito();
}

function actualizarCarrito() {
    const lista = document.getElementById('listaCarrito');
    lista.innerHTML = '';
    carrito.forEach((item, index) => {
        const li = document.createElement('li');
        li.textContent = `${item.nombre} - $${item.precio}`;
        
        // Botón eliminar
        const btnEliminar = document.createElement('button');
        btnEliminar.textContent = "❌";
        btnEliminar.style.marginLeft = "10px";
        btnEliminar.onclick = () => eliminarPaquete(index);

        li.appendChild(btnEliminar);
        lista.appendChild(li);
    });
    document.getElementById('total').textContent = `Total: $${total}`;
}

function eliminarPaquete(index) {
    total -= carrito[index].precio;
    carrito.splice(index, 1);
    actualizarCarrito();
}

function finalizarCompra() {
    document.getElementById('formularioCompra').style.display = 'block';
    window.scrollTo({ 
        top: document.getElementById('formularioCompra').offsetTop, 
        behavior: 'smooth' 
    });
}

// Menú responsive
const menuBtn = document.getElementById('menuBtn');
const navRight = document.querySelector('.nav-right');
menuBtn.addEventListener('click', () => {
    navRight.classList.toggle('show');
});
