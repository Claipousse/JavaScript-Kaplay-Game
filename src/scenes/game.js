import { GAME_CONFIG } from "../config.js";
import { createPlayer } from "../entities/player.js";
import { spawnEnemy, setupEnemyBehavior } from "../entities/enemy.js";
import { setupWeaponSystem } from "../entities/weapons.js";
import { createUI } from "../ui.js";

export function createGameScene() {
    scene("game", () => {
        // Define the dimensions & positions of the playground
        const rectangleWidth = GAME_CONFIG.rectangleWidth;
        const rectangleHeight = GAME_CONFIG.rectangleHeight;
        const rectanglePosX = (width() - rectangleWidth) / 2;
        const rectanglePosY = (height() - rectangleHeight) / 2;

        // Create a blue square for the playground, a black square for the background (void)
        add([rect(rectangleWidth, rectangleHeight), pos(rectanglePosX, rectanglePosY), color(0, 0, 200), layer("playground")]);
        add([rect(width(), height()), color(0, 0, 0), layer("background"), fixed()]);

        // Initialisation of the UI elements
        const { updateHPBar, updateWaveUI, updateCoinCounter } = createUI(GAME_CONFIG.playerHP, GAME_CONFIG.maxHP, GAME_CONFIG.waveNumber, GAME_CONFIG.waveTimeLeft);

        // Creation of the player
        const { kat, gun } = createPlayer(rectanglePosX, rectanglePosY, rectangleWidth, rectangleHeight, updateHPBar);

        // Setup enemy behavior
        setupEnemyBehavior(kat);

        // Setup weapon system
        setupWeaponSystem(kat, gun, updateCoinCounter);

        // Start the wave
        startWave(kat, rectanglePosX, rectanglePosY, rectangleWidth, rectangleHeight, updateWaveUI);

        // Camera follow the player
        onUpdate(() => {
            setCamPos(kat.pos.x, kat.pos.y);
            if (GAME_CONFIG.waveActive) {
                updateWaveUI(GAME_CONFIG.waveNumber, GAME_CONFIG.waveTimeLeft);
            }
        });
    });
}

function startWave(player, rectanglePosX, rectanglePosY, rectangleWidth, rectangleHeight, updateWaveUI) {
    GAME_CONFIG.waveActive = true;
    GAME_CONFIG.waveTimeLeft = GAME_CONFIG.waveDuration;
    updateWaveUI(GAME_CONFIG.waveNumber, GAME_CONFIG.waveTimeLeft);

    //Ennemies spawn while wave is active
    loop(GAME_CONFIG.enemySpawnRate, () => {
        if (GAME_CONFIG.waveActive) spawnEnemy(player, rectanglePosX, rectanglePosY, rectangleWidth, rectangleHeight);
    });

    const timer = loop(1, () => {
        if (GAME_CONFIG.waveActive) {
            GAME_CONFIG.waveTimeLeft--;
            updateWaveUI(GAME_CONFIG.waveNumber, GAME_CONFIG.waveTimeLeft);
        }
        if (GAME_CONFIG.waveTimeLeft <= 0) {
            GAME_CONFIG.waveActive = false;
            timer.cancel();
            GAME_CONFIG.waveNumber++;
            wait(3, () => startWave(player, rectanglePosX, rectanglePosY, rectangleWidth, rectangleHeight, updateWaveUI));
        }
    });
}