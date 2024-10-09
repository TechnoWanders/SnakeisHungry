//SOME ADJUSTMENTS
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
startScreen();
const replayer = document.getElementById('replay');
replayer.style.display = 'none';
const scoreLabel = document.getElementById('score');

// Start Screen
function startScreen() {
    const img = new Image();
    img.src = './media/images/snakegame3.jpeg';
    img.onload = function() {
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    };
}

// GAMEPLAY


// 0. Gameplay button 
const gamebtn = document.getElementById('play');
gamebtn.addEventListener('click', function() {
    gamebtn.style.display = 'none';
    replayer.style.display = 'block';
    startGame();
});

// 1. GRID LAYOUT
const grass = {
    1: './media/assets/grass4.png',
    2: './media/assets/grass5.png',
    3: './media/assets/head0.png',
    4: './media/assets/body0.png',
    5: './media/assets/food.png'
};

const cols = 23;
const rows = 15;
const tileSize = 43;

const tileMap = [
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1],
    [2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [1, 2, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 2, 1, 1, 2],
    [2, 1, 2, 1, 2, 2, 2, 1, 2, 1, 2, 1, 2, 1, 2, 1, 1, 2, 2, 1, 2, 2, 1],
    [1, 2, 1, 2, 2, 1, 2, 2, 2, 1, 1, 1, 2, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1],
    [2, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 1, 1, 2, 1, 2, 1, 2, 1, 2, 1, 2],
    [1, 2, 1, 2, 2, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 1],
    [2, 1, 2, 1, 1, 2, 1, 1, 1, 2, 2, 2, 2, 2, 1, 1, 1, 2, 2, 1, 1, 1, 2],
    [1, 2, 1, 2, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 2, 1, 2, 1, 1, 1, 2, 2, 1],
    [2, 1, 2, 1, 2, 1, 2, 2, 2, 1, 2, 2, 1, 1, 2, 2, 2, 1, 2, 2, 1, 1, 2],
    [1, 2, 1, 2, 1, 2, 2, 1, 1, 1, 2, 2, 2, 1, 1, 2, 1, 1, 2, 2, 2, 1, 1],
    [2, 1, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 2, 2, 1, 1, 2, 2, 1, 2, 1, 2],
    [1, 2, 1, 2, 2, 2, 1, 2, 1, 1, 1, 1, 2, 2, 1, 1, 1, 2, 1, 1, 2, 2, 1]
];

// Load the images and store them in a dictionary
const tileImages = {};
let imagesLoaded = 0; // Track loaded images

for (let tileType in grass) {
    const img = new Image();
    img.src = grass[tileType];
    img.onload = function() {
        tileImages[tileType] = img;
        imagesLoaded++;
        // Start drawing the tile map only when all images are loaded
        if (imagesLoaded === Object.keys(grass).length) {
            drawTileMap();
        }
    };
}

//SNAKE IS BORN 
let snake = [
    {x:1, y:0},
    {x:0, y:0}
];
let food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
let direction = {x:1, y:0};
const snakeHeadImage = new Image();
snakeHeadImage.src = './media/assets/head0.png';
const snakeBodyImage = new Image();
snakeBodyImage.src = './media/assets/body0.png';
const foodImage = new Image();
foodImage.src = './media/assets/food.png';
//START GAME 
function startGame(){
    gameLoop();
}

//DRAW SNAKE
function drawSnake(){
    for(let i=0; i<snake.length; i++){
        const segment = snake[i];
        const img = i === 0 ? snakeHeadImage : snakeBodyImage;
        ctx.drawImage(img, segment.x * tileSize, segment.y * tileSize, tileSize, tileSize);
    }
}

//FOOD PLACEMENT
function drawFood(){
    ctx.drawImage(foodImage, food.x * tileSize, food.y * tileSize, tileSize, tileSize);
}

