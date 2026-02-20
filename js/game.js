// Main game logic

class Game {
    constructor() {
        this.canvas = document.getElementById('gameCanvas');
        this.ctx = this.canvas.getContext('2d');

        // Set canvas size to fullscreen
        this.resizeCanvas();
        window.addEventListener('resize', () => this.resizeCanvas());

        // Game state
        this.track = new Track(this.canvas.width, this.canvas.height);
        this.enemies = [];
        this.lives = 20;
        this.wave = 1;
        this.lastTime = 0;

        // Spawn timers for each enemy type (independent)
        this.spawnTimers = {};
        this.baseSpawnInterval = 2000; // 2 seconds for red
        this.spawnSlowdown = 1.15; // 15% slower for each subsequent color

        // UI elements
        this.livesDisplay = document.getElementById('lives');
        this.waveDisplay = document.getElementById('wave-num');
        this.nextWaveBtn = document.getElementById('next-wave-btn');
        this.prevWaveBtn = document.getElementById('prev-wave-btn');

        // Button events - always available
        this.nextWaveBtn.addEventListener('click', () => this.changeWave(1));
        this.prevWaveBtn.addEventListener('click', () => this.changeWave(-1));

        // Update button states
        this.updateWaveButtons();

        // Start game loop
        this.gameLoop = this.gameLoop.bind(this);
        requestAnimationFrame(this.gameLoop);
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;

        // Rebuild track for new size
        if (this.track) {
            this.track = new Track(this.canvas.width, this.canvas.height);
            // Update existing enemies with new track
            for (const enemy of this.enemies) {
                enemy.track = this.track;
            }
        }
    }

    changeWave(delta) {
        this.wave = Math.max(1, this.wave + delta);
        this.updateUI();
        this.updateWaveButtons();
    }

    updateWaveButtons() {
        this.prevWaveBtn.disabled = this.wave <= 1;
    }

    // Get how many enemy types are unlocked at current wave
    // New type every 2 waves
    getUnlockedTypeCount() {
        return Math.min(Math.ceil(this.wave / 2), ENEMY_TYPES.length);
    }

    // Get spawn interval for a specific enemy type index
    getSpawnInterval(typeIndex) {
        return this.baseSpawnInterval * Math.pow(this.spawnSlowdown, typeIndex);
    }

    spawnEnemy(typeIndex) {
        const enemyType = ENEMY_TYPES[typeIndex];
        const enemy = new Enemy(this.track, enemyType);
        this.enemies.push(enemy);
    }

    update(deltaTime) {
        const unlockedCount = this.getUnlockedTypeCount();

        // Update spawn timers for each unlocked enemy type
        for (let i = 0; i < unlockedCount; i++) {
            // Initialize timer if needed
            if (this.spawnTimers[i] === undefined) {
                this.spawnTimers[i] = 0;
            }

            this.spawnTimers[i] += deltaTime * 1000;
            const interval = this.getSpawnInterval(i);

            if (this.spawnTimers[i] >= interval) {
                this.spawnEnemy(i);
                this.spawnTimers[i] = 0;
            }
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

        // Draw wave enemy preview
        this.drawWavePreview();
    }

    drawWavePreview() {
        const unlockedCount = this.getUnlockedTypeCount();
        const previewX = this.canvas.width - 180;
        const previewY = 20;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(previewX - 10, previewY - 10, 170, 30 + unlockedCount * 25);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Active Enemies:', previewX, previewY + 10);

        for (let i = 0; i < unlockedCount; i++) {
            const type = ENEMY_TYPES[i];
            const interval = this.getSpawnInterval(i);
            const y = previewY + 30 + i * 25;

            // Draw mini preview
            if (type.colors) {
                // Combo - draw striped mini square
                const stripeWidth = 15 / type.colors.length;
                for (let j = 0; j < type.colors.length; j++) {
                    this.ctx.fillStyle = type.colors[j];
                    this.ctx.fillRect(previewX + j * stripeWidth, y, stripeWidth, 15);
                }
            } else {
                // Solid
                this.ctx.fillStyle = type.color;
                this.ctx.fillRect(previewX, y, 15, 15);
            }

            this.ctx.fillStyle = '#fff';
            this.ctx.fillText(`${type.name} (${(interval/1000).toFixed(1)}s)`, previewX + 22, y + 12);
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
