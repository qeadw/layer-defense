// Game configuration
const CONFIG = {
    // Enemy settings
    ENEMY_SIZE: 30,
    BASE_ENEMY_TRAVEL_TIME: 45, // seconds to cross map
    SPAWN_INTERVAL: 2000, // ms between spawns
    ENEMIES_PER_WAVE: 10,

    // Track settings
    TRACK_WIDTH: 50,
    TRACK_COLOR: '#2a2a4a',
    TRACK_BORDER_COLOR: '#3a3a6a',
};

// 10 Solid colors
const SOLID_COLORS = [
    { name: 'Red', color: '#ff0000', layers: 1 },
    { name: 'Blue', color: '#0066ff', layers: 1 },
    { name: 'Green', color: '#00cc00', layers: 1 },
    { name: 'Yellow', color: '#ffcc00', layers: 2 },
    { name: 'Cyan', color: '#00cccc', layers: 2 },
    { name: 'Magenta', color: '#cc00cc', layers: 2 },
    { name: 'Orange', color: '#ff6600', layers: 3 },
    { name: 'Purple', color: '#6600cc', layers: 3 },
    { name: 'Pink', color: '#ff66aa', layers: 3 },
    { name: 'White', color: '#ffffff', layers: 4 },
];

// 10 Combo colors (striped patterns showing strength)
const COMBO_COLORS = [
    { name: 'Red/Blue', colors: ['#ff0000', '#0066ff'], layers: 4 },
    { name: 'Red/Green', colors: ['#ff0000', '#00cc00'], layers: 4 },
    { name: 'Blue/Red', colors: ['#0066ff', '#ff0000'], layers: 5 },
    { name: 'Blue/Blue', colors: ['#0066ff', '#003399'], layers: 5 },  // Striped dark blue
    { name: 'Blue/Green', colors: ['#0066ff', '#00cc00'], layers: 5 },
    { name: 'Green/Red', colors: ['#00cc00', '#ff0000'], layers: 6 },
    { name: 'Green/Blue', colors: ['#00cc00', '#0066ff'], layers: 6 },
    { name: 'Green/Green', colors: ['#00cc00', '#006600'], layers: 6 }, // Striped dark green
    { name: 'Yellow/Cyan', colors: ['#ffcc00', '#00cccc'], layers: 7 },
    { name: 'Rainbow', colors: ['#ff0000', '#ff6600', '#ffcc00', '#00cc00', '#0066ff', '#6600cc'], layers: 10 },
];

// All enemy types in order (introduced by wave)
const ENEMY_TYPES = [...SOLID_COLORS, ...COMBO_COLORS];
