import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {Player} from "../../model/Player";
import {GAME_CONFIG} from "../../util/Constant";

export interface ButtonEvent {
    success(player: Player, eventPlayer: Player): boolean;

    fail(player: Player, eventPlayer: Player): boolean;
}

export class _0_WaitPlayerChooseButton implements Event {
    private readonly successTip: string;
    private readonly failTip: string;
    private readonly fatherEvent: ButtonEvent;
    private readonly fromPlayer: Player;
    private readonly toPlayer: Player;

    private choose: boolean | undefined;
    private lastTime = GAME_CONFIG._3_PlayerRounding_TIME;

    constructor(successTip: string, failTip: string, fatherEvent: ButtonEvent, fromPlayer: Player, toPlayer: Player) {
        this.successTip = successTip;
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
            if (this.choose == undefined) {
                this.choose = false;
            }

            if (this.choose) {
                if (!this.fatherEvent.success(this.fromPlayer, this.toPlayer)) {
                    this.fatherEvent.fail(this.fromPlayer, this.toPlayer);
                }
            } else {
                if (!this.fatherEvent.fail(this.fromPlayer, this.toPlayer)) {
                    this.fatherEvent.success(this.fromPlayer, this.toPlayer);
                }
            }

            this.toPlayer.clearButton();

            return EventType.REMOVE;
        }
    }

    prv(room: Room): void {
        this.sendClientInfo(room, this.toPlayer);

        if (this.toPlayer.ai) {
            this.choose = false;
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

        this.toPlayer.showButton({
            buttonArray: [
                {classType: "success", root: "game/chooseButtonSuccess", name: this.successTip},
                {classType: "success", root: "game/chooseButtonFail", name: this.failTip},
            ]
        });
    }

    chooseSuccessOrFail(player: Player, success: boolean) {
        if (this.toPlayer != player) {
            return;
        }

        this.choose = success;
        this.lastTime = 0;
    }

}