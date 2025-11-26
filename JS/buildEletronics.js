// ===============================
// CONFIGURAÇÃO GERAL
// ===============================
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

let currentGame = "celular"; // alterna entre celular, notebook e pc
let fading = false;
let fadeAlpha = 0;

// ===============================
// DADOS DO CELULAR
// ===============================
const phoneParts = [
    { name: 'placa_mae', x: 100, y: 620, width: 300, height: 150, color: '#4a4a4a', correctX: 250, correctY: 200 },
    { name: 'bateria', x: 450, y: 620, width: 120, height: 100, color: '#2c3e50', correctX: 300, correctY: 400 },
    { name: 'camera', x: 700, y: 100, width: 60, height: 60, color: '#1a1a1a', correctX: 450, correctY: 150 },
    { name: 'conector_carregador', x: 700, y: 250, width: 80, height: 30, color: '#7f8c8d', correctX: 350, correctY: 550 },
    { name: 'tela', x: 50, y: 100, width: 320, height: 500, color: '#34495e', correctX: 240, correctY: 50, locked: true }
];

// ===============================
// DADOS DO NOTEBOOK
// ===============================
const notebookParts = [
    { name: 'placa_mae', x: 100, y: 600, width: 350, height: 200, color: '#4a4a4a', correctX: 250, correctY: 250 },
    { name: 'bateria', x: 500, y: 600, width: 200, height: 80, color: '#2c3e50', correctX: 300, correctY: 480 },
    { name: 'cooler', x: 700, y: 150, width: 80, height: 80, color: '#1a1a1a', correctX: 450, correctY: 300 },
    { name: 'teclado', x: 50, y: 100, width: 300, height: 120, color: '#7f8c8d', correctX: 260, correctY: 360 },
    { name: 'tela', x: 700, y: 400, width: 350, height: 120, color: '#34495e', correctX: 240, correctY: 50, locked: true }
];

// ===============================
// DADOS DO PC
// ===============================
const pcParts = [
    { name: 'placa_mae', x: 600, y: 550, width: 300, height: 180, color: '#4a4a4a', correctX: 260, correctY: 250 },
    { name: 'processador', x: 100, y: 620, width: 80, height: 80, color: '#8e44ad', correctX: 330, correctY: 300 },
    { name: 'placa_de_video', x: 700, y: 100, width: 200, height: 80, color: '#16a085', correctX: 280, correctY: 400 },
    { name: 'fonte', x: 50, y: 300, width: 120, height: 120, color: '#2c3e50', correctX: 500, correctY: 420 },
    { name: 'gabinete', x: 50, y: 100, width: 250, height: 180, color: '#7f8c8d', correctX: 240, correctY: 180, locked: true }
];

// ===============================
// ESTADO DO JOGO
// ===============================
const gameState = {
    phase: 'selecting',
    currentPiece: null,
    placedPieces: [],
    pieces: [],
    completed: false
};

// ===============================
// FUNÇÕES DE CONFIGURAÇÃO
// ===============================
function getCurrentParts() {
    if (currentGame === "celular") return phoneParts;
    if (currentGame === "notebook") return notebookParts;
    return pcParts;
}

function initPieces() {
    gameState.pieces = getCurrentParts().map(piece => ({
        ...piece,
        dragged: false,
        placed: false
    }));
    gameState.placedPieces = [];
    gameState.completed = false;
}

// ===============================
// FUNÇÕES DE DESENHO
// ===============================
function drawBaseFrame() {
    ctx.strokeStyle = '#333';
    ctx.lineWidth = 3;
    ctx.strokeRect(200, 50, 500, 550); // área central do "equipamento"
    ctx.fillStyle = 'rgba(200, 200, 200, 0.3)';
    getCurrentParts().forEach(part => {
        ctx.fillRect(part.correctX, part.correctY, part.width, part.height);
    });
}

function drawPieces() {
    gameState.pieces.forEach(piece => {
        if (!piece.placed) {
            ctx.fillStyle = piece.color;
            ctx.fillRect(piece.x, piece.y, piece.width, piece.height);
            ctx.fillStyle = '#fff';
            ctx.font = '12px Arial';
            ctx.fillText(piece.name, piece.x + 5, piece.y + 15);
        }
    });

    gameState.placedPieces.forEach(piece => {
        ctx.fillStyle = piece.color;
        ctx.fillRect(piece.correctX, piece.correctY, piece.width, piece.height);
    });
}

