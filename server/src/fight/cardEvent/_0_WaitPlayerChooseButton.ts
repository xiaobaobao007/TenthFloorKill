import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {GAME_CONFIG} from "../../util/Constant";

export interface ButtonEvent {
    button_0(player: Player, eventPlayer: Player): boolean;

    button_1(player: Player, eventPlayer: Player): boolean;

    button_2(player: Player, eventPlayer: Player): boolean;

    button_fail(player: Player, eventPlayer: Player): boolean;
}

export class _0_WaitPlayerChooseButton implements Event {
    private readonly successTips: string[];
    private readonly failTip: string;
    private readonly fatherEvent: ButtonEvent;
    private readonly fromPlayer: Player;
    private readonly toPlayer: Player;

    private chooseIndex: number = -1;
    private lastTime = GAME_CONFIG._3_PlayerRounding_TIME;

    constructor(successTips: string[], failTip: string, fatherEvent: ButtonEvent, fromPlayer: Player, toPlayer: Player) {
        this.successTips = successTips;
        this.failTip = failTip;
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

            let success = false;
            if (this.chooseIndex == 0) {
                success = this.fatherEvent.button_0(this.fromPlayer, this.toPlayer);
            } else if (this.chooseIndex == 1) {
                success = this.fatherEvent.button_1(this.fromPlayer, this.toPlayer);
            } else if (this.chooseIndex == 2) {
                success = this.fatherEvent.button_2(this.fromPlayer, this.toPlayer);
            }

            if (!success) {
                this.fatherEvent.button_fail(this.fromPlayer, this.toPlayer);
            }

            this.toPlayer.clearButton();

            return EventType.REMOVE;
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
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room, player: Player | undefined): void {
        if (player && player != this.toPlayer) {
            return;
        }

        let buttonArray = [];
        for (let i = 0; i < this.successTips.length; i++) {
            buttonArray.push({classType: "success", root: "game/choose_button_" + i, name: this.successTips[i]});
        }
        buttonArray.push({classType: "success", root: "game/choose_button_fail", name: this.failTip});

        this.toPlayer.showButton({buttonArray: buttonArray});
    }

    chooseButton(player: Player, chooseIndex: number) {
        if (this.toPlayer != player) {
            return;
        }

        if (chooseIndex >= 0 && chooseIndex >= this.successTips.length) {
            return;
        }

        this.chooseIndex = chooseIndex;
        this.lastTime = 0;
    }

}