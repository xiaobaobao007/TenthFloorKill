import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {GAME_CONFIG} from "../../util/Constant";

export interface ButtonEvent {
    button_0(player: Player, eventPlayer: Player): void;

    button_1(player: Player, eventPlayer: Player): void;

    button_2(player: Player, eventPlayer: Player): void;

    button_fail(player: Player, eventPlayer: Player): void;
}

export interface ButtonData {
    type: "success" | "cancel";
    chooseIndex: "0" | "1" | "2" | "fail" | undefined;
    name: string;
}

export class _0_WaitPlayerChooseButton implements Event {
    private readonly buttonArray: ButtonData[];
    private readonly fatherEvent: ButtonEvent;
    private readonly fromPlayer: Player;
    private readonly toPlayer: Player;

    private chooseIndex: string | undefined;
    private lastTime = GAME_CONFIG._3_PlayerRounding_TIME;

    constructor(buttonArray: ButtonData[], fatherEvent: ButtonEvent, fromPlayer: Player, toPlayer: Player) {
        this.buttonArray = buttonArray;
        this.fatherEvent = fatherEvent;
        this.fromPlayer = fromPlayer;
        this.toPlayer = toPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.lastTime === GAME_CONFIG._3_PlayerRounding_TIME) {
            return EventType.PRE;
        } else if (this.lastTime >= 0) {
            return EventType.NONE;
        } else {
            return EventType.REMOVE_AND_NEXT;
        }
    }

    prv(room: Room): void {
        this.sendClientInfo(room, this.toPlayer);

        if (this.toPlayer.ai) {
            this.lastTime = 0;
        }
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    frameOver(room: Room): void {
        if (this.lastTime % GAME_CONFIG.UPDATE_PLAYER_TIME == 0) {
            let data = {
                account: this.toPlayer.account,
                time: this.lastTime,
                allTime: GAME_CONFIG._3_PlayerRounding_TIME,
                allTips: "【" + this.toPlayer.account + "】正在思考",
                myTips: "请进行按钮选择",
            };

            room.updateTime(data);
        }

        this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
    }

    nextEvent(room: Room): Event | undefined {
        if (this.chooseIndex == "0") {
            this.fatherEvent.button_0(this.fromPlayer, this.toPlayer);
        } else if (this.chooseIndex == "1") {
            this.fatherEvent.button_1(this.fromPlayer, this.toPlayer);
        } else if (this.chooseIndex == "2") {
            this.fatherEvent.button_2(this.fromPlayer, this.toPlayer);
        } else {
            this.fatherEvent.button_fail(this.fromPlayer, this.toPlayer);
        }

        this.toPlayer.clearButton();
        return;
    }

    sendClientInfo(room: Room, player: Player | undefined): void {
        if (player && player != this.toPlayer) {
            return;
        }

        let clientShow: any[] = [];
        this.buttonArray.forEach(button => clientShow.push({
            classType: button.type,
            root: button.chooseIndex ? ("game/choose_button_" + button.chooseIndex) : "",
            name: button.name
        }))
        this.toPlayer.showButton({buttonArray: clientShow});
    }

    chooseButton(player: Player, chooseIndex: string) {
        if (this.toPlayer != player) {
            return;
        }

        for (const button of this.buttonArray) {
            if (button.chooseIndex == chooseIndex) {
                this.chooseIndex = chooseIndex;
                this.lastTime = 0;
                return;
            }
        }
    }

}