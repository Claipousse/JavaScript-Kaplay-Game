export const GAME_CONFIG = {
    // Game settings (which doesn't scale)
    canTakeDamage: true,
    isDead: false,
    waveActive: false,
    lastShotTime: 0,
    enemySpeed: 200,

    // Game & enemies settings (which scales)
    enemyDamage: 1,
    enemySpawnRate: 2,
    waveNumber: 1,
    waveDuration: 30,
    waveTimeLeft: 30,
    coins: 0,

    // Stats upgradables
    speed: 500,
    maxHP: 3,
    playerHP: 3,
    shootCooldown: 2,
    weaponRange: 300,

    // Playground dimensions
    rectangleWidth: 1300,
    rectangleHeight: 1300
};

//Layers
export const LAYERS = ["background", "playground", "game", "ui"];
export const DEFAULT_LAYER = "game";

// Function for resetting the game configuration, when you restart the game
export function resetGameConfig() {
    GAME_CONFIG.playerHP = GAME_CONFIG.maxHP;
    GAME_CONFIG.isDead = false;
    GAME_CONFIG.waveNumber = 1;
    GAME_CONFIG.waveTimeLeft = GAME_CONFIG.waveDuration;
    GAME_CONFIG.waveActive = false;
    GAME_CONFIG.lastShotTime = 0;
    GAME_CONFIG.coins = 0;
    
    // Reset upgradable stats to initial values
    GAME_CONFIG.speed = 500;
    GAME_CONFIG.maxHP = 3;
    GAME_CONFIG.playerHP = 3;
    GAME_CONFIG.shootCooldown = 2;
    GAME_CONFIG.weaponRange = 300;
}