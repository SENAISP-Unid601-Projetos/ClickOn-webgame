// --- BACKGROUND ANIMATION (LEAVES) ---
const canvas = document.getElementById("background");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const leafCount = 40;
const leaves = [];
// Define leaf shape
const leafShape = new Path2D("M10 0 C15 10, 15 25, 10 30 C5 25, 5 10, 10 0 Z");

// Initialize leaves
for (let i = 0; i < leafCount; i++) {
  leaves.push({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 0.6 + 0.3,
    speedX: (Math.random() - 0.5) * 0.5,
    speedY: Math.random() * 0.6 + 0.2,
    rot: Math.random() * Math.PI,
    color: Math.random() > 0.5 ? "#B5CC9FAA" : "#5D7D47AA"
  });
}

// Draw Loop for Background
function drawLeaves() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  for (let leaf of leaves) {
    ctx.save();
    ctx.translate(leaf.x, leaf.y);
    ctx.rotate(leaf.rot);
    ctx.scale(leaf.size, leaf.size);
    ctx.fillStyle = leaf.color;
    ctx.fill(leafShape);
    ctx.restore();

    leaf.y += leaf.speedY;
    leaf.x += leaf.speedX;
    leaf.rot += 0.01;

    // Reset leaf if it goes off screen
    if (leaf.y > canvas.height + 20) {
      leaf.y = -20;
      leaf.x = Math.random() * canvas.width;
    }
  }
  requestAnimationFrame(drawLeaves);
}

// Start Background
drawLeaves();

// Handle Resize
window.addEventListener("resize", () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
});


// --- CUTSCENE CLASS ---
class SimpleCutscene {
  constructor(ctx, imagePaths, onComplete) {
    this.ctx = ctx;
    this.canvas = ctx.canvas;
    this.images = [];
    this.imagePaths = imagePaths;
    this.currentScene = 0;
    this.alpha = 0;
    this.fadeSpeed = 0.01;
    this.timer = 0;
    this.holdTime = 150; // How long to stay on one image
    this.onComplete = onComplete;
    this.finished = false;

    this.sceneTexts = [
      "Tudo começou com um problema que poucos se importavam em resolver...",
      "Em vez de descartar, Diego decidiu recuperar. Um simples gesto acendeu uma grande ideia!",
      "Entre faíscas e ideias, um propósito começou a ganhar forma.",
      "Daquilo que foi descartado, nascia algo novo e cheio de significado... ",
      "De um campo de sucata a um futuro verde, transformando lixo em inovação!"
    ];
  }

  loadImages(callback) {
    let loaded = 0;
    this.imagePaths.forEach((src, i) => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        this.images[i] = img;
        loaded++;
        if (loaded === this.imagePaths.length) callback();
      };
      // Handle error in case image is missing
      img.onerror = () => {
        console.error("Failed to load image:", src);
        loaded++;
        if (loaded === this.imagePaths.length) callback();
      }
    });
  }

  updateAndDraw() {
    if (this.finished) return;

    const img = this.images[this.currentScene];
    if (!img) return;

    // Clear previous frame
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Fade In Logic
    if (this.alpha < 1) {
        this.alpha += this.fadeSpeed;
    } else {
        this.timer++;
    }

    // Draw Image
    this.ctx.globalAlpha = this.alpha;
    this.ctx.drawImage(img, 0, 0, this.canvas.width, this.canvas.height);
    this.ctx.globalAlpha = 1;

    // Draw Text
    this.drawSceneText(this.sceneTexts[this.currentScene], this.alpha);

    // Transition Logic
    if (this.timer >= this.holdTime) {
      this.currentScene++;
      this.alpha = 0;
      this.timer = 0;
    }

    // Check if End
    if (this.currentScene >= this.images.length) {
      this.finished = true;
      if (this.onComplete) this.onComplete();
    }
  }

  drawSceneText(text, alpha) {
    if (!text) return;
    const ctx = this.ctx;
    ctx.globalAlpha = Math.min(alpha, 1);
    ctx.fillStyle = "white";
    ctx.font = "30px monospace";
    ctx.textAlign = "center";
    ctx.textBaseline = "bottom";
    ctx.shadowColor = "black";
    ctx.shadowBlur = 4;

    const x = this.canvas.width / 2;
    const y = this.canvas.height - 30;
    const maxWidth = this.canvas.width - 60;
    const lines = this.wrapText(ctx, text, maxWidth);
    const lineHeight = 35;

    lines.forEach((line, i) => {
      ctx.fillText(line, x, y - (lines.length - 1 - i) * lineHeight);
    });

    ctx.globalAlpha = 1;
    ctx.shadowBlur = 0;
  }

  wrapText(ctx, text, maxWidth) {
    const words = text.split(" ");
    const lines = [];
    let currentLine = "";

    for (let i = 0; i < words.length; i++) {
      const testLine = currentLine + words[i] + " ";
      const testWidth = ctx.measureText(testLine).width;
      if (testWidth > maxWidth && i > 0) {
        lines.push(currentLine.trim());
        currentLine = words[i] + " ";
      } else {
        currentLine = testLine;
      }
    }
    lines.push(currentLine.trim());
    return lines;
  }
}


// --- MAIN LOGIC ---
const btnPlay = document.getElementById("btn-play");
const menuContainer = document.getElementById("menuContainer");
const cutsceneCanvas = document.getElementById("cutsceneCanvas");

if (btnPlay) {
    btnPlay.addEventListener("click", (event) => {
      event.preventDefault();
      
      // Hide Menu, Show Cutscene
      if(menuContainer) menuContainer.style.display = "none";
      if(cutsceneCanvas) cutsceneCanvas.style.display = "block";

      const ctx2 = cutsceneCanvas.getContext("2d");
      cutsceneCanvas.width = window.innerWidth;
      cutsceneCanvas.height = window.innerHeight;

      const cutsceneImages = [
        "./IMG/cutscene1.png",
        "./IMG/cutscene2.png",
        "./IMG/cutscene3.png",
        "./IMG/cutscene4.png",
        "./IMG/cutscene5.png"
      ];

      const cutscene = new SimpleCutscene(ctx2, cutsceneImages, () => {
        console.log("Cutscene terminada! Iniciando jogo...");
        // Use relative path to make it work in any folder environment
        window.location.href = "./inicio.html"; 
      });

      cutscene.loadImages(() => {
        function playCutscene() {
          cutscene.updateAndDraw();
          if (!cutscene.finished) {
            requestAnimationFrame(playCutscene);
          }
        }
        playCutscene();
      });
    });
} else {
    console.error("Botão Play não encontrado!");
}