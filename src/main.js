import kaplay from "kaplay";

kaplay({
    font: "daydream",
});

loadSprite("kat", "sprites/kat.png");
loadSprite("skull", "sprites/skuller.png");
loadSprite("kaboom", "sprites/kaboom.png");
loadSprite("gun", "sprites/gun.png");
loadSound("explosion", "sounds/explosion.mp3");
loadFont("daydream", "fonts/Daydream.ttf");

const speed = 500;
const enemySpeed = 200;
let maxHP = 3;
let playerHP = maxHP;
let enemyDamage = 1;
let canTakeDamage = true;
let shootCooldown = 2;
let lastShotTime = 0;
let weaponRange = 500;

setLayers(["background", "game", "ui"], "game");

scene("gameover", () => {
    add([rect(width(), height()), color(0, 0, 0), layer("background")]);

    add([
        text("Game Over", { size: 48, width: width() }),
        pos(width() / 2, height() / 3),
        layer("ui"),
    ]);

    add([
        text("Press R to Restart", { size: 24, width: width() }),
        pos(width() / 2, height() / 2),
        layer("ui"),
    ]);

    onKeyPress("r", () => {
        playerHP = maxHP;
        go("game");
    });
});

scene("game", () => {
    const kat = add([
        sprite("kat"),
        pos(1000, 100),
        area(),
        body(),
        layer("game"),
        "player",
    ]);

    const skull = add([
        sprite("skull"),
        pos(50, 50),
        area(),
        body(),
        layer("game"),
        "enemy",
    ]);

    const gun = add([
        sprite("gun"),
        pos(kat.pos.x + 30, kat.pos.y),
        layer("game"),
        "gun",
    ]);

    function getClosestEnemy() {
        const enemies = get("enemy");
        let closestEnemy = null;
        let minDist = Infinity;

        for (let enemy of enemies) {
            const dist = kat.pos.dist(enemy.pos);
            if (dist < minDist) {
                minDist = dist;
                closestEnemy = enemy;
            }
        }
        return closestEnemy;
    }

    add([rect(width(), height()), color(0, 0, 200), layer("background")]);

    const hpBarContainer = add([
        rect(200, 20),
        pos(20, 20),
        color(0, 0, 0),
        layer("ui"),
        fixed(),
    ]);

    const hpBar = add([
        rect(200, 20),
        pos(20, 20),
        color(255, 0, 0),
        layer("ui"),
        fixed(),
    ]);

    const hpText = add([
        text(`${playerHP} / ${maxHP}`, { size: 12 }),
        pos(100, 20),
        layer("ui"),
        fixed(),
    ]);

    function updateHPBar() {
        hpBar.width = (playerHP / maxHP) * 200;
        hpText.text = `${playerHP} / ${maxHP}`;
    }

    kat.onCollide("enemy", () => {
        if (canTakeDamage) {
            playerHP -= enemyDamage;
            updateHPBar();
            addKaboom(kat.pos);
            shake();
            play("explosion");

            if (playerHP <= 0) {
                destroy(kat);
                destroy(gun);
                addKaboom(kat.pos);
                wait(1, () => go("gameover"));
            } else {
                canTakeDamage = false;
                wait(1, () => (canTakeDamage = true));
            }
        }
    });

    onKeyDown("left", () => kat.move(-speed, 0));
    onKeyDown("right", () => kat.move(speed, 0));
    onKeyDown("up", () => kat.move(0, -speed));
    onKeyDown("down", () => kat.move(0, speed));

    onUpdate(() => {
        const closestEnemy = getClosestEnemy();
        const currentTime = time();

        const direction = kat.pos.x < width() / 2 ? vec2(-1, 0) : vec2(1, 0);
        gun.pos = kat.pos.add(direction.scale(30));

        if (closestEnemy) {
            const dist = kat.pos.dist(closestEnemy.pos);
            const direction = closestEnemy.pos.sub(kat.pos).unit();
            const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);

            if (dist <= weaponRange) {
                gun.pos = kat.pos.add(direction.scale(30));
                gun.angle = angle;

                if (currentTime - lastShotTime >= shootCooldown) {
                    const bullet = add([
                        rect(10, 5),
                        pos(gun.pos),
                        color(255, 0, 0),
                        layer("game"),
                        "bullet",
                        area(),
                        {
                            speed: 1000,
                            dir: direction,
                        },
                    ]);

                    bullet.onUpdate(() => {
                        bullet.move(bullet.dir.scale(bullet.speed));
                    });

                    bullet.onCollide("enemy", (enemy) => {
                        destroy(bullet);
                        destroy(enemy);
                        addKaboom(enemy.pos);
                        play("explosion");
                    });

                    lastShotTime = currentTime;
                }
            }
        } else {
            const direction = kat.pos.x < width() / 2 ? vec2(-1, 0) : vec2(1, 0);
            gun.angle = 0;
            gun.flipX = (kat.pos.x < width() / 2);
            gun.flipY = false;
        }

        kat.pos.x = clamp(kat.pos.x, 0, width() - kat.width);
        kat.pos.y = clamp(kat.pos.y, 0, height() - kat.height);
    });

    onUpdate(() => {
        const direction = vec2(kat.pos.x - skull.pos.x, kat.pos.y - skull.pos.y);
        const length = Math.sqrt(direction.x * direction.x + direction.y * direction.y);
        const normalizedDirection = vec2(direction.x / length, direction.y / length);
        skull.move(normalizedDirection.scale(enemySpeed));
    });

    onUpdate(() => {
        setCamPos(kat.pos.x, kat.pos.y);
    });
});

go("game");