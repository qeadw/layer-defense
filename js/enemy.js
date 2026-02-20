// Enemy class - squares with colored layer health

class Enemy {
    constructor(track, layers = 1) {
        this.track = track;
        this.progress = 0; // 0 to 1 along track
        this.layers = layers; // Number of health layers
        this.maxLayers = layers;
        this.size = CONFIG.ENEMY_SIZE;
        this.alive = true;
        this.reachedEnd = false;

        // Speed: progress per second to complete track in BASE_ENEMY_TRAVEL_TIME
        this.speed = 1 / CONFIG.BASE_ENEMY_TRAVEL_TIME;

        // Position
        const pos = track.getPositionAtProgress(0);
        this.x = pos.x;
        this.y = pos.y;
    }

    update(deltaTime) {
        if (!this.alive) return;

        // Move along track
        this.progress += this.speed * deltaTime;

        // Update position
        const pos = this.track.getPositionAtProgress(this.progress);
        this.x = pos.x;
        this.y = pos.y;

        // Check if reached end
        if (this.progress >= 1) {
            this.reachedEnd = true;
            this.alive = false;
        }
    }

    takeDamage(amount = 1) {
        this.layers -= amount;
        if (this.layers <= 0) {
            this.alive = false;
        }
    }

    draw(ctx) {
        if (!this.alive) return;

        const layerSize = this.size / this.maxLayers;

        // Draw layers from outermost to innermost
        for (let i = this.layers - 1; i >= 0; i--) {
            const currentSize = this.size - (this.maxLayers - this.layers + i) * layerSize;
            const colorIndex = (this.maxLayers - 1 - i) % CONFIG.LAYER_COLORS.length;

            ctx.fillStyle = CONFIG.LAYER_COLORS[colorIndex];

            // Draw square centered on position
            ctx.fillRect(
                this.x - currentSize / 2,
                this.y - currentSize / 2,
                currentSize,
                currentSize
            );

            // Draw border for each layer
            ctx.strokeStyle = 'rgba(0, 0, 0, 0.3)';
            ctx.lineWidth = 1;
            ctx.strokeRect(
                this.x - currentSize / 2,
                this.y - currentSize / 2,
                currentSize,
                currentSize
            );
        }
    }
}
