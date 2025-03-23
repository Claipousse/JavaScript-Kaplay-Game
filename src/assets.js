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
    loadSound("skull_death", "sounds/skull_death.mp3");

    //Fonts
    loadFont("sproutland", "fonts/sproutLands.ttf");
}