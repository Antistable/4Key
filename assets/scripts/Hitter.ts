import { _decorator, Component, sys, Sprite, math, CCInteger, find, Node, TERRAIN_HEIGHT_BASE, input, Input, __private, EventKeyboard, CCString, Label } from "cc";
import { Apple } from "./Apple";
import { Game } from "./Game";
import { Note } from "./Note";
import { Tail } from "./Tail";
const { ccclass, property } = _decorator;

@ccclass("Hitter")
export class Hitter extends Component {

    game: Game = null;

    @property({ type: CCInteger })
    readonly TRACK: number = -1;

    @property({ type: CCString })
    readonly KEYCODE: string = "";

    originalColor: math.Color = null;

    noteHolding: Node = null;

    noteHoldingDistance: number = -1;

    start(): void {
        this.game = find("Game").getComponent(Game);
        this.originalColor = this.getComponent(Sprite).color;

        if (sys.Platform.MOBILE_BROWSER === sys.platform) {
            const track = find(`Canvas/Track${this.TRACK}`);
            track.on("touch-start", this.touchStart, this);
            track.on("touch-end", this.touchEnd, this);
            track.on("touch-cancel", this.touchEnd, this);
        }
        else {
            input.on(Input.EventType.KEY_DOWN, this.onKeyDown, this);
            input.on(Input.EventType.KEY_UP, this.onKeyUp, this);
        }
    }

    onKeyUp(KEY_DOWN: EventKeyboard): void {
        switch (KEY_DOWN.keyCode) {
            case this.KEYCODE.charCodeAt(0):
                this.touchEnd();
                break;

            default:
                break;
        }
    }

    onKeyDown(KEY_DOWN: EventKeyboard): void {
        switch (KEY_DOWN.keyCode) {
            case this.KEYCODE.charCodeAt(0):
                this.touchStart();
                break;

            default:
                break;
        }
    }

    touchStart(): void {
        this.getComponent(Sprite).color = math.color(this.originalColor.r, this.originalColor.g, this.originalColor.b, 200);
        const closestNote = this.game.closestNotes[this.TRACK][0];
        if (closestNote) {
            const distance: number = Math.abs(closestNote.position.y - this.node.position.y);
            if (distance < 120) {
                if (closestNote.getComponent(Note).lastTime === 0) {
                    this.hitNote(closestNote, distance);
                }
                else {
                    this.holdNote(closestNote, distance);
                }
            }
        }
    }

    holdNote(closestNote: Node, distance: number): void {
        this.noteHoldingDistance = distance;
        this.noteHolding = closestNote;
        closestNote.getComponent(Note).isHolding = true;
        closestNote.getChildByName("Tail").getComponent(Tail).animate();
    }

    hitNote(closestNote: Node, distance: number): void {
        const apple: Node = closestNote.getChildByName("Apple");
        if (apple) {
            if (distance < 50) {
                apple.getComponent(Apple).animate(true);
                this.game.score += closestNote.getComponent(Note).score;
            }
            else {
                apple.getComponent(Apple).animate(false);
                this.game.score += Math.floor(closestNote.getComponent(Note).score / 2);
            }
            find("Canvas/Score").getComponent(Label).string = `${this.game.score ? "0".repeat(6 - Math.floor(Math.log10(this.game.score) /*位数-1*/)) /*高位补0*/ : "0".repeat(6)}${this.game.score}`;
            closestNote.getComponent(Note).delete();
        }
    }

    touchEnd(): void {
        this.getComponent(Sprite).color = math.color(this.originalColor.r, this.originalColor.g, this.originalColor.b, 100);
        this.endHold();
    }

    endHold(): void {
        if (this.noteHolding) {
            if (this.noteHolding.getChildByName("Tail").getComponent(Tail).isAnimating === false) {
                this.hitNote(this.noteHolding, this.noteHoldingDistance);
            }
            else {
                this.noteHolding.getComponent(Note).delete();
            }
            this.noteHolding = null;
            this.noteHoldingDistance = -1;
        }
    }

}