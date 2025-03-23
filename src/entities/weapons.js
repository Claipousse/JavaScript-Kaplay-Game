import { GAME_CONFIG } from "../config.js";

export function setupWeaponSystem(player, gun, updateCoinCounter) {
    onUpdate(() => {
        const closestEnemy = getClosestEnemy(player);
        const currentTime = time();
    
        if (closestEnemy) {
            const dist = player.pos.dist(closestEnemy.pos);
            const direction = closestEnemy.pos.sub(player.pos).unit();
            const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);
            
            gun.pos = player.pos.add(direction.scale(35)).add(vec2(30, 30));
            gun.angle = angle;
    
            if (dist <= GAME_CONFIG.weaponRange && currentTime - GAME_CONFIG.lastShotTime >= GAME_CONFIG.shootCooldown) {
                shootAt(gun.pos, direction);
                GAME_CONFIG.lastShotTime = currentTime;
            }
        } else {
            gun.pos = player.pos.add(vec2(55, 10));
            gun.angle = 0;
        }
    });

    // Collect coins
    player.onCollide("coin", (coin) => {
        GAME_CONFIG.coins++;
        if (updateCoinCounter) {
            updateCoinCounter(GAME_CONFIG.coins);
        }
        destroy(coin);
        //play("coin_pickup"); //Will add sounds later
    });
}

function shootAt(position, direction) {
    //Define the bullet behavior
    const bullet = add([
        circle(7),
        pos(position),
        color(255, 0, 0),
        layer("game"),
        "bullet",
        area(),
        {
            speed: 2000,
            dir: direction,
        },
    ]);

    bullet.onUpdate(() => {
        bullet.move(bullet.dir.scale(bullet.speed));
    });

    bullet.onCollide("enemy", (enemy) => {
        const enemyPos = enemy.pos.clone();
        destroy(bullet);
        destroy(enemy);
        play("skull_death");
        // Coin spawn at enemy's death position
        spawnCoin(enemyPos);
    });
}

function spawnCoin(position) {
    add([
        sprite("coin"),
        pos(position),
        area(),
        body(),
        layer("game"),
        "coin"
    ]);
}

// Get the closest enemy to the player, useful for automatic targeting
function getClosestEnemy(player) {
    const enemies = get("enemy");
    let closestEnemy = null;
    let minDist = Infinity;

    for (let enemy of enemies) {
        const dist = player.pos.dist(enemy.pos);
        if (dist < minDist) {
            minDist = dist;
            closestEnemy = enemy;
        }
    }
    return closestEnemy;
}