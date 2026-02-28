/* ============================================================
   BIRTHDAY WEBSITE - HANI HANDAYANI
   script.js — Full Logic
   ============================================================ */

// ============================================================
// CONFIG
// ============================================================
const BIRTHDAY = new Date(2004, 1, 29); // Feb 29, 2004
const MINIGAME_TARGET = 10;
const MINIGAME_DURATION = 45; // seconds

// ============================================================
// STATE
// ============================================================
let currentSlide = null;
let isTransitioning = false;
let gameInterval = null;
let gameTimer = null;
let gameScore = 0;
let gameTimeLeft = MINIGAME_DURATION;
let gameRunning = false;
let flowerSpawnInterval = null;
let birthdayAudioStarted = false;

//AUDIO
// Ambil elemen audio
const audioMain = document.getElementById('audioMain');

// Mulai lagu utama saat halaman dimuat
audioMain.play();

// Fungsi untuk berpindah slide
function goToSlide(slideId) {
  const currentSlide = document.querySelector('.slide.active');
  const nextSlide = document.getElementById(slideId);

  if (currentSlide) {
    currentSlide.classList.remove('active');
  }

  if (nextSlide) {
    nextSlide.classList.add('active');

  }
}

// ============================================================
// INIT
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  spawnPetals();
  startSlide('slide1');
});

// ============================================================
// SLIDE NAVIGATION
// ============================================================
function goToSlide(slideId) {
  const currentSlide = document.querySelector('.slide.active');
  const nextSlide = document.getElementById(slideId);

  if (currentSlide) {
    currentSlide.classList.remove('active');
  }

  if (nextSlide) {
    nextSlide.classList.add('active');

    // Tunggu sampai semua elemen selesai di-generate
    setTimeout(() => {
      // Mulai timer atau animasi setelah semua elemen selesai
      if (slideId === 'slide4') {
        const txt = buildCountdownText();
        typeText('text-slide4', txt, () => {
          setTimeout(() => goToSlide('slide5'), 6000);
        });
      } else if (slideId === 'slide6') {
        spawnPolaroids();
        setTimeout(() => {
          typeText('text-slide6', 'Iyaaa Kamuuu. Hani Handayani. Orang paling cantikk yang pernah adaa.');
        }, 800);
        setTimeout(() => goToSlide('slide7'), 23000);
      }
      // Tambahkan logika untuk slide lain jika diperlukan
    }, 500); // Delay untuk memastikan semua elemen selesai di-render
  }
}

function goToSlide(targetId, callback) {
  if (isTransitioning) return;
  isTransitioning = true;

  const currentEl = document.querySelector('.slide.active');
  const targetEl = document.getElementById(targetId);
  if (!targetEl) { isTransitioning = false; return; }

  // Backspace/erase transition
  backspaceTransition(() => {
    if (currentEl) currentEl.classList.remove('active');
    targetEl.classList.add('active');
    currentSlide = targetId;
    isTransitioning = false;
    onSlideEnter(targetId);
    if (callback) callback();
  });
}

function startSlide(targetId) {
  const el = document.getElementById(targetId);
  if (!el) return;
  el.classList.add('active');
  currentSlide = targetId;
  onSlideEnter(targetId);
}



// ============================================================
// HANDLE ENTER KEY FOR SLIDE NAVIGATION
// ============================================================
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') {
    e.preventDefault(); // Mencegah perilaku default
    if (currentSlide) {
      // Pindah ke slide berikutnya jika ada
      const nextSlide = getNextSlideId(currentSlide);
      if (nextSlide) {
        goToSlide(nextSlide);
      }
    }
  }
});

