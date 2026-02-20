// Game configuration
const CONFIG = {
    CANVAS_WIDTH: 900,
    CANVAS_HEIGHT: 600,

    // Enemy settings
    ENEMY_SIZE: 30,
    BASE_ENEMY_TRAVEL_TIME: 45, // seconds to cross map
    SPAWN_INTERVAL: 2000, // ms between spawns

    // Layer colors (health layers)
    LAYER_COLORS: [
        '#ff0000', // Red (outermost)
        '#ff7700', // Orange
        '#ffff00', // Yellow
        '#00ff00', // Green
        '#00ffff', // Cyan
        '#0077ff', // Blue
        '#7700ff', // Purple
        '#ff00ff', // Magenta
        '#ffffff', // White
        '#888888', // Gray (innermost/core)
    ],

    // Track settings
    TRACK_WIDTH: 50,
    TRACK_COLOR: '#2a2a4a',
    TRACK_BORDER_COLOR: '#3a3a6a',
};
