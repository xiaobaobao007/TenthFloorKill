import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {random} from "../../util/MathUtil";
import {CARD_GONG_KAI_WEN_BEN, CLIENT_STRING_DATA} from "../../util/Constant";
import {InitManager} from "../../manager/InitManager";
import {_0_WaitPlayerChooseButton, ButtonData, ButtonEvent} from "../cardEvent/_0_WaitPlayerChooseButton";
import {_7_DiscardEvent} from "../normalEvent/_0_base/_7_DiscardEvent";

/**
 * 公开文本：替换一名玩家手牌，抽到公开文本则弃掉
 */
export class GongKaiWenBen extends Card implements ButtonEvent {

    private readonly camp: string;
    private readonly allDoing: number;
    private readonly otherDoing: number;

    private allCampTip!: string;
    private otherCampTips!: string;

    constructor(color: string,
                direction: string,
                operation: string,
                lock: boolean,
                camp: string,
                allDoing: number,
                otherDoing: number,
                tips: string) {
        super(CARD_GONG_KAI_WEN_BEN, color, direction, operation, lock, CARD_GONG_KAI_WEN_BEN + "_" + tips);

        this.camp = camp;
        this.allDoing = allDoing;
        this.otherDoing = otherDoing;
    }

    initData() {
        let allTips = this.getOperatorTips(this.allDoing);
        this.allCampTip = "所有人" + allTips;
        this.otherCampTips = "非【" + InitManager.getStringValue(this.camp) + "】" + this.getOperatorTips(this.otherDoing);
        const value = this.allCampTip + "；" + this.otherCampTips;
        InitManager.setStringValue(this.otherTips, value);
        CLIENT_STRING_DATA.push({name: this.otherTips, value: value});
    }

    private getOperatorTips(num: number): string {
        return (num < 0 ? "弃" : "抽") + Math.abs(num) + "张";
    }

    public canUse(toCard: Card | undefined, eventPlayer: Player): boolean {
        if (eventPlayer != undefined && this._belong != eventPlayer && eventPlayer.handCardArray.length > 0) {
            return true;
        }
        this._belong?.sendTips("请重新选择玩家");
        return false;
    }

    doEvent(ignore: Card, eventPlayer: Player) {
        const room = this.belong!.room!;

        let card1: Card | undefined = undefined;
        if (eventPlayer.handCardArray.length > 0) {
            card1 = eventPlayer.handCardArray[random(eventPlayer.handCardArray.length)];
        }

        if (card1 != undefined) {
            if (card1 instanceof GongKaiWenBen) {
                room.addEventTips("【" + this.belong!.account + "】替换到了公开文本");
            } else {
                this._belong?.addCardArray([card1], "对" + eventPlayer.account + "公开文本");
            }
            eventPlayer.removeCard(card1);
        }

        eventPlayer.addCardArray([this], "被" + this.belong!.account + "公开文本");
    }

    receiveIntelligenceAfter(receivePlayer: Player) {
        let room = this.belong!.room!;
        room.addEventTips(receivePlayer.account + "正在执行【公开文本】的效果：" + InitManager.getStringValue(this.otherTips));

        let buttonArray: ButtonData[] = [];
        if (receivePlayer.camp == this.camp) {
            buttonArray.push({type: "success", chooseIndex: "0", name: this.allCampTip});
            buttonArray.push({type: "cancel", chooseIndex: undefined, name: this.otherCampTips});
        } else {
            buttonArray.push({type: "success", chooseIndex: "0", name: this.allCampTip});
            buttonArray.push({type: "success", chooseIndex: "1", name: this.otherCampTips});
        }
        room.eventStack.push(new _0_WaitPlayerChooseButton(buttonArray, this, this.belong!, receivePlayer));
    }

    button_0(player: Player, eventPlayer: Player) {
        this.todoCard(this.allDoing, eventPlayer);
    }

    button_1(player: Player, eventPlayer: Player) {
        if (eventPlayer.camp == this.camp) {
            return this.button_0(player, eventPlayer);
        }
        this.button_0(player, eventPlayer);
    }

    button_2(player: Player, eventPlayer: Player) {
        this.button_0(player, eventPlayer);
    }

    button_fail(player: Player, eventPlayer: Player) {
        this.button_0(player, eventPlayer);
    }

    private todoCard(num: number, player: Player) {
        const room = player.room!;
        if (num < 0) {
            if (player.handCardArray.length == 0) {
                room.addEventTips(player.account + "没有手牌可以弃");
                return;
            }
            room.eventStack.push(new _7_DiscardEvent(player, Math.min(Math.abs(num), player.handCardArray.length)));
        } else {
            room.playerAddNewHandCard(player, num, "公开文本情报效果");
        }
    }

}