import kaplay from "kaplay";
import { loadAssets } from "./assets.js";
import { LAYERS, DEFAULT_LAYER } from "./config.js";
import { createGameScene } from "./scenes/game.js";
import { createGameOverScene } from "./scenes/gameover.js";

// Initialisation of Kaplay
kaplay({
    font: "sproutland",
    title: "Kattack"
});

// Loading assets (sprites, sounds, fonts)
loadAssets();

// Loading layers
setLayers(LAYERS, DEFAULT_LAYER);

// Loading scenes
createGameScene();
createGameOverScene();

// Start the game
go("game");