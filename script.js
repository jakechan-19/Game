const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const menu = document.getElementById("menu");
const startBtn = document.getElementById("startBtn");
const restartText = document.getElementById("restartText");
const preloader = document.getElementById("preloader");
const playBtn = document.getElementById("playBtn");

const bgMusic = new Audio("https://github.com/Akayosan/Game/raw/refs/heads/main/soundgame.mp3");
const flySound = new Audio("https://github.com/Akayosan/Game/raw/refs/heads/main/fly.mp3");

bgMusic.loop = true;
let isMusicPlaying = false;

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let selectedCharacter = null;
let characterImage = new Image();
let gameStarted = false;
let gameOver = false;
let score = 0;
let highScore = localStorage.getItem("highScore") || 0;

let player = { x: 100, y: canvas.height / 2, width: 100, height: 100, gravity: 0.5, lift: -12, velocity: 0 };
let birds = [];
let clouds = [];

// Gambar burung
let bird1 = new Image();
let bird2 = new Image();
bird1.src = "https://raw.githubusercontent.com/Akayosan/Game/refs/heads/main/2145419_ee755.gif";
bird2.src = "https://raw.githubusercontent.com/Akayosan/Game/refs/heads/main/18-28-27-198_512.gif";
let currentBird = bird1;

setInterval(() => {
    currentBird = currentBird === bird1 ? bird2 : bird1;
}, 10000);

// Tambahkan awan latar belakang
for (let i = 0; i < 7; i++) {
    clouds.push({
        x: Math.random() * canvas.width,
        y: Math.random() * (canvas.height / 2),
        speed: 1 + Math.random() * 1.5
    });
}

// Event Listener
document.addEventListener("keydown", fly);
document.addEventListener("click", fly);
document.addEventListener("touchstart", fly);

playBtn.addEventListener("click", () => {
    preloader.style.display = "none";
    menu.style.display = "flex";

    if (!isMusicPlaying) {
        bgMusic.play();
        isMusicPlaying = true;
    }
});

function selectCharacter(choice) {
    selectedCharacter = choice;
    characterImage.src = choice === 1
        ? "https://raw.githubusercontent.com/Akayosan/Game/refs/heads/main/Picsart_25-03-03_14-53-19-212.png"
        : "https://raw.githubusercontent.com/Akayosan/Game/refs/heads/main/Picsart_25-03-03_14-52-34-347.png";

    startBtn.style.display = "block";
}

function startGame() {
    menu.style.display = "none";
    canvas.style.display = "block";
    gameStarted = true;
    gameOver = false;
    score = 0;
    birds = [];
    player.y = canvas.height / 2;

    gameLoop();
}

function fly() {
    if (!gameStarted) return;

    if (!gameOver) {
        player.velocity = player.lift;
        flySound.currentTime = 0;
        flySound.play();
    } else {
        restartGame();
    }
}

function spawnBird() {
    birds.push({
        x: canvas.width,
        y: Math.random() * (canvas.height - 100),
        size: 80,
        speed: 3
    });
}
setInterval(spawnBird, 2000);

function drawClouds() {
    clouds.forEach(cloud => {
        ctx.font = "50px Arial";
        ctx.fillText("☁️", cloud.x, cloud.y);
        cloud.x -= cloud.speed;

        if (cloud.x < -50) {
            cloud.x = canvas.width;
            cloud.y = Math.random() * (canvas.height / 2);
        }
    });
}

function gameLoop() {
    if (!gameStarted) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawClouds();

    player.velocity += player.gravity;
    player.y += player.velocity;
    ctx.drawImage(characterImage, player.x, player.y, 100, 100);

    birds.forEach((bird, index) => {
        ctx.drawImage(currentBird, bird.x, bird.y, 80, 80);
        bird.x -= bird.speed;

        if (player.x < bird.x + bird.size &&
            player.x + player.width > bird.x &&
            player.y < bird.y + bird.size &&
            player.y + player.height > bird.y) {
            endGame();
        }

        if (bird.x + bird.size < 0) {
            birds.splice(index, 1);
            score++;
        }
    });

    ctx.fillStyle = "black";
    ctx.font = "30px Arial";
    ctx.fillText("Score: " + score, 20, 40);
    ctx.fillText("High Score: " + highScore, 20, 80);

    if (!gameOver) {
        requestAnimationFrame(gameLoop);
    }
}

function endGame() {
    gameOver = true;
    restartText.style.display = "block";
}

function restartGame() {
    menu.style.display = "flex";
    canvas.style.display = "none";
    restartText.style.display = "none";
    gameOver = false;
}