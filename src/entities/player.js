import { GAME_CONFIG } from "../config.js";

export function createPlayer(rectanglePosX, rectanglePosY, rectangleWidth, rectangleHeight, updateHPBar) {
    const kat = add([
        sprite("kat"),
        pos(width() / 2, height() / 2),
        area(),
        body(),
        layer("game"),
        "player",
    ]);

    const gun = add([
        sprite("gun"),
        pos(kat.pos.x + 30, kat.pos.y),
        layer("game"),
        "gun",
    ]);

    // Player collision management
    kat.onCollide("enemy", () => {
        if (GAME_CONFIG.canTakeDamage) {
            GAME_CONFIG.playerHP -= GAME_CONFIG.enemyDamage;
            updateHPBar(GAME_CONFIG.playerHP, GAME_CONFIG.maxHP);
            addKaboom(kat.pos);
            shake();
            if (GAME_CONFIG.playerHP > 0) {play("player_hurt")};
            flash("#cc425e", 0.2);

            // If player has 0 HP -> Game Over
            if (GAME_CONFIG.playerHP <= 0) {
                GAME_CONFIG.isDead = true;
                destroy(kat);
                destroy(gun);
                addKaboom(kat.pos);
                play("explosion");
                wait(1, () => go("gameover"));
            }
            // If player has more than 0 HP -> Invincibility for 1 second
            else {
                GAME_CONFIG.canTakeDamage = false;
                wait(1, () => (GAME_CONFIG.canTakeDamage = true));
            }
        }
    });

    // Player movement management
    onKeyDown("left", () => { if (!GAME_CONFIG.isDead) kat.move(-GAME_CONFIG.speed, 0); });
    onKeyDown("right", () => { if (!GAME_CONFIG.isDead) kat.move(GAME_CONFIG.speed, 0); });
    onKeyDown("up", () => { if (!GAME_CONFIG.isDead) kat.move(0, -GAME_CONFIG.speed); });
    onKeyDown("down", () => { if (!GAME_CONFIG.isDead) kat.move(0, GAME_CONFIG.speed); });

    // Keep the player inside the playground (blue square)
    onUpdate(() => {
        kat.pos.x = clamp(kat.pos.x, rectanglePosX, rectanglePosX + rectangleWidth - kat.width);
        kat.pos.y = clamp(kat.pos.y, rectanglePosY, rectanglePosY + rectangleHeight - kat.height);
    });

    return { kat, gun };
}