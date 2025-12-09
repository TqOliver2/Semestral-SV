// contacto-validation.js - Playa Santa Clara
document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('contactForm');
    const successMessage = document.getElementById('successMessage');

    if (!form || !successMessage) return;

    form.addEventListener('submit', function (e) {
        e.preventDefault();
        let isValid = true;

        // Reset
        document.querySelectorAll('.form-group').forEach(g => {
            g.classList.remove('error', 'success');
            g.querySelector('.error-message').style.display = 'none';
        });

        // NOMBRE - Solo letras y espacios
        const nombre = document.getElementById('nombre').value.trim();
        const nombreRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/;
        if (!nombre || nombre.length < 3 || !nombreRegex.test(nombre)) {
            showError('nombre', 'Solo letras y espacios (sin números)');
            isValid = false;
        } else showSuccess('nombre');

        // EMAIL
        const email = document.getElementById('email').value.trim();
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailRegex.test(email)) {
            showError('email', 'Email inválido');
            isValid = false;
        } else showSuccess('email');

        // TELÉFONO - Solo números (y + opcional)
        const telefonoRaw = document.getElementById('telefono').value.trim();
        const telefono = telefonoRaw.replace(/[^\d+]/g, ''); // Elimina todo menos números y +
        const phoneRegex = /^\+?[0-9]{8,15}$/;
        if (!phoneRegex.test(telefono)) {
            showError('telefono', 'Solo números (ej: 69998888)');
            isValid = false;
        } else showSuccess('telefono');

        // MENSAJE
        const mensaje = document.getElementById('mensaje').value.trim();
        if (mensaje.length < 10) {
            showError('mensaje', 'Mínimo 10 caracteres');
            isValid = false;
        } else showSuccess('mensaje');

        // ÉXITO
        if (isValid) {
            const formData = new FormData(form);
            fetch('https://formspree.io/f/xkgjrrwp', {
                method: 'POST',
                body: formData,
                headers: { 'Accept': 'application/json' }
            })
            .then(() => {
                successMessage.style.display = 'block';
                form.reset();
                setTimeout(() => successMessage.style.display = 'none', 6000);
            })
            .catch(() => {
                successMessage.style.display = 'block';
                form.reset();
                setTimeout(() => successMessage.style.display = 'none', 6000);
            });
        }
    });

    function showError(id, msg) {
        const el = document.getElementById(id);
        el.parentElement.classList.add('error');
        const errorMsg = el.parentElement.querySelector('.error-message');
        errorMsg.textContent = msg;
        errorMsg.style.display = 'block';
    }

    function showSuccess(id) {
        document.getElementById(id).parentElement.classList.add('success');
    }
});