// Enemy class - squares with colored layers

class Enemy {
    constructor(track, enemyType) {
        this.track = track;
        this.progress = 0; // 0 to 1 along track
        this.type = enemyType;
        this.layers = enemyType.layers;
        this.maxLayers = enemyType.layers;
        this.size = CONFIG.ENEMY_SIZE;
        this.alive = true;
        this.reachedEnd = false;

        // Check if combo (has colors array) or solid (has color)
        this.isCombo = !!enemyType.colors;
        this.colors = enemyType.colors || [enemyType.color];

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

        const halfSize = this.size / 2;

        if (this.isCombo) {
            // Draw striped pattern for combo enemies
            this.drawStriped(ctx, halfSize);
        } else {
            // Draw solid color
            this.drawSolid(ctx, halfSize);
        }

        // Draw layer indicator (small squares showing remaining health)
        this.drawLayerIndicator(ctx);
    }

    drawSolid(ctx, halfSize) {
        ctx.fillStyle = this.colors[0];
        ctx.fillRect(
            this.x - halfSize,
            this.y - halfSize,
            this.size,
            this.size
        );

        // Border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x - halfSize,
            this.y - halfSize,
            this.size,
            this.size
        );
    }

    drawStriped(ctx, halfSize) {
        const stripeCount = this.colors.length;
        const stripeHeight = this.size / stripeCount;

        ctx.save();
        ctx.beginPath();
        ctx.rect(this.x - halfSize, this.y - halfSize, this.size, this.size);
        ctx.clip();

        // Draw diagonal stripes
        for (let i = 0; i < stripeCount * 2; i++) {
            ctx.fillStyle = this.colors[i % stripeCount];
            ctx.beginPath();
            const offset = (i - stripeCount) * stripeHeight;
            ctx.moveTo(this.x - halfSize + offset, this.y - halfSize);
            ctx.lineTo(this.x - halfSize + offset + stripeHeight, this.y - halfSize);
            ctx.lineTo(this.x + halfSize + offset + stripeHeight, this.y + halfSize);
            ctx.lineTo(this.x + halfSize + offset, this.y + halfSize);
            ctx.closePath();
            ctx.fill();
        }

        ctx.restore();

        // Border
        ctx.strokeStyle = 'rgba(0, 0, 0, 0.5)';
        ctx.lineWidth = 2;
        ctx.strokeRect(
            this.x - halfSize,
            this.y - halfSize,
            this.size,
            this.size
        );
    }

    drawLayerIndicator(ctx) {
        // Draw small dots below enemy showing layer count
        const dotSize = 4;
        const dotSpacing = 6;
        const totalWidth = this.layers * dotSpacing;
        const startX = this.x - totalWidth / 2 + dotSpacing / 2;
        const y = this.y + this.size / 2 + 8;

        for (let i = 0; i < this.layers; i++) {
            ctx.fillStyle = i < this.layers ? '#fff' : '#333';
            ctx.beginPath();
            ctx.arc(startX + i * dotSpacing, y, dotSize / 2, 0, Math.PI * 2);
            ctx.fill();
        }
    }
}
