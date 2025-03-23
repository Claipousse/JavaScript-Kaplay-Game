import { GAME_CONFIG } from "../config.js";

export function spawnEnemy(player, rectanglePosX, rectanglePosY, rectangleWidth, rectangleHeight) {
    let spawnPos;
    do {
        spawnPos = vec2(rand(rectanglePosX, rectanglePosX + rectangleWidth), rand(rectanglePosY, rectanglePosY + rectangleHeight));
    } while (player.pos.dist(spawnPos) < 300);
    
    return add([
        sprite("skull"),
        pos(spawnPos),
        area(),
        body(),
        layer("game"),
        "enemy",
    ]);
}

export function setupEnemyBehavior(player) {
    onUpdate(() => {
        const enemies = get("enemy");
        for (let enemy of enemies) {
            const direction = player.pos.sub(enemy.pos).unit();
            enemy.move(direction.scale(GAME_CONFIG.enemySpeed));
        }
    });
}

export function getClosestEnemy(player) {
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