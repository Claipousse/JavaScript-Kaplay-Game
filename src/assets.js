export function loadAssets() {
  //Sprites
    loadSprite("kat", "sprites/kat.png"); //Sprite of the player
    loadSprite("skull", "sprites/skuller.png"); //Sprite of the enemy
    loadSprite("kaboom", "sprites/kaboom.png"); //Sprite when taking damage
    loadSprite("gun", "sprites/gun.png"); //Sprite of the gun
    loadSprite("coin", "sprites/coin.png"); //Sprite of the coin
    
    //Sounds
    loadSound("explosion", "sounds/explosion.mp3");
    loadSound("player_hurt", "sounds/player_hurt.mp3");
    loadSound("skull_death1", "sounds/skull_death-1.mp3");
    loadSound("skull_death2", "sounds/skull_death-2.mp3");
    loadSound("skull_death3", "sounds/skull_death-3.mp3");
    loadSound("coin1", "sounds/coin-1.mp3");
    loadSound("coin2", "sounds/coin-2.mp3");
    loadSound("coin3", "sounds/coin-3.mp3");
    loadSound("coin4", "sounds/coin-4.mp3");

    //Fonts
    loadFont("dreamate", "fonts/Dreamate.ttf");
}