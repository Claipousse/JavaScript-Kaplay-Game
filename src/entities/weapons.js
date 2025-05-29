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
        const coinSound = `coin${Math.floor(Math.random() * 4) + 1}`;
        play(coinSound);
    });
}

function shootAt(position, direction) {
    // Define the bullet behavior
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

        // Enemy death animation
        const deathAnimation = add([
            sprite("skull"),
            pos(enemyPos),
            scale(vec2(1, 1)),
            layer("game"),
            {
                timer: 0,
                duration: 0.5
            }
        ]);

        // Shrinking and rotation animation
        deathAnimation.onUpdate(() => {
            deathAnimation.timer += dt();
            const progress = deathAnimation.timer / deathAnimation.duration;

            if (progress <= 1) {
                const newScale = 1 - progress;
                deathAnimation.scale = vec2(newScale, newScale);
                deathAnimation.angle += 360 * dt() * 2; // Fast rotation
                deathAnimation.color = rgb(255, 255 - (progress * 255), 255 - (progress * 255)); // Turns red
            } else {
                destroy(deathAnimation);
            }
        });

        destroy(enemy);
        const skullSound = `skull_death${Math.floor(Math.random() * 3) + 1}`;
        play(skullSound);

        // Spawn coin after a small delay
        wait(0.3, () => spawnCoin(enemyPos));
    });
}

function spawnCoin(position) {
    add([
        sprite("coin"),
        pos(position),
        area(),
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