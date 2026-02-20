// Track system - defines the path enemies follow

class Track {
    constructor(canvasWidth, canvasHeight) {
        this.width = canvasWidth;
        this.height = canvasHeight;

        // Define waypoints as percentages, then scale to screen size
        const waypointsPercent = [
            { x: -0.03, y: 0.17 },     // Start off-screen left
            { x: 0.17, y: 0.17 },
            { x: 0.17, y: 0.42 },
            { x: 0.44, y: 0.42 },
            { x: 0.44, y: 0.17 },
            { x: 0.67, y: 0.17 },
            { x: 0.67, y: 0.67 },
            { x: 0.33, y: 0.67 },
            { x: 0.33, y: 0.83 },
            { x: 0.83, y: 0.83 },
            { x: 0.83, y: 0.50 },
            { x: 1.03, y: 0.50 },      // End off-screen right
        ];

        // Scale waypoints to actual screen size
        this.waypoints = waypointsPercent.map(p => ({
            x: p.x * canvasWidth,
            y: p.y * canvasHeight
        }));

        // Calculate total track length
        this.totalLength = this.calculateTotalLength();
    }

    calculateTotalLength() {
        let length = 0;
        for (let i = 1; i < this.waypoints.length; i++) {
            const dx = this.waypoints[i].x - this.waypoints[i - 1].x;
            const dy = this.waypoints[i].y - this.waypoints[i - 1].y;
            length += Math.sqrt(dx * dx + dy * dy);
        }
        return length;
    }

    // Get position along track given progress (0 to 1)
    getPositionAtProgress(progress) {
        const targetDist = progress * this.totalLength;
        let currentDist = 0;

        for (let i = 1; i < this.waypoints.length; i++) {
            const prev = this.waypoints[i - 1];
            const curr = this.waypoints[i];
            const dx = curr.x - prev.x;
            const dy = curr.y - prev.y;
            const segmentLength = Math.sqrt(dx * dx + dy * dy);

            if (currentDist + segmentLength >= targetDist) {
                // Position is on this segment
                const segmentProgress = (targetDist - currentDist) / segmentLength;
                return {
                    x: prev.x + dx * segmentProgress,
                    y: prev.y + dy * segmentProgress
                };
            }

            currentDist += segmentLength;
        }

        // Return end position
        return { ...this.waypoints[this.waypoints.length - 1] };
    }

    draw(ctx) {
        ctx.strokeStyle = CONFIG.TRACK_BORDER_COLOR;
        ctx.lineWidth = CONFIG.TRACK_WIDTH + 6;
        ctx.lineCap = 'round';
        ctx.lineJoin = 'round';

        // Draw border
        ctx.beginPath();
        ctx.moveTo(this.waypoints[0].x, this.waypoints[0].y);
        for (let i = 1; i < this.waypoints.length; i++) {
            ctx.lineTo(this.waypoints[i].x, this.waypoints[i].y);
        }
        ctx.stroke();

        // Draw main track
        ctx.strokeStyle = CONFIG.TRACK_COLOR;
        ctx.lineWidth = CONFIG.TRACK_WIDTH;

        ctx.beginPath();
        ctx.moveTo(this.waypoints[0].x, this.waypoints[0].y);
        for (let i = 1; i < this.waypoints.length; i++) {
            ctx.lineTo(this.waypoints[i].x, this.waypoints[i].y);
        }
        ctx.stroke();
    }
}
