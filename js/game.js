// Main game logic

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size
        this.canvas.width = CONFIG.CANVAS_WIDTH;
        this.canvas.height = CONFIG.CANVAS_HEIGHT;

        // Game state
        this.track = new Track();
        this.enemies = [];
        this.lives = 20;
        this.wave = 1;
        this.lastTime = 0;
        this.spawnTimer = 0;

        // UI elements
        this.livesDisplay = document.getElementById('lives');
        this.waveDisplay = document.getElementById('wave-num');

        // Start game loop
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }

    spawnEnemy() {
        // Layers based on wave (1-3 layers for early waves)
        const layers = Math.min(1 + Math.floor(this.wave / 3), 10);
        const enemy = new Enemy(this.track, layers);
        this.enemies.push(enemy);
    }

    update(deltaTime) {
        // Spawn enemies
        this.spawnTimer += deltaTime * 1000;
        if (this.spawnTimer >= CONFIG.SPAWN_INTERVAL) {
            this.spawnEnemy();
            this.spawnTimer = 0;
        }

        // Update enemies
        for (const enemy of this.enemies) {
            enemy.update(deltaTime);

            // Check if enemy reached end
            if (enemy.reachedEnd) {
                this.lives -= enemy.layers; // Lose lives equal to remaining layers
                this.updateUI();
            }
        }

        // Remove dead enemies
        this.enemies = this.enemies.filter(e => e.alive);

        // Check game over
        if (this.lives <= 0) {
            this.lives = 0;
            this.updateUI();
            // For now just keep running, can add game over screen later
        }
    }

    draw() {
        // Clear canvas
        this.ctx.fillStyle = '#0f0f1a';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        // Draw track
        this.track.draw(this.ctx);

        // Draw enemies
        for (const enemy of this.enemies) {
            enemy.draw(this.ctx);
        }
    }

    updateUI() {
        this.livesDisplay.textContent = this.lives;
        this.waveDisplay.textContent = this.wave;
    }

    gameLoop(currentTime) {
        // Calculate delta time in seconds
        const deltaTime = (currentTime - this.lastTime) / 1000;
        this.lastTime = currentTime;

        // Cap delta time to prevent huge jumps
        const cappedDelta = Math.min(deltaTime, 0.1);

        this.update(cappedDelta);
        this.draw();

        requestAnimationFrame(this.gameLoop);
    }
}

// Start game when page loads
window.addEventListener('load', () => {
    new Game();
});
