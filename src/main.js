import kaplay from "kaplay";

kaplay({
    font: "sproutland",
});

//Sprites
loadSprite("kat", "sprites/kat.png"); //Sprite of the player
loadSprite("skull", "sprites/skuller.png"); //Sprite of the enemy
loadSprite("kaboom", "sprites/kaboom.png"); //Sprite when taking damage
loadSprite("gun", "sprites/gun.png"); //Sprite of the gun
//Sounds
loadSound("explosion", "sounds/explosion.mp3");
loadSound("player_hurt", "sounds/player_hurt.mp3");
loadSound("skull_death", "sounds/skull_death.mp3");
//Fonts
loadFont("sproutland", "fonts/sproutLands.ttf");
 
//Game settings (which doesn't scale)
let canTakeDamage = true;
let isDead = false;
let waveActive = false;
let lastShotTime = 0;

//Game & enemies settings (which scales)
let enemySpeed = 200;
let enemyDamage = 1;
let waveDuration = 30;
let enemySpawnRate = 2;

//Stats that can be upgradables
let speed = 500;
let maxHP = 3;
let playerHP = maxHP; //Game setting, cannot be on top or will cause error
let shootCooldown = 2;
let weaponRange = 300;

setLayers(["background", 
    "playground",
    "game", 
    "ui"
], "game");

//Game Over scene
scene("gameover", () => {
    add([rect(width(), height()), color(0, 0, 0), layer("playground")]);

    add([
        text("Game Over", { size: 48}),
        pos(width() / 2, height() / 3),
        anchor("center"),
        layer("ui"),
    ]);

    add([
        text("Press R to Restart", { size: 24}),
        pos(width() / 2, height() / 2),
        anchor("center"),
        layer("ui"),
    ]);

    onKeyPress("r", () => {
        playerHP = maxHP;
        isDead = false;
        go("game");
    });
});

//Game scene
scene("game", () => {
    const rectangleWidth = 1300;
    const rectangleHeight = 1300;
    const rectanglePosX = (width() - rectangleWidth) / 2;
    const rectanglePosY = (height() - rectangleHeight) / 2;

    //Playground of the game, player and enemies move there
    add([rect(rectangleWidth, rectangleHeight), 
        pos(rectanglePosX, rectanglePosY), 
        color(0, 0, 200), 
        layer("playground")]);

    //Background of the playground, nobody can go there
    add([rect(width(), height()), color(0, 0, 0), layer("background"), fixed()]);

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

    function spawnEnemy() {
        let spawnPos;
        do {
            spawnPos = vec2(
                rand(rectanglePosX, rectanglePosX + rectangleWidth), 
                rand(rectanglePosY, rectanglePosY + rectangleHeight));
        } while (kat.pos.dist(spawnPos) < 300);
        
        add([
            sprite("skull"),
            pos(spawnPos),
            area(),
            body(),
            layer("game"),
            "enemy",
        ]);
    }

    function startWave() {
        waveActive = true;
        loop(enemySpawnRate, () => {
            if (waveActive) spawnEnemy();
        });
        wait(waveDuration, () => {
            waveActive = false;
        });
    }
    startWave();

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
        text(`${playerHP} / ${maxHP}`, { size: 18 }),
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
            play("player_hurt");
            flash("#cc425e", 0.2);

            if (playerHP <= 0) {
                isDead = true;
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

    onKeyDown("left", () => { if (!isDead) kat.move(-speed, 0); });
    onKeyDown("right", () => { if (!isDead) kat.move(speed, 0); });
    onKeyDown("up", () => { if (!isDead) kat.move(0, -speed); });
    onKeyDown("down", () => { if (!isDead) kat.move(0, speed); });


    onUpdate(() => {
        const closestEnemy = getClosestEnemy();
        const currentTime = time();
    
        if (closestEnemy) {
            const dist = kat.pos.dist(closestEnemy.pos);
            const direction = closestEnemy.pos.sub(kat.pos).unit();
            const angle = Math.atan2(direction.y, direction.x) * (180 / Math.PI);
            
            gun.pos = kat.pos.add(direction.scale(35)).add(vec2(30, 30));
            gun.angle = angle;
    
            if (dist <= weaponRange && currentTime - lastShotTime >= shootCooldown) {
                const bullet = add([
                    circle(7),
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
                    play("skull_death");
                });
    
                lastShotTime = currentTime;
            }
        } else {
            gun.pos = kat.pos.add(vec2(55, 10));
            gun.angle = 0;
        }
    
        kat.pos.x = clamp(kat.pos.x, rectanglePosX, rectanglePosX + rectangleWidth - kat.width);
        kat.pos.y = clamp(kat.pos.y, rectanglePosY, rectanglePosY + rectangleHeight - kat.height);
        
    });
    
    onUpdate(() => {
        const enemies = get("enemy");
        for (let enemy of enemies) {
            const direction = kat.pos.sub(enemy.pos).unit();
            enemy.move(direction.scale(enemySpeed));
        }
        camPos(kat.pos.x, kat.pos.y);
    });
});
    
go("game");