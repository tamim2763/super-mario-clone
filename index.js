// Super Mario Clone - Main Game Script
// This file will contain the game loop and core game logic

// Get the canvas and context
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Key state tracking
const keys = {
    ArrowRight: false,
    ArrowLeft: false
};

// Player properties
const player = {
    x: canvas.width / 2 - 15, // Start in the middle horizontally (subtract half width)
    y: canvas.height - 100,   // Start near the bottom vertically
    width: 30,
    height: 50,
    color: 'red',
    velocity: 5,
    velocityY: 0,
    isOnGround: false
};

// Platforms array
const platforms = [
    { x: 200, y: 500, width: 200, height: 20 },
    { x: 500, y: 400, width: 150, height: 20 },
    { x: 900, y: 300, width: 200, height: 20 },
    { x: 1300, y: 500, width: 100, height: 20 },
    { x: 1500, y: 400, width: 250, height: 20 }
];

// Goal object
const goal = {
    x: 1800,
    y: 300,
    width: 20,
    height: 100
};

// Gravity constant
const gravity = 0.5;

// Scroll offset for camera
let scrollOffset = 0;

// Game state
let gameRunning = false;

// Initialize the game
function init() {
    console.log('Super Mario Clone initialized!');
    gameRunning = true;
    
    // Start the game loop
    gameLoop();
}

// Main game loop
function gameLoop() {
    if (!gameRunning) return;
    
    // Clear the canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Draw background
    drawBackground();
    
    // Update game logic here (will be implemented later)
    update();
    
    // Draw game objects here (will be implemented later)
    draw();
    
    // Continue the loop
    requestAnimationFrame(gameLoop);
}

// Draw the background
function drawBackground() {
    // Enhanced sky gradient
    const gradient = ctx.createLinearGradient(0, 0, 0, canvas.height);
    gradient.addColorStop(0, '#4facfe');
    gradient.addColorStop(0.3, '#00f2fe');
    gradient.addColorStop(0.6, '#43e97b');
    gradient.addColorStop(0.8, '#38f9d7');
    gradient.addColorStop(1, '#2dd4bf');
    
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

// Update game logic
function update() {
    // Reset ground state
    player.isOnGround = false;
    
    // Apply gravity
    player.velocityY += gravity;
    
    // Apply vertical movement
    player.y += player.velocityY;
    
    // Platform collision
    platforms.forEach(platform => {
        if (player.velocityY > 0 && 
            player.y + player.height + player.velocityY >= platform.y && 
            player.y + player.height - player.velocityY <= platform.y && 
            player.x + player.width > platform.x && 
            player.x < platform.x + platform.width) {
            player.y = platform.y - player.height;
            player.velocityY = 0;
            player.isOnGround = true;
            return;
        }
    });
    // Ground collision
    if (player.y + player.height > canvas.height) {
        resetGame();
    }
    
    // Screen boundaries
    if (player.x < 0) {
        player.x = 0;
    }
    
    // Handle horizontal movement
    if (keys.ArrowRight) {
        player.x += player.velocity;
    }
    if (keys.ArrowLeft) {
        player.x -= player.velocity;
    }
    
    // Camera follow logic
    scrollOffset = player.x - 400;
    if (scrollOffset < 0) {
        scrollOffset = 0;
    }
    
    // Win condition
    if (player.x < goal.x + goal.width &&   // Player's left is before goal's right
        player.x + player.width > goal.x && // Player's right is after goal's left
        player.y < goal.y + goal.height &&  // Player's top is before goal's bottom
        player.y + player.height > goal.y) { // Player's bottom is after goal's top
        
        console.log('YOU WIN!');
        // 1. Stop the game loop immediately
        gameRunning = false; 

        // 2. Ask the user if they want to play again
        const playAgain = confirm('YOU WIN! Play again?');

        // 3. Conditionally restart the game
        if (playAgain) {
            resetGame();          // Reset player/scroll position
            gameRunning = true;   // Set the game to running
            gameLoop();           // Manually restart the game loop
        }
        // If they click 'Cancel', the game will just stay frozen in its 'win' state.
    }
}

// Draw game objects
function draw() {
    // Draw platforms
    platforms.forEach(platform => {
        ctx.fillStyle = 'green';
        ctx.fillRect(platform.x - scrollOffset, platform.y, platform.width, platform.height);
    });
    
    // Draw goal
    ctx.fillStyle = 'gold';
    ctx.fillRect(goal.x - scrollOffset, goal.y, goal.width, goal.height);
    
    // Draw the player as a smiley face
    const playerX = player.x - scrollOffset;
    const playerY = player.y;
    const centerX = playerX + player.width / 2;
    const centerY = playerY + player.height / 2;
    const radius = Math.min(player.width, player.height) / 2;
    
    // Face (yellow circle)
    ctx.fillStyle = '#FFD700';
    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    
    // Face outline
    ctx.strokeStyle = '#FFA500';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Eyes
    ctx.fillStyle = '#000000';
    const eyeRadius = radius * 0.15;
    const eyeOffsetX = radius * 0.3;
    const eyeOffsetY = radius * 0.2;
    
    ctx.beginPath();
    ctx.arc(centerX - eyeOffsetX, centerY - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    ctx.beginPath();
    ctx.arc(centerX + eyeOffsetX, centerY - eyeOffsetY, eyeRadius, 0, Math.PI * 2);
    ctx.fill();
    
    // Smile
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.beginPath();
    ctx.arc(centerX, centerY + radius * 0.1, radius * 0.6, 0, Math.PI);
    ctx.stroke();
}

// Key event listeners
document.addEventListener('keydown', (event) => {
    if (event.key === 'ArrowRight') {
        keys.ArrowRight = true;
    }
    if (event.key === 'ArrowLeft') {
        keys.ArrowLeft = true;
    }
    if (event.key === ' ') {
        // Jump if player is on the ground
        if (player.isOnGround) {
            player.velocityY = -15;
        }
    }
});

document.addEventListener('keyup', (event) => {
    if (event.key === 'ArrowRight') {
        keys.ArrowRight = false;
    }
    if (event.key === 'ArrowLeft') {
        keys.ArrowLeft = false;
    }
});

// Reset game function
function resetGame() {
    player.x = 100;
    player.y = 100;
    player.velocityY = 0;
    scrollOffset = 0;
}

// Start the game when the page loads
window.addEventListener('load', init);
