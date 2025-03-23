import { resetGameConfig } from "../config.js";

export function createGameOverScene() {
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
            resetGameConfig();
            go("game");
        });
    });
}