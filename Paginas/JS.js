// MENU RESPONSIVE
const menuBtn = document.getElementById("menuBtn");
const navLinks = document.getElementById("navLinks");

menuBtn.addEventListener("click", () => {
    navLinks.classList.toggle("show");
});

// SLIDER AUTOMÁTICO
const slides = document.querySelectorAll(".carousel-slide");
let index = 0;

function showSlide(i) {
    slides.forEach(s => s.classList.remove("active"));
    slides[i].classList.add("active");
}

function autoSlide() {
    index = (index + 1) % slides.length;
    showSlide(index);
}

setInterval(autoSlide, 3000);
