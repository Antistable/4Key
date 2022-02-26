import { _decorator, Component, Node, UITransform, find } from "cc";
import { Hitter } from "./Hitter";
import { Note } from "./Note";
const { ccclass, property } = _decorator;

@ccclass("Tail")
export class Tail extends Component {

    isAnimating: boolean = false;

    start(): void {
        const length = this.node.parent.getComponent(Note).lastTime * 1500;
        this.getComponent(UITransform).height = length;
        this.node.setPosition(0, 30 + length / 2);
    }

    animate(): void {
        this.isAnimating = true;
    }

    update(deltaTime: number): void {
        if (this.isAnimating) {
            this.node.setPosition(0, this.node.position.y - deltaTime * 750);
            if ((this.getComponent(UITransform).height -= deltaTime * 1500) <= 0) {
                this.isAnimating = false;
                find(`Canvas/Hitter${this.node.parent.getComponent(Note).TRACK}`).getComponent(Hitter).endHold();
                this.destroy();
            }
        }
    }

}