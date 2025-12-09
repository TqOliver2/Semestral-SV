/* -------- MENÚ RESPONSIVE -------- */
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

/* -------- DROPDOWN POR CLICK (YA NO DESAPARECE) -------- */
const btnDropdown = document.getElementById("btnDropdown");
const dropdownMenu = document.getElementById("dropdownMenu");

btnDropdown.addEventListener("click", (e) => {
    e.preventDefault();
    dropdownMenu.classList.toggle("show-dropdown");
});


/* -------- VALIDACIÓN FORMULARIO -------- */
document.getElementById("formContacto").addEventListener("submit", function(e){
    e.preventDefault();

    let nombre = document.getElementById("nombre").value.trim();
    let correo = document.getElementById("correo").value.trim();
    let mensaje = document.getElementById("mensaje").value.trim();
    let resultado = document.getElementById("resultado");

    if(nombre.length < 3){
        resultado.textContent = "El nombre debe tener mínimo 3 caracteres.";
        resultado.style.color = "red";
        return;
    }

    if(!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(correo)){
        resultado.textContent = "Correo inválido.";
        resultado.style.color = "red";
        return;
    }

    if(mensaje.length < 10){
        resultado.textContent = "El mensaje debe tener mínimo 10 caracteres.";
        resultado.style.color = "red";
        return;
    }

    resultado.textContent = "Mensaje enviado correctamente ✔";
    resultado.style.color = "green";

    setTimeout(() => {
        document.getElementById("formContacto").reset();
        resultado.textContent = "";
    }, 2500);
});
