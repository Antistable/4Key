import { _decorator, Component, Node, SpriteFrame, Sprite, UITransform, Size, UIOpacity, find } from "cc";
const { ccclass, property } = _decorator;

@ccclass("Apple")
export class Apple extends Component {

    @property({ type: SpriteFrame })
    readonly goldenApple: SpriteFrame = null;

    @property({ type: SpriteFrame })
    readonly silverApple: SpriteFrame = null;

    isAnimating: boolean = false;

    originalParent: Node = null;

    start(): void {
        this.originalParent = this.node.parent;
    }

    animate(isGold: boolean): void {
        this.node.parent = find("Canvas");
        this.node.setPosition(this.originalParent.getPosition());
        if (isGold) {
            this.getComponent(Sprite).spriteFrame = this.goldenApple;
        }
        this.isAnimating = true;
    }

    update(deltaTime: number): void {
        if (this.isAnimating) {
            this.node.angle += deltaTime * 540;
            let size: Size = this.getComponent(UITransform).contentSize;
            this.getComponent(UITransform).contentSize = new Size(size.width + deltaTime * 200, size.height + deltaTime * 200);
            let opacityComponent: UIOpacity = this.getComponent(UIOpacity);
            opacityComponent.opacity -= deltaTime * 255;
            if (opacityComponent.opacity <= 0) {
                this.node.destroy();
            }
        }
    }

}