//DIRECTION
function moveSnake(){
    const newHead = { x: snake[0].x + direction.x, y: snake[0].y + direction.y };
    snake.unshift(newHead); // Add new head
    snake.pop(); // Remove last segment
}

//FOOD COLLISION
function checkFoodCollision() {
    if (snake[0].x === food.x && snake[0].y === food.y) {
        // Grow the snake
        snake.push({}); // Add a new segment at the tail
        score+=1;
        speed-=10;
        updateScore();
        // Reposition food
        food = { x: Math.floor(Math.random() * cols), y: Math.floor(Math.random() * rows) };
    }
}

// FUNCTION TO DRAW THE TILEMAP
function drawTileMap() {
    ctx.clearRect(0, 0, canvas.width, canvas.height); // Clear the canvas before redrawing

    for (let row = 0; row < tileMap.length; row++) {
        for (let col = 0; col < tileMap[row].length; col++) {
            const tileType = tileMap[row][col];
            const x = col * tileSize;
            const y = row * tileSize;

            // Draw the image corresponding to the tile type
            if (tileImages[tileType]) {
                ctx.drawImage(tileImages[tileType], x, y, tileSize, tileSize);
            }
        }
    }
}

function checkWallCollision() {
    const head = snake[0];
    //return head.x < 0 || head.x >= cols || head.y < 0 || head.y >= rows;
    if(head.x<0){snake[0].x = cols-1;}
    else if(head.x>=cols){snake[0].x = 0;}

    if(head.y<0){snake[0].y = rows-1;}
    else if(head.y>=rows){snake[0].y = 0;}
}

function checkSelfCollision() {
    const head = snake[0];
    // Check if the head collides with any segment of the snake
    for (let i = 1; i < snake.length; i++) {
        if (head.x === snake[i].x && head.y === snake[i].y) {
            return true; // Collision detected
        }
    }
    return false; // No collision
}

let score = 0;
let speed = 200;
let lastUpdateTime = 0;

function gameLoop(currentTime) {
    //ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawTileMap();

    const timeSinceLastUpdate = currentTime - lastUpdateTime;
    if (timeSinceLastUpdate >= speed) {
        moveSnake();
        lastUpdateTime = currentTime;
    }
    
    if(checkSelfCollision()) {
        canvas.style.display = 'none';
        scoreLabel.style.top = '50%';
        scoreLabel.style.left = '50%';
        scoreLabel.style.transform = 'translate(-50%, -50%)';
        scoreLabel.style.animation = 'flicker 0.15s infinite';
    }

    checkWallCollision();
    checkFoodCollision();
    drawSnake();
    drawFood();
    requestAnimationFrame(gameLoop);
}

//handling inputs
window.addEventListener('keydown', (e) => {
    switch (e.key) {
        case 'ArrowUp':
            if (direction.y === 0) {
                direction = { x: 0, y: -1 }; // Move up
            }
            break;
        case 'ArrowDown':
            if (direction.y === 0) {
                direction = { x: 0, y: 1 }; // Move down
            }
            break;
        case 'ArrowLeft':
            if (direction.x === 0) {
                direction = { x: -1, y: 0 }; // Move left
            }
            break;
        case 'ArrowRight':
            if (direction.x === 0) {
                direction = { x: 1, y: 0 }; // Move right
            }
            break;
    }
});

//REPLAY BUTTON IS CLICKED 
replayer.addEventListener('click',()=>{
    location.reload();
});


//AUDIO PART 
const voiceAudio = document.getElementById('voice');
voiceAudio.play();

//AUDIO BUTTON 
const audio = document.getElementById('aud');
const vol_btn = document.getElementById('vol');

audio.addEventListener('click', function(){
    if(voiceAudio.paused){
        voiceAudio.play();
        vol_btn.src = './media/images/volumeon.png';
    } else {
        voiceAudio.pause();
        vol_btn.src = './media/images/volumeoff.png';
    }
});

//DISPLAYING SCORE
function updateScore(){
    scoreLabel.textContent = `Score: ${score}`;
}

