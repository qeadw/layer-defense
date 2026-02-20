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
    { name: 'Yellow', color: '#ffcc00', layers: 1 },
    { name: 'Cyan', color: '#00cccc', layers: 1 },
    { name: 'Magenta', color: '#cc00cc', layers: 1 },
    { name: 'Orange', color: '#ff6600', layers: 1 },
    { name: 'Purple', color: '#6600cc', layers: 1 },
    { name: 'Pink', color: '#ff66aa', layers: 1 },
    { name: 'White', color: '#ffffff', layers: 1 },
];

// 10 Red/XXX combos (striped)
const RED_COMBOS = [
    { name: 'Red/Red', colors: ['#ff0000', '#aa0000'], layers: 2 },      // Light/dark red
    { name: 'Red/Blue', colors: ['#ff0000', '#0066ff'], layers: 2 },
    { name: 'Red/Green', colors: ['#ff0000', '#00cc00'], layers: 2 },
    { name: 'Red/Yellow', colors: ['#ff0000', '#ffcc00'], layers: 2 },
    { name: 'Red/Cyan', colors: ['#ff0000', '#00cccc'], layers: 2 },
    { name: 'Red/Magenta', colors: ['#ff0000', '#cc00cc'], layers: 2 },
    { name: 'Red/Orange', colors: ['#ff0000', '#ff6600'], layers: 2 },
    { name: 'Red/Purple', colors: ['#ff0000', '#6600cc'], layers: 2 },
    { name: 'Red/Pink', colors: ['#ff0000', '#ff66aa'], layers: 2 },
    { name: 'Red/White', colors: ['#ff0000', '#ffffff'], layers: 2 },
];

// 10 Blue/XXX combos (striped)
const BLUE_COMBOS = [
    { name: 'Blue/Red', colors: ['#0066ff', '#ff0000'], layers: 3 },
    { name: 'Blue/Blue', colors: ['#0066ff', '#003399'], layers: 3 },    // Light/dark blue
    { name: 'Blue/Green', colors: ['#0066ff', '#00cc00'], layers: 3 },
    { name: 'Blue/Yellow', colors: ['#0066ff', '#ffcc00'], layers: 3 },
    { name: 'Blue/Cyan', colors: ['#0066ff', '#00cccc'], layers: 3 },
    { name: 'Blue/Magenta', colors: ['#0066ff', '#cc00cc'], layers: 3 },
    { name: 'Blue/Orange', colors: ['#0066ff', '#ff6600'], layers: 3 },
    { name: 'Blue/Purple', colors: ['#0066ff', '#6600cc'], layers: 3 },
    { name: 'Blue/Pink', colors: ['#0066ff', '#ff66aa'], layers: 3 },
    { name: 'Blue/White', colors: ['#0066ff', '#ffffff'], layers: 3 },
];

// All enemy types in order (introduced by wave)
const ENEMY_TYPES = [...SOLID_COLORS, ...RED_COMBOS, ...BLUE_COMBOS];
