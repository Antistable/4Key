import { _decorator, Component, Node, Prefab, instantiate, find, Label, AudioSource, sys } from "cc";
import { Note } from "./Note";
import chart from "./chart";
const { ccclass, property } = _decorator;

interface NoteConfig {
    Track: 0 | 1 | 2 | 3;
    AppearTime: number;
    LastTime?: number;
}

@ccclass("Game")
export class Game extends Component {

    @property({ type: Prefab })
    readonly notePrefab: Prefab = null;

    audioSource: AudioSource = null;

    readonly Chart: NoteConfig[] = chart as NoteConfig[];

    closestNotes: Node[][] = [[], [], [], []];

    hitterY: number = null;

    score: number = 0;

    start(): void {
        this.audioSource = this.getComponent(AudioSource);
        find("Canvas/Whiteboard/Trophy").on("touch-end", (): void => {
            this.execute("showList()");
        }, this);
        find("Canvas/Github").on("touch-end", (): void => {
            sys.openURL("https://github.com/Antistable/4Key");
        })
        this.hitterY = find("Canvas/Hitter0").position.y;
    }

    begin(): void {
        this.score = 0;
        find("Canvas/Score").getComponent(Label).string = `${"0".repeat(7)}`;
        find("Canvas/Whiteboard").active = false;
        this.Chart.forEach((noteConfig: NoteConfig, index: number): void => {
            this.initNote(noteConfig, this.Chart.length, index === this.Chart.length - 1);
        });
        this.scheduleOnce(this.settle, 2 + this.Chart[this.Chart.length - 1].AppearTime + (this.Chart[this.Chart.length - 1].LastTime ?? 0));
        this.audioSource.play();
        this.audioSource.volume = 1;
    }

    settle(): void {
        find("Canvas/Abort").active = false;
        find("Canvas/Whiteboard").active = true;
        find("Canvas/Whiteboard/Info").getComponent(Label).string = `Congrats!\n\nYou get ${this.score}!`;
        this.execute(`updateScore(${this.score})`);
    }

    initNote(noteConfig: NoteConfig, noteNum: number, isLastNote): void {
        this.scheduleOnce((): void => {
            const note: Node = instantiate(this.notePrefab);
            this.closestNotes[noteConfig.Track].push(note);
            note.getComponent(Note).TRACK = noteConfig.Track;
            note.getComponent(Note).lastTime = noteConfig.LastTime ?? 0;
            note.getComponent(Note).score = isLastNote ? 1000000 - (noteNum - 1) * Math.floor(1000000 / (noteNum - 1)) : Math.floor(1000000 / (noteNum - 1));
            note.parent = find("Canvas");
        }, noteConfig.AppearTime);
    }

    execute(statement: string): void {
        eval(`try{${statement}}catch{}`);
    }

}