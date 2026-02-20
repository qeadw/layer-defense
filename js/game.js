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
        this.enemiesSpawned = 0;
        this.waveInProgress = false;
        this.lastTime = 0;
        this.spawnTimer = 0;

        // UI elements
        this.livesDisplay = document.getElementById('lives');
        this.waveDisplay = document.getElementById('wave-num');
        this.nextWaveBtn = document.getElementById('next-wave-btn');

        // Button event
        this.nextWaveBtn.addEventListener('click', () => this.startWave());

        // Start first wave automatically
        this.startWave();

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

    getEnemyTypeForWave(wave) {
        // Each wave introduces enemies up to that wave number
        // Wave 1: only Red, Wave 2: Red + Blue, etc.
        const maxTypeIndex = Math.min(wave, ENEMY_TYPES.length) - 1;

        // Randomly pick from available types, weighted toward newer types
        const weights = [];
        for (let i = 0; i <= maxTypeIndex; i++) {
            // Newer types have higher weight
            weights.push(i + 1);
        }

        const totalWeight = weights.reduce((a, b) => a + b, 0);
        let random = Math.random() * totalWeight;

        for (let i = 0; i <= maxTypeIndex; i++) {
            random -= weights[i];
            if (random <= 0) {
                return ENEMY_TYPES[i];
            }
        }

        return ENEMY_TYPES[maxTypeIndex];
    }

    startWave() {
        if (this.waveInProgress) return;

        this.waveInProgress = true;
        this.enemiesSpawned = 0;
        this.nextWaveBtn.disabled = true;
        this.nextWaveBtn.textContent = `Wave ${this.wave} in progress...`;
    }

    spawnEnemy() {
        const enemyType = this.getEnemyTypeForWave(this.wave);
        const enemy = new Enemy(this.track, enemyType);
        this.enemies.push(enemy);
        this.enemiesSpawned++;
    }

    update(deltaTime) {
        // Spawn enemies during wave
        if (this.waveInProgress && this.enemiesSpawned < CONFIG.ENEMIES_PER_WAVE) {
            this.spawnTimer += deltaTime * 1000;
            if (this.spawnTimer >= CONFIG.SPAWN_INTERVAL) {
                this.spawnEnemy();
                this.spawnTimer = 0;
            }
        }

        // Check if wave is complete
        if (this.waveInProgress &&
            this.enemiesSpawned >= CONFIG.ENEMIES_PER_WAVE &&
            this.enemies.length === 0) {
            this.waveInProgress = false;
            this.wave++;
            this.updateUI();
            this.nextWaveBtn.disabled = false;
            this.nextWaveBtn.textContent = `Start Wave ${this.wave}`;
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
        const maxTypeIndex = Math.min(this.wave, ENEMY_TYPES.length) - 1;
        const previewX = this.canvas.width - 150;
        const previewY = 20;

        this.ctx.fillStyle = 'rgba(0, 0, 0, 0.7)';
        this.ctx.fillRect(previewX - 10, previewY - 10, 140, 30 + (maxTypeIndex + 1) * 25);

        this.ctx.fillStyle = '#fff';
        this.ctx.font = '14px Arial';
        this.ctx.fillText('Available Enemies:', previewX, previewY + 10);

        for (let i = 0; i <= maxTypeIndex; i++) {
            const type = ENEMY_TYPES[i];
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
            this.ctx.fillText(`${type.name} (${type.layers}HP)`, previewX + 22, y + 12);
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
