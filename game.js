const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

const box = 40;
let snake, direction, food, game;

canvas.width = box * 20;  // عدد المربعات في العرض
canvas.height = box * 20; // عدد المربعات في الطول

// تحميل الصور
const arenaImg = new Image();
arenaImg.src = "pinko.jpg";

const headImg = new Image();
headImg.src = "snake.jpg";

const foodImg = new Image();
foodImg.src = "strobry.jpg";

function init() {
  document.getElementById("gameOverMsg").style.display = "none"; // اخفاء الرسالة عند البداية
  snake = [{ x: 9 * box, y: 10 * box }];
  direction = null;

  // هنا كان عندك خطأ {} مفقودة
  food = {
    x: Math.floor(Math.random() * 19) * box,
    y: Math.floor(Math.random() * 19) * box,
  };

  if (game) clearInterval(game);
  game = setInterval(draw, 100);
}

document.addEventListener("keydown", function (event) {
  if (event.key === "ArrowUp" && direction !== "DOWN") direction = "UP";
  else if (event.key === "ArrowDown" && direction !== "UP") direction = "DOWN";
  else if (event.key === "ArrowLeft" && direction !== "RIGHT") direction = "LEFT";
  else if (event.key === "ArrowRight" && direction !== "LEFT") direction = "RIGHT";
});

function draw() {
  // رسم الخلفية
  if (arenaImg.complete) {
    ctx.drawImage(arenaImg, 0, 0, canvas.width, canvas.height);
  } else {
    ctx.fillStyle = "#dff9fb";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
  }

  // رسم الأكل
  if (foodImg.complete) {
    ctx.drawImage(foodImg, food.x, food.y, box, box);
  } else {
    ctx.fillStyle = "red";
    ctx.fillRect(food.x, food.y, box, box);
  }

  // رسم الدودة
  for (let i = 0; i < snake.length; i++) {
    if (i === 0) {
      if (headImg.complete) {
        ctx.drawImage(headImg, snake[i].x, snake[i].y, box, box);
      } else {
        ctx.fillStyle = "blue";
        ctx.fillRect(snake[i].x, snake[i].y, box, box);
      }
    } else {
      ctx.fillStyle = "lightpink";
      ctx.fillRect(snake[i].x, snake[i].y, box, box);
    }
  }

  // موقع رأس الدودة
  let snakeX = snake[0].x;
  let snakeY = snake[0].y;

  if (direction === "UP") snakeY -= box;
  if (direction === "DOWN") snakeY += box;
  if (direction === "LEFT") snakeX -= box;
  if (direction === "RIGHT") snakeX += box;

  // لو أكلت الطعام
  if (snakeX === food.x && snakeY === food.y) {
    food = {
      x: Math.floor(Math.random() * 19) * box,
      y: Math.floor(Math.random() * 19) * box,
    };
  } else {
    snake.pop();
  }

  let newHead = { x: snakeX, y: snakeY };

  // التحقق من الخسارة (كان ناقص || بين الشروط)
  if (
    snakeX < 0 ||
    snakeY < 0 ||
    snakeX >= canvas.width ||
    snakeY >= canvas.height ||
    collision(newHead, snake)
  ) {
    clearInterval(game);
    document.getElementById("gameOverMsg").style.display = "block";
    return;
  }

  snake.unshift(newHead);
}

function collision(head, array) {
  for (let i = 0; i < array.length; i++) {
    if (head.x === array[i].x && head.y === array[i].y) {
      return true;
    }
  }
  return false;
}

document.getElementById("restartBtn").addEventListener("click", init);

// تشغيل اللعبة لأول مرة
init();