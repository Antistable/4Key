import { _decorator, Component, Node, find } from "cc";
import { Game } from "./Game";
const { ccclass } = _decorator;

@ccclass("Note")
export class Note extends Component {

    lastTime: number = 0;

    TRACK: number = -1;

    game: Game = null;

    isHolding: boolean = false;

    score: number = 0;

    start(): void {
        this.game = find("Game").getComponent(Game);
        this.node.setPosition(-345 + this.TRACK * 230, this.game.hitterY + 1500);
    }

    update(deltaTime: number): void {
        if (!this.isHolding) {
            this.node.setPosition(this.node.position.x, this.node.position.y - deltaTime * 1500);
        }
        if (this.node.position.y + this.lastTime * 1500 < this.game.hitterY - 200) {
            this.delete();
        }
    }

    delete(): void {
        this.game.closestNotes[this.TRACK].shift();
        this.node.destroy();
    }

}