// chatbot-script.js - Respuestas automáticas por palabras clave
document.addEventListener('DOMContentLoaded', function () {
    const toggle = document.getElementById('chatbot-toggle');
    const window = document.getElementById('chatbot-window');
    const close = document.getElementById('chatbot-close');
    const input = document.getElementById('user-input');
    const sendBtn = document.getElementById('send-btn');
    const messages = document.getElementById('chatbot-messages');

    toggle.onclick = () => {
        window.style.display = 'flex';
        toggle.style.display = 'none';
    };

    close.onclick = () => {
        window.style.display = 'none';
        toggle.style.display = 'flex';
    };

    const addMessage = (text, type) => {
        const div = document.createElement('div');
        div.className = type === 'user' ? 'user-message' : 'bot-message';
        div.innerHTML = text.replace(/\n/g, '<br>');
        messages.appendChild(div);
        messages.scrollTop = messages.scrollHeight;
    };

    const botResponse = (msg) => {
        const lower = msg.toLowerCase();

        if (lower.includes('hola') || lower.includes('buenas') || lower.includes('saludos')) {
            return "¡Hola! 😊<br>¿En qué tour estás interesado?<br><br>• El Valle de Antón<br>• Playa Santa Clara<br>• El Caño Arqueológico";
        }
        if (lower.includes('valle') || lower.includes('anton')) {
            return "El Valle de Antón 🌿<br><br>• Tour 1 día: $95<br>• Fin de semana: $179<br><br>Incluye canopy, termales, almuerzo y transporte.<br>¿Para cuántas personas?";
        }
        if (lower.includes('playa') || lower.includes('santa clara')) {
            return "Playa Santa Clara 🏖️<br><br>Día todo incluido: $85<br><br>• Transporte desde Panamá<br>• Almuerzo + open bar<br>• Piscina y playa privada<br><br>¡Ideal para familias!";
        }
        if (lower.includes('caño') || lower.includes('arqueológico')) {
            return "Sitio Arqueológico El Caño 🏺<br><br>Tour + El Valle: $130<br><br>• Visita con arqueólogo<br>• Piezas de oro de 1200 años<br>• Almuerzo incluido<br><br>Cupos limitados";
        }
        if (lower.includes('precio') || lower.includes('cuanto') || lower.includes('costo')) {
            return "Precios actuales:<br><br>• El Valle 1 día → $95<br>• Playa Santa Clara → $85<br>• El Caño + Valle → $130<br>• Fin de semana El Valle → $179<br><br>¿Cuál te interesa?";
        }
        if (lower.includes('reserva') || lower.includes('apartar') || lower.includes('cupo')) {
            return "¡Perfecto! Te paso al WhatsApp para confirmar disponibilidad y fecha 📲<br><br>Haz clic aquí → <a href='https://wa.me/50769998888?text=¡Hola! Quiero reservar un tour' target='_blank' style='color:#00b0ff;font-weight:bold;'>Chatear ahora</a>";
        }

        return "No entendí bien 😅<br>Puedes preguntarme por:<br>• El Valle de Antón<br>• Playa Santa Clara<br>• El Caño<br>• Precios<br>• Reservas";
    };

    const sendMessage = () => {
        const text = input.value.trim();
        if (!text) return;

        addMessage(text, 'user');
        input.value = '';

        setTimeout(() => {
            addMessage(botResponse(text), 'bot');
        }, 800);
    };

    sendBtn.onclick = sendMessage;
    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') sendMessage();
    });
});