import { GAME_CONFIG } from "../config.js";

// Define base costs and scaling for upgrades
const UPGRADES = {
    speed: {
        name: "Movement Speed",
        baseCost: 1,
        increment: 1,
        purchased: 0,
        effect: () => { GAME_CONFIG.speed += 50; }
    },
    maxHP: {
        name: "Max Health",
        baseCost: 1,
        increment: 1,
        purchased: 0,
        effect: () => { 
            GAME_CONFIG.maxHP += 1; 
            GAME_CONFIG.playerHP += 1; 
        }
    },
    fireRate: {
        name: "Fire Rate",
        baseCost: 1,
        increment: 1,
        purchased: 0,
        effect: () => { GAME_CONFIG.shootCooldown = Math.max(0.05, GAME_CONFIG.shootCooldown - 0.01); }
    },
    weaponRange: {
        name: "Weapon Range",
        baseCost: 1,
        increment: 1,
        purchased: 0,
        effect: () => { GAME_CONFIG.weaponRange += 50; }
    }
};

export function createShopScene() {
    scene("shop", (rectanglePosX, rectanglePosY, rectangleWidth, rectangleHeight, updateUI) => {
        // Background
        add([rect(width(), height()), color(0, 0, 40), layer("background"), fixed()]);
        
        // Title
        add([
            text("UPGRADE SHOP", { size: 48 }),
            pos(width() / 2, 70),
            anchor("center"),
            layer("ui"),
            fixed()
        ]);
        
        // Wave info
        add([
            text(`WAVE ${GAME_CONFIG.waveNumber} COMPLETED`, { size: 28 }),
            pos(width() / 2, 120),
            anchor("center"),
            layer("ui"),
            fixed()
        ]);
        
        // Coins display - centered
        const coinGroup = add([
            pos(width() / 2, 170),
            anchor("center"),
            fixed(),
            layer("ui")
        ]);

        const coinIcon = coinGroup.add([
            sprite("coin"),
            scale(1.2),
            anchor("right"),
            pos(-20, 0)
        ]);
        
        const coinText = coinGroup.add([
            text(`${GAME_CONFIG.coins}`, { size: 32 }),
            anchor("left"),
            pos(20, 0)
        ]);
        
        // Create upgrade buttons
        const upgradeKeys = Object.keys(UPGRADES);
        const buttonSpacing = 100;
        const startY = 250;
        
        upgradeKeys.forEach((key, index) => {
            const upgrade = UPGRADES[key];
            const cost = upgrade.baseCost + (upgrade.increment * upgrade.purchased);
            const canAfford = GAME_CONFIG.coins >= cost;
            
            // Button background
            const button = add([
                rect(300, 80),
                pos(width() / 2, startY + index * buttonSpacing),
                color(50, 50, 70),
                anchor("center"),
                layer("ui"),
                fixed(),
                area(),
                "button",
                { upgradeKey: key }
            ]);
            
            // Upgrade name
            add([
                text(upgrade.name, { size: 24 }),
                pos(width() / 2 - 130, startY + index * buttonSpacing - 15),
                anchor("left"),
                layer("ui"),
                fixed()
            ]);
            
            // Current level
            add([
                text(`Level: ${upgrade.purchased}`, { size: 18 }),
                pos(width() / 2 - 130, startY + index * buttonSpacing + 15),
                anchor("left"),
                layer("ui"),
                fixed()
            ]);
            
            // Cost
            add([
                text(`Cost: ${cost}`, { size: 20 }),
                pos(width() / 2 + 120, startY + index * buttonSpacing + 10),
                anchor("right"),
                color(canAfford ? rgb(255, 255, 255) : rgb(255, 0, 0)),
                layer("ui"),
                fixed()
            ]);
        });
        
        // Start next wave button positioned at bottom right
        const startButton = add([
            rect(250, 70),
            pos(width() - 150, height() - 100),
            color(0, 150, 0),
            anchor("center"),
            layer("ui"),
            fixed(),
            area(),
            "startButton"
        ]);
        
        add([
            text(`START WAVE ${GAME_CONFIG.waveNumber}`, { size: 24 }),
            pos(width() - 150, height() - 100),
            anchor("center"),
            layer("ui"),
            fixed()
        ]);
        
        // Handle upgrade button clicks
        onClick("button", (button) => {
            const upgradeKey = button.upgradeKey;
            const upgrade = UPGRADES[upgradeKey];
            const cost = upgrade.baseCost + (upgrade.increment * upgrade.purchased);
            
            if (GAME_CONFIG.coins >= cost) {
                // Apply upgrade effect
                upgrade.effect();
                
                // Deduct coins
                GAME_CONFIG.coins -= cost;
                
                // Increment purchase count
                upgrade.purchased++;
                
                // Refresh shop scene to update displays
                go("shop", rectanglePosX, rectanglePosY, rectangleWidth, rectangleHeight, updateUI);
                
                // Play coin sound
                play("coin1");
            } else {
                // Play error sound or visual feedback
                shake(5);
            }
        });
        
        // Handle start wave button
        onClick("startButton", () => {
            go("game", { fromShop: true });
        });
    });
}

// Function to reset upgrades when restarting game
export function resetUpgrades() {
    Object.keys(UPGRADES).forEach(key => {
        UPGRADES[key].purchased = 0;
    });
}