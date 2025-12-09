// ==== ELEMENTOS ====
const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');
const bgCanvas = document.getElementById('bg-balls');
const bgCtx = bgCanvas.getContext('2d');
const particlesCanvas = document.getElementById('particles');
const pctx = particlesCanvas.getContext('2d');
const gameOverEl = document.getElementById('game-over');

const cursor = document.querySelector('.custom-cursor');

// ==== VARIABLES GLOBALES ====
let score = 0;
let timeLeft = 60;
let phase = 0;
let gameActive = true;
let gameBalls = [];
let bgBalls = [];
let particles = [];
let timerInterval = null;
let spawnInterval = null;
let audioCtx = null;

// Colores y nombres
const colors = ['#ff4444', '#ffff44', '#4444ff'];
const colorNames = ['ROJAS', 'AMARILLAS', 'AZULES'];

// Jugador
const player = { x: canvas.width / 2, y: canvas.height / 2, radius: 25 };

// Satélite (SVG en base64)
const satelliteImg = new Image();
satelliteImg.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAiIGhlaWdodD0iNDAiIHZpZXdCb3g9IjAgMCA0MCA0MCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGNpcmNsZSBjeD0iMjAiIGN5PSIyMCIgcj0iMTgiIGZpbGw9IiM4OEE5RkYiLz4KPHBhdGggZD0iTTE2IDIwbTAgMEgydjRoMzJ2LTRoLTE2eiIgZmlsbD0iI0ZGRkZGRiIvPgo8Y2lyY2xlIGN4PSIxMiIgY3k9IjIwIiByPSI0IiBmaWxsPSIjRkY0NDQ0Ii8+CjxjaXJjbGUgY3g9IjI4IiBjeT0iMjAiIHI9IjQiIGZpbGw9IiNGRjQ0NDQiLz4KPC9zdmc+';

// Mejor puntuación
let best = { score: 0 };
const saved = localStorage.getItem('colorRushBest');
if (saved) {
  best = JSON.parse(saved);
  document.getElementById('bestScore').textContent = best.score;
}

// ==== AUDIO ====
function initAudio() {
  if (audioCtx) return;
  audioCtx = new (window.AudioContext || window.webkitAudioContext)();
}

function playChangeSound() {
  initAudio();
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  oscillator.frequency.setValueAtTime(400, audioCtx.currentTime);
  oscillator.frequency.linearRampToValueAtTime(800, audioCtx.currentTime + 0.3);
  gainNode.gain.setValueAtTime(0.4, audioCtx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.3);

  oscillator.type = 'sine';
  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + 0.3);
}

// ==== CLASES ====
class BgBall {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * bgCanvas.width;
    this.y = Math.random() * bgCanvas.height;
    this.vx = (Math.random() - 0.5) * 2;
    this.vy = (Math.random() - 0.5) * 2;
    this.radius = 6 + Math.random() * 14;
    this.color = `hsl(${Math.random() * 360}, 20%, ${40 + Math.random() * 25}%)`;
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x - this.radius < 0 || this.x + this.radius > bgCanvas.width) this.vx *= -1;
    if (this.y - this.radius < 0 || this.y + this.radius > bgCanvas.height) this.vy *= -1;
  }
  draw() {
    bgCtx.save();
    bgCtx.shadowBlur = 15;
    bgCtx.shadowColor = this.color;
    bgCtx.fillStyle = this.color;
    bgCtx.beginPath();
    bgCtx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    bgCtx.fill();
    bgCtx.restore();
  }
}

