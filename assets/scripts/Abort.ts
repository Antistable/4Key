import { _decorator, Component, Node, find } from "cc";
import { Game } from "./Game";
const { ccclass, property } = _decorator;

@ccclass("Abort")
export class Abort extends Component {

    game: Game = null;

    start(): void {
        this.game = find("Game").getComponent(Game)
        this.node.on("touch-end", this.abort, this);
        this.node.active = false;
    }

    abort(): void {
        this.game.unscheduleAllCallbacks();
        this.game.settle();
        this.node.active = false;
    }
    
}