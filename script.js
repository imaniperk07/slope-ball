const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let gameOver = false;

// Ball
const ball = {
    x: canvas.width / 2,
    y: canvas.height - 60,
    radius: 10,
    speedX: 0
};

// Platforms
let platforms = [];
const platformWidth = 80;
const platformHeight = 12;
const platformSpeed = 2;

// Create starting platforms
for (let i = 0; i < 6; i++) {
    platforms.push({
        x: Math.random() * (canvas.width - platformWidth),
        y: i * 70
    });
}

// Keyboard controls
const keys = {};

document.addEventListener("keydown", e => {
    keys[e.key] = true;
});

document.addEventListener("keyup", e => {
    keys[e.key] = false;
});

// Update game
function update() {
    if (gameOver) return;

    // Ball movement
    if (keys["ArrowLeft"]) ball.speedX = -4;
    else if (keys["ArrowRight"]) ball.speedX = 4;
    else ball.speedX = 0;

    ball.x += ball.speedX;

    // Keep ball on screen
    if (ball.x < 0) gameOver = true;
    if (ball.x > canvas.width) gameOver = true;

    // Move platforms
    for (let p of platforms) {
        p.y += platformSpeed;

        // Reset platform
        if (p.y > canvas.height) {
            p.y = -platformHeight;
            p.x = Math.random() * (canvas.width - platformWidth);
            score++;
        }
    }

    // Collision detection
    let onPlatform = false;
    for (let p of platforms) {
        if (
            ball.y + ball.radius > p.y &&
            ball.y + ball.radius < p.y + platformHeight &&
            ball.x > p.x &&
            ball.x < p.x + platformWidth
        ) {
            onPlatform = true;
        }
    }

    if (!onPlatform) {
        ball.y += 4;
    } else {
        ball.y = canvas.height - 60;
    }

    // Fall off bottom
    if (ball.y > canvas.height) {
        gameOver = true;
    }

    document.getElementById("score").textContent = "Score: " + score;
}

// Draw everything
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Ball
    ctx.fillStyle = "red";
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    ctx.fill();

    // Platforms
    ctx.fillStyle = "#0f0";
    for (let p of platforms) {
        ctx.fillRect(p.x, p.y, platformWidth, platformHeight);
    }

    // Game over text
    if (gameOver) {
        ctx.fillStyle = "white";
        ctx.font = "30px Arial";
        ctx.fillText("GAME OVER", 180, 200);
    }
}

// Game loop
function loop() {
    update();
    draw();
    requestAnimationFrame(loop);
}

loop();
``