class GameBall {
  constructor() {
    this.reset();
  }
  reset() {
    this.x = Math.random() * (canvas.width - 80) + 40;
    this.y = Math.random() * (canvas.height - 80) + 40;
    this.vx = (Math.random() - 0.5) * 9;
    this.vy = (Math.random() - 0.5) * 9;
    this.radius = 14 + Math.random() * 10;
    this.colorIdx = Math.floor(Math.random() * 3);
    this.color = colors[this.colorIdx];
  }
  update() {
    this.x += this.vx;
    this.y += this.vy;
    if (this.x - this.radius < 0 || this.x + this.radius > canvas.width) this.vx *= -1.05;
    if (this.y - this.radius < 0 || this.y + this.radius > canvas.height) this.vy *= -1.05;
    this.x = Math.max(this.radius, Math.min(canvas.width - this.radius, this.x));
    this.y = Math.max(this.radius, Math.min(canvas.height - this.radius, this.y));
  }
  draw() {
    ctx.save();
    ctx.shadowBlur = 30;
    ctx.shadowColor = this.color;
    ctx.fillStyle = this.color;
    ctx.beginPath();
    ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

// ==== UTILIDADES ====
function resize() {
  particlesCanvas.width = window.innerWidth;
  particlesCanvas.height = window.innerHeight;
  const oldLen = bgBalls.length;
  bgCanvas.width = window.innerWidth;
  bgCanvas.height = window.innerHeight;
  if (oldLen > 0) {
    bgBalls.forEach(ball => ball.reset());
  }
}

function createParticles(x, y) {
  for (let i = 0; i < 60; i++) {
    particles.push({
      x, y,
      vx: (Math.random() - 0.5) * 14,
      vy: (Math.random() - 0.5) * 14,
      life: 1,
      color: `hsl(${Math.random() * 80 + 10}, 100%, 65%)`
    });
  }
}

function updatePhaseDisplay() {
  const phaseEl = document.getElementById('phase');
  phaseEl.innerHTML = `¡Atrapa <strong style="color:${colors[phase]}">${colorNames[phase]}</strong>!`;
}

function checkCollision(ball) {
  const dx = player.x - ball.x;
  const dy = player.y - ball.y;
  return Math.sqrt(dx * dx + dy * dy) < player.radius + ball.radius;
}

function endGame() {
  gameActive = false;
  clearInterval(timerInterval);
  clearInterval(spawnInterval);
  document.getElementById('final-score').textContent = score;
  document.getElementById('final-best').textContent = best.score;
  gameOverEl.style.display = 'flex';
}

// ==== INICIO Y REINICIO ====
function initGame() {
  score = 0;
  timeLeft = 60;
  phase = 0;
  gameActive = true;
  gameBalls = [];
  particles = [];

  document.getElementById('score').textContent = score;
  document.getElementById('timeLeft').textContent = timeLeft;
  document.getElementById('game-over').style.display = 'none';
  updatePhaseDisplay();

  if (timerInterval) clearInterval(timerInterval);
  if (spawnInterval) clearInterval(spawnInterval);

  timerInterval = setInterval(() => {
    if (!gameActive) return;
    timeLeft--;
    document.getElementById('timeLeft').textContent = timeLeft;

    const elapsed = 60 - timeLeft;
    const newPhase = Math.floor(elapsed / 20);
    if (newPhase !== phase) {
      phase = newPhase;
      updatePhaseDisplay();
      playChangeSound();
    }

    if (timeLeft <= 0) {
      document.getElementById('timeLeft').textContent = '0';
      endGame();
    }
  }, 1000);

  spawnInterval = setInterval(() => {
    if (gameActive && gameBalls.length < 28) {
      gameBalls.push(new GameBall());
    }
  }, 300);

  for (let i = 0; i < 12; i++) {
    gameBalls.push(new GameBall());
  }
}

function resetGame() {
  initGame();
}

// ==== CONTROLES (con clamp y audio) ====
canvas.addEventListener('mousemove', e => {
  initAudio();
  const rect = canvas.getBoundingClientRect();
  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, e.clientX - rect.left));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, e.clientY - rect.top));
});

canvas.addEventListener('touchstart', e => {
  initAudio();
}, { passive: true });

canvas.addEventListener('touchmove', e => {
  initAudio();
  e.preventDefault();
  const rect = canvas.getBoundingClientRect();
  player.x = Math.max(player.radius, Math.min(canvas.width - player.radius, e.touches[0].clientX - rect.left));
  player.y = Math.max(player.radius, Math.min(canvas.height - player.radius, e.touches[0].clientY - rect.top));
}, { passive: false });

// ==== CURSOR PERSONALIZADO ====
document.addEventListener('mousemove', e => {
  cursor.style.left = e.clientX + 'px';
  cursor.style.top = e.clientY + 'px';

  const trail = document.createElement('div');
  trail.className = 'cursor-trail';
  trail.style.left = e.clientX + 'px';
  trail.style.top = e.clientY + 'px';
  document.body.appendChild(trail);
  setTimeout(() => trail.remove(), 800);
});

// ==== RESIZE ====
window.addEventListener('resize', resize);

// ==== ANIMACIONES ====
function animateBg() {
  bgCtx.clearRect(0, 0, bgCanvas.width, bgCanvas.height);
  bgBalls.forEach(ball => {
    ball.update();
    ball.draw();
  });
  requestAnimationFrame(animateBg);
}

function animate() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = '#0a0a0a';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  for (let i = gameBalls.length - 1; i >= 0; i--) {
    const ball = gameBalls[i];
    ball.update();
    ball.draw();

    if (gameActive && checkCollision(ball)) {
      const rect = canvas.getBoundingClientRect();
      const screenX = rect.left + ball.x;
      const screenY = rect.top + ball.y;

      if (ball.color === colors[phase]) {
        score++;
        createParticles(screenX, screenY);
      } else {
        score = Math.max(0, score - 1);
      }

      document.getElementById('score').textContent = score;

      if (score > best.score) {
        best.score = score;
        localStorage.setItem('colorRushBest', JSON.stringify(best));
        document.getElementById('bestScore').textContent = best.score;
      }

      gameBalls.splice(i, 1);
    }
  }

  ctx.drawImage(satelliteImg, player.x - player.radius, player.y - player.radius, player.radius * 2, player.radius * 2);

  // Partículas
  pctx.clearRect(0, 0, particlesCanvas.width, particlesCanvas.height);
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.life -= 0.018;
    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }
    pctx.globalAlpha = p.life;
    pctx.fillStyle = p.color;
    pctx.shadowBlur = 10;
    pctx.shadowColor = p.color;
    pctx.fillRect(p.x - 4, p.y - 4, 8, 8);
  }
  pctx.globalAlpha = 1;
  pctx.shadowBlur = 0;

  requestAnimationFrame(animate);
}

// ==== INICIAR TODO ====
resize();
for (let i = 0; i < 70; i++) {
  bgBalls.push(new BgBall());
}
initGame();
animateBg();
animate();