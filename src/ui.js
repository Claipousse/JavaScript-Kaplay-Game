import { GAME_CONFIG } from "./config.js";

export function createUI() {
    // HP Bar (grey background for no HP, red for HP)
    const hpBar = add([
        rect(200, 30),
        pos(20, 20),
        color(100, 100, 100),
        fixed(),
        layer("ui")
    ]);

    const hpFill = add([
        rect(200, 30),
        pos(20, 20),
        color(255, 0, 0),
        fixed(),
        layer("ui")
    ]);

    // HP Text centered on the HP bar (current HP / max HP)
    const hpText = add([
        text("HP: " + GAME_CONFIG.playerHP + "/" + GAME_CONFIG.maxHP, { size: 24 }),
        pos(120, 35),
        anchor("center"),
        fixed(),
        layer("ui")
    ]);

    const coinIcon = add([
        sprite("coin"),
        pos(20, 65),
        scale(0.8),
        fixed(),
        layer("ui")
    ]);

    const coinText = add([
        text(": " + GAME_CONFIG.coins, { size: 24 }),
        pos(50, 70),
        fixed(),
        layer("ui")
    ]);

    // UI for waves, placed on top of the screen
    const waveText = add([
        text("Wave: " + GAME_CONFIG.waveNumber, { size: 24 }),
        pos(width() / 2, 30),
        anchor("center"),
        fixed(),
        layer("ui")
    ]);

    const waveTimeText = add([
        text("Time Left: " + GAME_CONFIG.waveTimeLeft, { size: 24 }),
        pos(width() / 2, 60),
        anchor("center"),
        fixed(),
        layer("ui")
    ]);

    // Function to update the HP bar
    function updateHPBar(currentHP, maxHP) {
        hpFill.width = (currentHP / maxHP) * 200;
        hpText.text = "HP: " + currentHP + "/" + maxHP;
    }

    // Function to update the wave UI
    function updateWaveUI(waveNum = GAME_CONFIG.waveNumber, timeLeft = GAME_CONFIG.waveTimeLeft) {
        waveText.text = "Wave: " + waveNum;
        waveTimeText.text = "Time Left: " + timeLeft;
    }

    function updateCoinCounter(coins = GAME_CONFIG.coins) {
        coinText.text = ": " + coins;
    }

    return { updateHPBar, updateWaveUI, updateCoinCounter };
}