// ===============================
// INTERAÇÃO E LÓGICA
// ===============================
function getPieceAt(x, y) {
    for (let i = gameState.pieces.length - 1; i >= 0; i--) {
        const piece = gameState.pieces[i];
        if (!piece.placed && x >= piece.x && x <= piece.x + piece.width && y >= piece.y && y <= piece.y + piece.height) {
            return piece;
        }
    }
    return null;
}

function isInCorrectPosition(piece, x, y) {
    const tolerance = 20;
    return Math.abs(x - piece.correctX) < tolerance &&
           Math.abs(y - piece.correctY) < tolerance;
}

function checkCompletion() {
    if (gameState.placedPieces.length === getCurrentParts().length - 1) {
        const lastPiece = gameState.pieces.find(p => p.locked);
        if (lastPiece && !lastPiece.placed) lastPiece.locked = false;
    }

    if (gameState.placedPieces.length === getCurrentParts().length) {
        gameState.completed = true;
    }
}

// ===============================
// INTERFACE VISUAL
// ===============================
function drawUI() {
    if (gameState.completed) {
        ctx.fillStyle = 'rgba(0,0,0,0.7)';
        ctx.fillRect(200, 250, 500, 150);
        ctx.fillStyle = '#fff';
        ctx.font = '28px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(
            currentGame === "celular" ? "Celular Montado com Sucesso!" :
            currentGame === "notebook" ? "Notebook Montado com Sucesso!" :
            "PC Montado com Sucesso!",
            450, 310
        );

        ctx.font = '20px Arial';
        ctx.fillText(
            currentGame === "celular" ? "Clique para ir ao Notebook" :
            currentGame === "notebook" ? "Clique para ir ao PC" :
            "Clique para reiniciar (volta ao Celular)",
            450, 345
        );
        ctx.textAlign = 'start';
    }

    ctx.fillStyle = "#333";
    ctx.font = "22px Arial";
    ctx.fillText(
        currentGame === "celular" ? "🧩 Montagem do CELULAR" :
        currentGame === "notebook" ? "💻 Montagem do NOTEBOOK" :
        "🖥️ Montagem do PC",
        320, 30
    );
}

// ===============================
// TRANSIÇÃO VISUAL
// ===============================
function fadeToNext() {
    fading = true;
}

function drawFade() {
    if (fading) {
        fadeAlpha += 0.02;
        ctx.fillStyle = `rgba(0,0,0,${fadeAlpha})`;
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        if (fadeAlpha >= 1) {
            if (currentGame === "celular") currentGame = "notebook";
            else if (currentGame === "notebook") currentGame = "pc";
            else currentGame = "celular";

            initPieces();
            fading = false;
            fadeAlpha = 0;
        }
    }
}

// ===============================
// EVENTOS DO MOUSE
// ===============================
canvas.addEventListener('mousedown', e => {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (gameState.completed) {
        fadeToNext();
        return;
    }

    const piece = getPieceAt(x, y);
    if (piece && !piece.locked) {
        gameState.phase = 'dragging';
        gameState.currentPiece = piece;
        piece.dragged = true;
        piece.offsetX = x - piece.x;
        piece.offsetY = y - piece.y;
    }
});

canvas.addEventListener('mousemove', e => {
    if (gameState.phase === 'dragging' && gameState.currentPiece) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        gameState.currentPiece.x = x - gameState.currentPiece.offsetX;
        gameState.currentPiece.y = y - gameState.currentPiece.offsetY;
    }
});

canvas.addEventListener('mouseup', e => {
    if (gameState.phase === 'dragging' && gameState.currentPiece) {
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left - gameState.currentPiece.offsetX;
        const y = e.clientY - rect.top - gameState.currentPiece.offsetY;

        if (isInCorrectPosition(gameState.currentPiece, x, y)) {
            gameState.currentPiece.placed = true;
            gameState.placedPieces.push(gameState.currentPiece);
            gameState.pieces = gameState.pieces.filter(p => p !== gameState.currentPiece);
            checkCompletion();
        }

        gameState.currentPiece = null;
        gameState.phase = 'selecting';
    }
});

// ===============================
// LOOP PRINCIPAL
// ===============================
function gameLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBaseFrame();
    drawPieces();
    drawUI();
    drawFade();
    requestAnimationFrame(gameLoop);
}

initPieces();
gameLoop();