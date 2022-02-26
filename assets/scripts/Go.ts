import { _decorator, Component, find } from "cc";
import { Game } from "./Game";
const { ccclass } = _decorator;

@ccclass("Go")
export class Go extends Component {

    start(): void {
        this.node.on("touch-end", ((): void => {
            this.scheduleOnce((): void => { find("Game").getComponent(Game).begin(); });
            find("Canvas/Abort").active = true;
        }), this);
    }

}