// Fungsi untuk mendapatkan ID slide berikutnya
function getNextSlideId(currentSlideId) {
  const slides = Array.from(document.querySelectorAll('.slide'));
  const currentIndex = slides.findIndex(slide => slide.id === currentSlideId);
  if (currentIndex >= 0 && currentIndex < slides.length - 1) {
    return slides[currentIndex + 1].id;
  }
  return null; // Tidak ada slide berikutnya
}
// ============================================================
// BACKSPACE TRANSITION (text eraser wipe)
// ============================================================
function backspaceTransition(callback) {
  // Create an overlay that mimics a "white curtain" wipe
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position:fixed; inset:0; z-index:999; pointer-events:none;
    background: var(--pink-100);
    clip-path: inset(0 100% 0 0);
    transition: clip-path 0.35s ease-in;
  `;
  document.body.appendChild(overlay);

  // Expand from right
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      overlay.style.clipPath = 'inset(0 0% 0 0)';
    });
  });

  setTimeout(() => {
    callback();
    // Then retract
    overlay.style.transition = 'clip-path 0.3s ease-out';
    overlay.style.clipPath = 'inset(0 0 0 100%)';
    setTimeout(() => overlay.remove(), 400);
  }, 380);
}

// ============================================================
// ON SLIDE ENTER
// ============================================================
function onSlideEnter(slideId) {
  resetTypewriters();

  switch (slideId) {
    // SLIDE 1 — auto 5s
    case 'slide1':
      typeText('text-slide1', 'Haloooo sayangggg', () => {
        setTimeout(() => goToSlide('slide-choice1'), 5000);
      });
      break;

    // SLIDE CHOICE 1
    case 'slide-choice1':
      typeText('text-choice1', 'Kamu tau gaaa ini hari apaa', () => {
        showChoices('choices1');
      });
      break;

    // WRONG CHOICE
    case 'slide-wrong':
      typeText('text-wrong', 'Masa iya gatauu. Coba inget inget lagi dehh');
      break;

    // SLIDE CHOICE 2
    case 'slide-choice2':
      typeText('text-choice2', 'Apaa cobaaa???', () => {
        showChoices('choices2');
      });
      break;

    // CORRECT
    case 'slide-correct':
      typeText('text-correct', 'Angjayyy benerrr', () => {
        spawnStars('stars-correct');
        setTimeout(() => goToSlide('slide4'), 5000);
      });
      break;

    // EXPLAIN B (Hari Minggu)
    case 'slide-explainB':
      typeText('text-explainB', 'Bener juga sihh. Tapi ada yang lebih spesial taukkk', () => {
        setTimeout(() => goToSlide('slide-jadi'), 5000);
      });
      break;

    // EXPLAIN C (Gatau)
    case 'slide-explainC':
      typeText('text-explainC', 'Ah payahhh. Gitu aja gatauu. Huuuu', () => {
        setTimeout(() => goToSlide('slide-jadi'), 5000);
      });
      break;

    // JADI...
    case 'slide-jadi':
      typeText('text-jadi', 'Jadiii...', () => {
        setTimeout(() => goToSlide('slide-discussion'), 3000);
      });
      break;

    // DISCUSSION
    case 'slide-discussion':
      typeText('text-discussion', 'Ini Hari Ulang Tahun Kamuuuuu', () => {
        setTimeout(() => goToSlide('slide4'), 5000);
      });
      break;

    // SLIDE 4 — 10s
    case 'slide4': {
      const txt = buildCountdownText();
      typeText('text-slide4', txt, () => {
        setTimeout(() => goToSlide('slide5'), 10000);
      });
      break;
    }

    // SLIDE 5 — 5s
    case 'slide5':
      typeText('text-slide5', 'Tau gaaa siapa Bidadari ituu??', () => {
        setTimeout(() => goToSlide('slide6'), 5000);
      });
      break;

    // SLIDE 6 — 15s, polaroids
    case 'slide6':
      spawnPolaroids();
      setTimeout(() => {
        typeText('text-slide6', 'Iyaaa Kamuuu. Hani Handayani. Orang paling cantikk yang pernah adaa.');
      }, 800);
      setTimeout(() => goToSlide('slide7'), 23000);
      break;

    // SLIDE 7 — 5s
    case 'slide7':
      typeText('text-slide7', 'Kenalan dulu yukkk sama diri kamuu', () => {
        setTimeout(() => goToSlide('slide8'), 5000);
      });
      break;

    // SLIDE 8 — 60s
    case 'slide8':
      animateBiodata(() => {
        setTimeout(() => {
          goToSlide('slide9');
        }, 8000); // jeda 4 detik setelah semua biodata selesai
      });
      break;

    // SLIDE 9 — 15s
    case 'slide9':
      typeText('text-slide9', 'Selamat Ulang Tahun yang ke-22 yaa sayangggg. Walaupun harusnya sih masih 5,5 tahun, tapi gapapaa anggap aja 22 tahun hehe', () => {
        setTimeout(() => goToSlide('slide10'), 7000);
      });
      break;

    // SLIDE 10 — 5s
    case 'slide10':
      typeText('text-slide10', 'Yokkk kita maen game duluu sebelum lanjutt.', () => {
        setTimeout(() => goToSlide('slide-minigame'), 5000);
      });
      break;

    // MINIGAME
    case 'slide-minigame':
      resetMinigame();
      break;

    // BIRTHDAY CAKE
    case 'slide-cake':
      initCakeSlide();
      break;

    // FLOWER NOTES
    case 'slide-flowers':
      initFlowerGarden();
      break;

    // GIFT
    case 'slide-gift':
      typeText('text-gift', 'Ini ada sedikit hadiahh dari aku. Tolong diterima yaa. Kamu tinggal scan aja QR ini, nanti hadiahnya muncull.');
      break;

    // OUTRO — 10s
    case 'slide-outro':
      typeText('text-outro', 'Sekali lagi Happy Birthday yaa sayanggg. Wish You All the Besttt!!', () => {
        setTimeout(() => fadeToBlack(), 8000);
      });
      break;
  }
}

// ============================================================
// CHOICE HANDLERS
// ============================================================
function handleChoice1(choice) {
  if (choice === 'a') {
    goToSlide('slide-choice2');
  } else {
    goToSlide('slide-wrong');
  }
}

function handleChoice2(choice) {
  if (choice === 'a') {
    goToSlide('slide-correct');
  } else if (choice === 'b') {
    goToSlide('slide-explainB');
  } else {
    goToSlide('slide-explainC');
  }
}

function showChoices(containerId) {
  const el = document.getElementById(containerId);
  if (!el) return;
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.5s ease';
  setTimeout(() => {
    el.style.opacity = '1';
    el.style.transform = 'translateY(0)';
  }, 200);
}

// ============================================================
// COUNTDOWN CALCULATOR
// ============================================================
function buildCountdownText() {
  const now = new Date();
  const diff = now - BIRTHDAY;
  const totalSeconds = Math.floor(diff / 1000);
  const seconds = totalSeconds % 60;
  const totalMinutes = Math.floor(totalSeconds / 60);
  const minutes = totalMinutes % 60;
  const totalHours = Math.floor(totalMinutes / 60);
  const hours = totalHours % 24;
  const days = Math.floor(totalHours / 24);

  return `${days} hari ${hours} jam ${minutes} menit ${seconds} detik yang lalu, tepatnya pada tanggal 29 Februari 2004, lahirlah seorang bidadari ke bumi yang penuh sengsara ini`;
}

// ============================================================
// TYPEWRITER EFFECT
// ============================================================
function typeText(elementId, text, onDone, speed = 45) {
  const el = document.getElementById(elementId);
  if (!el) { if (onDone) onDone(); return; }

  el.textContent = '';
  el.classList.remove('done');
  el.classList.add('typewriter');

  let i = 0;
  const interval = setInterval(() => {
    if (i < text.length) {
      el.textContent += text[i];
      i++;
    } else {
      clearInterval(interval);
      el.classList.add('done');
      if (onDone) onDone();
    }
  }, speed);
}

function resetTypewriters() {
  document.querySelectorAll('.typewriter').forEach(el => {
    el.textContent = '';
    el.classList.remove('done');
  });
}

// ============================================================
// FLOATING PETALS
// ============================================================
function spawnPetals() {
  const petals = ['🌸', '🌺', '🌼', '🌷', '🏵️'];
  document.querySelectorAll('.floating-petals').forEach(container => {
    for (let i = 0; i < 12; i++) {
      const petal = document.createElement('span');
      petal.className = 'petal';
      petal.textContent = petals[Math.floor(Math.random() * petals.length)];
      petal.style.left = `${Math.random() * 100}%`;
      petal.style.fontSize = `${0.8 + Math.random() * 1.2}rem`;
      petal.style.animationDuration = `${6 + Math.random() * 8}s`;
      petal.style.animationDelay = `${Math.random() * 6}s`;
      container.appendChild(petal);
    }
  });
}

// ============================================================
// STAR BURST
// ============================================================
function spawnStars(containerId) {
  const container = document.getElementById(containerId);
  if (!container) return;
  const emojis = ['✨', '⭐', '🌟', '💫', '🎉', '🎊'];
  for (let i = 0; i < 15; i++) {
    const star = document.createElement('div');
    star.className = 'star-particle';
    star.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    const angle = (i / 15) * 360;
    const dist = 80 + Math.random() * 80;
    star.style.cssText = `
      left: 50%; top: 50%;
      --dx: ${Math.cos(angle * Math.PI / 180) * dist}px;
      --dy: ${Math.sin(angle * Math.PI / 180) * dist}px;
      animation-delay: ${Math.random() * 0.3}s;
    `;
    container.appendChild(star);
    setTimeout(() => star.remove(), 2000);
  }
}

// ============================================================
// POLAROID SPAWN (Slide 6)
// ============================================================
function spawnPolaroids() {
  const container = document.getElementById('polaroidContainer');
  if (!container) return;
  container.innerHTML = '';

  const photos = [
    'assets/foto1.jpg',
    'assets/foto2.jpg',
    'assets/foto3.jpg',
    'assets/foto4.jpg',
    'assets/foto5.jpg',
    'assets/foto6.jpg',
    'assets/foto7.jpg',
    'assets/foto8.jpg',
    'assets/foto9.jpg',
    'assets/foto10.jpg',
  ];
  const emojis = ['👧', '🌸', '💕', '🌺', '✨', '🌷', '🎀', '💐', '🦋', '🌼'];
  const labels = ['Hani 🌸', 'cantik!', 'bidadari', 'Hani 💕', 'Lucu!', 'Pretty!', 'Hani 🌺', 'Imutt!', 'Honey 🍯', 'Beautiful'];

  const positions = [
    { left: '2%', top: '5%', width: 110 },
    { left: '80%', top: '3%', width: 100 },
    { left: '1%', top: '55%', width: 105 },
    { left: '82%', top: '55%', width: 95 },
    { left: '18%', top: '8%', width: 90 },
    { left: '70%', top: '10%', width: 100 },
    { left: '15%', top: '60%', width: 95 },
    { left: '73%', top: '62%', width: 105 },
    { left: '5%', top: '30%', width: 95 },
    { left: '84%', top: '28%', width: 100 },
  ];

  positions.forEach((pos, i) => {
    setTimeout(() => {
      const pol = document.createElement('div');
      const rot = (Math.random() - 0.5) * 20;
      pol.className = 'polaroid';
      pol.style.cssText = `
        left: ${pos.left}; top: ${pos.top};
        width: ${pos.width}px;
        --rot: ${rot}deg;
      `;
      pol.innerHTML = `
        <div class="polaroid-inner" style="height:${pos.width * 0.75}px;">
          <img src="${photos[i % photos.length]}" class="polaroid-img">
        </div>
        <div class="polaroid-label">${labels[i % labels.length]}</div>
      `;
      container.appendChild(pol);
    }, i * 800);
  });
}

// ============================================================
// BIODATA ANIMATION (Slide 8)
// ============================================================
function animateBiodata(onComplete) {
  const items = [
    { id: 'text-slide8-title', text: 'Siapasih kamu?' },
    { id: 'bio-nama', text: 'Hani Handayani' },
    { id: 'bio-tl', text: '29 Februari 2004' },
    { id: 'bio-zod', text: 'Pisces ♓' },
    { id: 'bio-sp', text: 'Bidadari 👼' },
    { id: 'bio-tt', text: 'Sukabumi' },
    { id: 'bio-mk', text: 'Matcha 🍵' },
    { id: 'bio-wk', text: 'Soft Pink 🩷' },
    { id: 'bio-kp', text: 'Baik Hati, Sopan, Penyabar, Penyayang, Cantik, Keren, Mandiri, Rajin Menabung, dsb.' },
    { id: 'bio-more', text: 'Dan Masih Banyak Lagi... 💕' },
  ];

  let delay = 0;
  let totalDuration = 0;

  items.forEach((item, idx) => {
    const speed = idx === 0 ? 60 : 35;
    const duration = item.text.length * speed + 400;

    setTimeout(() => {
      typeText(item.id, item.text, null, speed);
    }, delay);

    delay += duration;
    totalDuration += duration;
  });

  // Callback setelah semuanya selesai
  setTimeout(() => {
    if (onComplete) onComplete();
  }, totalDuration);
}

// ============================================================
// MINIGAME — Canvas Falling Cake Catcher
// ============================================================
let canvas, ctx;
let plate = { x: 0, y: 0, w: 120, h: 20, speed: 12 };
let clouds = [];
let cakes = [];
let keys = { left: false, right: false };
let gameAnimFrame = null;

function resetMinigame() {
  gameScore = 0;
  gameTimeLeft = MINIGAME_DURATION;
  gameRunning = false;
  cancelAnimationFrame(gameAnimFrame);
  clearInterval(gameTimer);
  cakes = []; clouds = [];

  document.getElementById('gameScore').textContent = '0';
  document.getElementById('gameTimer').textContent = MINIGAME_DURATION;
  document.getElementById('gameTargetDisplay').textContent = MINIGAME_TARGET;
  document.getElementById('gameStartOverlay').style.display = 'flex';
  document.getElementById('gameOverOverlay').style.display = 'none';
}

function startMiniGame() {
  document.getElementById('gameStartOverlay').style.display = 'none';

  canvas = document.getElementById('gameCanvas');
  ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth || window.innerWidth;
  canvas.height = canvas.offsetHeight || window.innerHeight;

  plate.x = canvas.width / 2 - plate.w / 2;
  plate.y = canvas.height - 80;

  // Spawn initial clouds
  for (let i = 0; i < 5; i++) {
    clouds.push(newCloud(canvas, true));
  }

  // Key listeners
  document.addEventListener('keydown', onKey);
  document.addEventListener('keyup', onKey);

  gameRunning = true;

  // Countdown timer
  gameTimer = setInterval(() => {
    gameTimeLeft--;
    document.getElementById('gameTimer').textContent = gameTimeLeft;
    if (gameTimeLeft <= 0) endMinigame(false);
  }, 1000);

  gameAnimFrame = requestAnimationFrame(gameLoop);
}

function onKey(e) {
  const down = e.type === 'keydown';
  if (e.key === 'ArrowLeft') keys.left = down;
  if (e.key === 'ArrowRight') keys.right = down;
  // Block page scroll
  if (['ArrowLeft', 'ArrowRight', 'ArrowUp', 'ArrowDown'].includes(e.key)) e.preventDefault();
}

function newCloud(canvas, randomY = false) {
  const w = 100 + Math.random() * 80;
  const speed = 0.8 + Math.random() * 1.4;
  const startRight = Math.random() < 0.5;
  return {
    x: startRight ? canvas.width + w : -w,
    y: randomY ? 30 + Math.random() * canvas.height * 0.25 : 30 + Math.random() * canvas.height * 0.25,
    w, h: 50 + Math.random() * 20,
    speed: startRight ? -speed : speed,
    dropInterval: 180 + Math.floor(Math.random() * 180),
    dropTimer: Math.floor(Math.random() * 120),
    emoji: ['☁️', '🌧️'][Math.random() < 0.7 ? 0 : 1]
  };
}

function gameLoop() {
  if (!gameRunning) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Move plate
  if (keys.left) plate.x = Math.max(0, plate.x - plate.speed);
  if (keys.right) plate.x = Math.min(canvas.width - plate.w, plate.x + plate.speed);

  // Update & draw clouds
  for (let i = clouds.length - 1; i >= 0; i--) {
    const c = clouds[i];
    c.x += c.speed;
    c.dropTimer++;

    // Drop cake from cloud
    if (c.dropTimer >= c.dropInterval) {
      c.dropTimer = 0;
      cakes.push({
        x: c.x + c.w / 2,
        y: c.y + c.h,
        size: 32,
        speed: 2.5 + Math.random() * 2,
        emj: ['🎂', '🍰', '🍰'][Math.floor(Math.random() * 3)]
      });
    }

    // Remove off-screen clouds & replace
    if (c.x > canvas.width + 150 || c.x < -150) {
      clouds.splice(i, 1);
      clouds.push(newCloud(canvas));
    }

    // Draw cloud
    ctx.font = `${c.h}px serif`;
    ctx.fillText(c.emoji, c.x, c.y + c.h);
  }

  // Update & draw cakes
  for (let i = cakes.length - 1; i >= 0; i--) {
    const ck = cakes[i];
    ck.y += ck.speed;

    // Collision with plate
    if (
      ck.y + ck.size * 0.5 >= plate.y &&
      ck.y - ck.size * 0.5 <= plate.y + plate.h &&
      ck.x >= plate.x - 10 &&
      ck.x <= plate.x + plate.w + 10
    ) {
      cakes.splice(i, 1);
      gameScore++;
      document.getElementById('gameScore').textContent = gameScore;

      // Score pop on canvas
      showCanvasPop(ck.x, plate.y - 20, '+1 🎂');

      if (gameScore >= MINIGAME_TARGET) { endMinigame(true); return; }
      continue;
    }

    // Missed
    if (ck.y > canvas.height + 60) {
      cakes.splice(i, 1); continue;
    }

    // Draw cake
    ctx.font = `${ck.size}px serif`;
    ctx.fillText(ck.emj, ck.x - ck.size / 2, ck.y);
  }

  // Draw plate (piring)
  const pr = plate;
  // Shadow
  ctx.fillStyle = 'rgba(0,0,0,0.1)';
  ctx.beginPath();
  ctx.ellipse(pr.x + pr.w / 2, pr.y + pr.h + 4, pr.w / 2, 6, 0, 0, Math.PI * 2);
  ctx.fill();
  // Plate body
  const grad = ctx.createLinearGradient(pr.x, pr.y, pr.x, pr.y + pr.h);
  grad.addColorStop(0, '#fff');
  grad.addColorStop(1, '#f0f0f0');
  ctx.fillStyle = grad;
  ctx.beginPath();
  ctx.ellipse(pr.x + pr.w / 2, pr.y + 6, pr.w / 2, 12, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = '#ffb3c6';
  ctx.lineWidth = 3;
  ctx.stroke();
  // Plate rim
  ctx.strokeStyle = '#ff85a1';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.ellipse(pr.x + pr.w / 2, pr.y + 6, pr.w / 2 - 8, 8, 0, 0, Math.PI * 2);
  ctx.stroke();

  // Arrow hint
  ctx.fillStyle = 'rgba(255,133,161,0.35)';
  ctx.font = '1.2rem serif';
  ctx.fillText('◀', 30, canvas.height - 30);
  ctx.fillText('▶', canvas.width - 50, canvas.height - 30);

  gameAnimFrame = requestAnimationFrame(gameLoop);
}

// Canvas floating score pop
let pops = [];
function showCanvasPop(x, y, text) {
  pops.push({ x, y, text, life: 1.0 });
  // Draw pops with next frame
  function drawPops() {
    if (!pops.length) return;
    pops.forEach((p, i) => {
      p.y -= 1.5;
      p.life -= 0.03;
      if (p.life <= 0) { pops.splice(i, 1); return; }
      ctx.globalAlpha = p.life;
      ctx.fillStyle = '#c9184a';
      ctx.font = 'bold 1.2rem Dancing Script, cursive';
      ctx.fillText(p.text, p.x - 20, p.y);
      ctx.globalAlpha = 1;
    });
    if (pops.length) requestAnimationFrame(drawPops);
  }
  drawPops();
}

function endMinigame(won) {
  gameRunning = false;
  clearInterval(gameTimer);
  cancelAnimationFrame(gameAnimFrame);
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('keyup', onKey);

  const overlay = document.getElementById('gameOverOverlay');
  overlay.style.display = 'flex';

  const title = document.getElementById('gameOverTitle');
  const msg = document.getElementById('gameOverMsg');
  const icon = document.getElementById('goIcon');

  if (won) {
    title.textContent = 'Yayyyy! 🎉';
    msg.textContent = `Kamu nangkep ${gameScore} kue!! Keren bangett kamu senggg!! 🎂`;
    icon.textContent = '🎂';
  } else {
    title.textContent = 'Waktunya habis! ⏰';
    msg.textContent = `Kamu nangkep ${gameScore} kue. Gapapa sengg, kamu tetep keren kokkk 🌷`;
    icon.textContent = '😅';
  }
}

function finishGame() {
  clearInterval(gameTimer);
  cancelAnimationFrame(gameAnimFrame);
  document.removeEventListener('keydown', onKey);
  document.removeEventListener('keyup', onKey);
  goToSlide('slide-cake');
}

// ============================================================
// BIRTHDAY CAKE SLIDE
// ============================================================
function initCakeSlide() {
  startConfetti();

  const darkOverlay = document.getElementById('darkOverlay');
  const msgEl = document.getElementById('messageText');

  // After 10 seconds, show message overlay
  setTimeout(() => {
    darkOverlay.style.opacity = '1';
    darkOverlay.style.pointerEvents = 'all';
    typeText('messageText', 'Aku ada sesuatu buat kamu', () => {
      // After 5s of message, go to flowers
      setTimeout(() => {
        stopConfetti();
        goToSlide('slide-flowers');
      }, 5000);
    });
  }, 10000);
}

// ============================================================
// CONFETTI
// ============================================================
let confettiAnimFrame = null;
let confettiParticles = [];

function startConfetti() {
  const canvas = document.getElementById('confettiCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  canvas.width = canvas.offsetWidth;
  canvas.height = canvas.offsetHeight;

  confettiParticles = [];
  const colors = ['#ff85a1', '#ffb3c6', '#ffd6e7', '#ff4d6d', '#ffd700', '#fff0f5', '#c9184a'];

  for (let i = 0; i < 130; i++) {
    confettiParticles.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height - canvas.height,
      w: 6 + Math.random() * 8,
      h: 4 + Math.random() * 6,
      color: colors[Math.floor(Math.random() * colors.length)],
      angle: Math.random() * 360,
      speed: 2 + Math.random() * 3,
      spin: (Math.random() - 0.5) * 8,
      drift: (Math.random() - 0.5) * 1.5,
    });
  }

  function drawConfetti() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    confettiParticles.forEach(p => {
      p.y += p.speed;
      p.x += p.drift;
      p.angle += p.spin;
      if (p.y > canvas.height) {
        p.y = -20;
        p.x = Math.random() * canvas.width;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.angle * Math.PI / 180);
      ctx.fillStyle = p.color;
      ctx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
      ctx.restore();
    });
    confettiAnimFrame = requestAnimationFrame(drawConfetti);
  }

  drawConfetti();
}

function stopConfetti() {
  if (confettiAnimFrame) cancelAnimationFrame(confettiAnimFrame);
  const canvas = document.getElementById('confettiCanvas');
  if (canvas) canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
}

// ============================================================
// AUDIO CONTROL FUNCTIONS
// ============================================================
let currentAudio = null; // Menyimpan audio yang sedang dimainkan

function startAudio(audioId, volume = 0.6, fadeDuration = 3000) {
  const audio = document.getElementById(audioId);
  if (!audio) return;

  // Hentikan audio yang sedang dimainkan (jika ada)
  if (currentAudio && currentAudio !== audio) {
    stopAudio(currentAudio.id, 2000); // Fade out audio sebelumnya
  }

  audio.volume = 0; // Setel volume awal ke 0
  audio.play().then(() => {
    fadeAudioIn(audio, 0, volume, fadeDuration); // Fade in audio baru
    currentAudio = audio; // Simpan audio yang sedang dimainkan
  }).catch(() => {
    console.log(`Audio autoplay blocked for ${audioId}`);
  });
}

function stopAudio(audioId, fadeDuration = 2000) {
  const audio = document.getElementById(audioId);
  if (!audio || audio.paused) return;

  fadeAudioOut(audio, fadeDuration); // Fade out audio
}

function fadeAudioIn(audio, from, to, duration) {
  const step = (to - from) / (duration / 50);
  let vol = from;
  const interval = setInterval(() => {
    vol = Math.min(to, vol + step);
    audio.volume = vol;
    if (vol >= to) clearInterval(interval);
  }, 50);
}

function fadeAudioOut(audio, duration) {
  const step = audio.volume / (duration / 50);
  const interval = setInterval(() => {
    audio.volume = Math.max(0, audio.volume - step);
    if (audio.volume <= 0) {
      audio.pause();
      clearInterval(interval);
    }
  }, 50);
}

// ============================================================
// FLOWER GARDEN (Slide 13) — Revised with petal shapes + butterfly paths
// ============================================================
function initFlowerGarden() {
  const garden = document.getElementById('flowerGarden');
  if (!garden) return;
  garden.innerHTML = '';

  const petalColors = [
    ['#ff85a1', '#ffb3c6'],  // pink
    ['#f48fb1', '#f8bbd0'],  // light rose
    ['#ce93d8', '#e1bee7'],  // lavender
    ['#ff8a65', '#ffccbc'],  // coral
    ['#fff176', '#fff9c4'],  // yellow
    ['#80cbc4', '#b2dfdb'],  // teal
  ];

  const count = 14;
  const stickyFlowerIndex = 6;

  for (let i = 0; i < count; i++) {
    const leftPct = 3 + (i / (count - 1)) * 94;
    const stemH = 100 + Math.random() * 110;
    const bloomDelay = (i * 0.18).toFixed(2);
    const swayDelay = (Math.random() * 3).toFixed(2);
    const swayMax = -(2 + Math.random() * 5);
    const swayMin = 2 + Math.random() * 5;
    const msBoomDur = (0.9 + Math.random() * 0.6).toFixed(2);
    const colors = petalColors[i % petalColors.length];
    const centerColor = '#FFC107';

    // Build 8 petals
    let petalsHtml = '';
    for (let p = 0; p < 8; p++) {
      petalsHtml += `<div class="petal-svg" style="background: linear-gradient(180deg, ${colors[0]}, ${colors[1]});"></div>`;
    }

    const flower = document.createElement('div');
    flower.className = 'garden-flower';
    flower.style.cssText = `left: ${leftPct}%; transform-origin: 50% 100%;`;
    flower.innerHTML = `
      <div class="flower-head-wrap">
        <div class="flower-petals" style="--bloom-dur:${msBoomDur}s; --bloom-delay:${bloomDelay}s; --sway-delay:${swayDelay}s; --sway-max:${swayMax}deg; --sway-min:${swayMin}deg;">
          ${petalsHtml}
          <div class="flower-center"></div>
        </div>
      </div>
      <div class="flower-stem" style="height:${stemH}px;"></div>
    `;

    garden.appendChild(flower);

    // Attach sticky note to special flower
    if (i === stickyFlowerIndex) {
      setTimeout(() => {
        const note = document.getElementById('stickyNote');
        if (note) {
          note.style.left = `${leftPct}%`;
          note.style.bottom = `${stemH + 65}px`;
          note.style.transform = 'translateX(-50%) rotate(-5deg)';
          note.style.display = 'block';
        }
      }, parseFloat(bloomDelay) * 1000 + 800);
    }
  }

  // Animate butterflies along Bezier paths using JS
  animateButterflies();
}

function animateButterflies() {
  // Define 3 distinct Bezier path parameterized as t ∈ [0,1]
  const paths = [
    // Path 1: sweeping left→right arc
    (t) => ({
      x: lerp(0.05, 0.9, t) * window.innerWidth,
      y: (0.25 + 0.15 * Math.sin(t * Math.PI * 2)) * window.innerHeight
    }),
    // Path 2: figure-8 style
    (t) => ({
      x: (0.5 + 0.4 * Math.sin(t * Math.PI * 2)) * window.innerWidth,
      y: (0.35 + 0.2 * Math.sin(t * Math.PI * 4)) * window.innerHeight
    }),
    // Path 3: slow wandering
    (t) => ({
      x: (0.5 + 0.45 * Math.cos(t * Math.PI * 2 + 1)) * window.innerWidth,
      y: (0.4 + 0.2 * Math.sin(t * Math.PI * 3 + 0.5)) * window.innerHeight
    }),
  ];

  const durations = [9000, 7000, 11000];
  const delays = [0, 2000, 4500];

  ['bf1', 'bf2', 'bf3'].forEach((id, idx) => {
    const el = document.getElementById(id);
    if (!el) return;
    const path = paths[idx];
    let startTime = null;
    const dur = durations[idx];

    function tick(ts) {
      if (!startTime) startTime = ts + delays[idx];
      if (ts < startTime) { requestAnimationFrame(tick); return; }
      const t = ((ts - startTime) % dur) / dur;  // 0→1 looping
      const pos = path(t);
      const posNext = path((((ts - startTime + 100) % dur) / dur));
      const goingLeft = posNext.x < pos.x;

      el.style.left = `${pos.x}px`;
      el.style.top = `${pos.y}px`;
      el.querySelector('.bf-emoji').style.transform = goingLeft ? 'scaleX(-1)' : 'scaleX(1)';

      requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
  });
}

function lerp(a, b, t) { return a + (b - a) * t; }

// ============================================================
// FADE TO BLACK
// ============================================================
function fadeToBlack() {
  stopBirthdayAudio();
  const overlay = document.getElementById('finalOverlay');
  if (overlay) {
    overlay.style.transition = 'opacity 2.5s ease';
    overlay.style.opacity = '1';
  }
}

// ============================================================
// UTILS
// ============================================================
// Expose goToSlide globally (used in HTML attributes)
window.goToSlide = goToSlide;
window.handleChoice1 = handleChoice1;
window.handleChoice2 = handleChoice2;
window.startMiniGame = startMiniGame;
window.finishGame = finishGame;

onload = () => {
  const c = setTimeout(() => {
    document.body.classList.remove("not-loaded");
    clearTimeout(c);
  }, 1000);
};