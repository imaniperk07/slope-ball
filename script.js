const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let score = 0;
let speed = 3;
let gameOver = false;

// Ball (stays near center)
const ball = {
  x: canvas.width / 2,
  y: canvas.height - 120,
  r: 10
};

// Track segments
let segments = [];
const segmentLength = 60;
const segmentWidth = 120;

// Input
const keys = {};
document.addEventListener("keydown", e => keys[e.key] = true);
document.addEventListener("keyup", e => keys[e.key] = false);

// Create initial track
for (let i = 0; i < 20; i++) {
  segments.push(createSegment(-i * segmentLength));
}

function createSegment(y) {
  return {
    y: y,
    xOffset: (Math.random() - 0.5) * 200
  };
}

// Update
function update() {
  if (gameOver) return;

  // Left / right steering
  if (keys["ArrowLeft"]) ball.x -= 5;
  if (keys["ArrowRight"]) ball.x += 5;

  // Move track forward
  for (let seg of segments) {
    seg.y += speed;
  }

  // Remove passed segments
  if (segments[0].y > canvas.height) {
    segments.shift();
    segments.push(createSegment(segments[segments.length - 1].y - segmentLength));
    score++;
  }

  // Collision check
  let onTrack = false;
  for (let seg of segments) {
    if (
      ball.y > seg.y &&
      ball.y < seg.y + segmentLength
    ) {
      const centerX = canvas.width / 2 + seg.xOffset;
      if (ball.x > centerX - segmentWidth / 2 &&
          ball.x < centerX + segmentWidth / 2) {
        onTrack = true;
      }
    }
  }

  if (!onTrack) gameOver = true;

  speed += 0.001;
  document.getElementById("score").innerText = "Score: " + score;
}

// Neon grid track
function drawSegment(seg) {
  const centerX = canvas.width / 2 + seg.xOffset;

  ctx.strokeStyle = "#00ff66";
  ctx.lineWidth = 2;

  // Side lines
  ctx.beginPath();
  ctx.moveTo(centerX - segmentWidth / 2, seg.y);
  ctx.lineTo(centerX - segmentWidth / 2, seg.y + segmentLength);
  ctx.stroke();

  ctx.beginPath();
  ctx.moveTo(centerX + segmentWidth / 2, seg.y);
  ctx.lineTo(centerX + segmentWidth / 2, seg.y + segmentLength);
  ctx.stroke();

  // Grid lines
  for (let i = 0; i <= 6; i++) {
    ctx.beginPath();
    ctx.moveTo(centerX - segmentWidth / 2 + i * (segmentWidth / 6), seg.y);
    ctx.lineTo(centerX - segmentWidth / 2 + i * (segmentWidth / 6), seg.y + segmentLength);
    ctx.stroke();
  }
}

// Draw
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // Track
  for (let seg of segments) {
    drawSegment(seg);
  }

  // Ball
  ctx.fillStyle = "#00ff66";
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.r, 0, Math.PI * 2);
  ctx.fill();

  if (gameOver) {
    ctx.fillStyle = "white";
    ctx.font = "32px Arial";
    ctx.fillText("GAME OVER", 200, 250);
  }
}

// Loop
function loop() {
  update();
  draw();
  requestAnimationFrame(loop);
}
loop();
``
