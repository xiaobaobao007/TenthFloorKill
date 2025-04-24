import {Card} from "../../model/Card";
import {Player} from "../../model/Player";
import {random} from "../../util/MathUtil";
import {CARD_GONG_KAI_WEN_BEN, CLIENT_STRING_DATA} from "../../util/Constant";
import {InitManager} from "../../manager/InitManager";

/**
 * 公开文本：替换一名玩家手牌，抽到公开文本则弃掉
 */
export class GongKaiWenBen extends Card {

    private readonly camp: string;
    private readonly campDoing: number;
    private readonly otherDoing1: number;
    private readonly otherDoing2: number;

    constructor(cardId: string,
                color: string,
                direction: string,
                operation: string,
                lock: boolean,
                camp: string,
                campDoing: number,
                otherDoing1: number,
                otherDoing2: number,
                tips: string) {
        super(cardId, color, direction, operation, lock, CARD_GONG_KAI_WEN_BEN + "_" + tips);

        this.camp = camp;
        this.campDoing = campDoing;
        this.otherDoing1 = otherDoing1;
        this.otherDoing2 = otherDoing2;
    }

    initData() {
        const value = this.getValue();
        InitManager.setStringValue(this.otherTips, value);
        CLIENT_STRING_DATA.push({name: this.otherTips, value: value});
    }

    private getValue(): string {
        let s = "【" + InitManager.getStringValue(this.camp) + "】：" + this.getOperator(this.campDoing);
        s += "，其他:" + this.getOperator(this.otherDoing1) + "或" + this.getOperator(this.otherDoing2);
        return s;
    }

    private getOperator(num: number): string {
        let s = "";
        if (num < 0) {
            s = "弃";
            num *= -1;
        } else {
            s = "抽";
        }

        return s + num + "张";
    }

    public canUse(toCard: Card, eventPlayer: Player): boolean {
        if (eventPlayer != undefined && this._belong != eventPlayer && eventPlayer.handCardArray.length > 0) {
            return true;
        }
        this._belong?.sendTips("请重新选择玩家");
        return false;
    }

    doEvent(ignore: Card, eventPlayer: Player) {
        const room = this.belong!.room!;
        room.addEventTips("【" + this.belong!.account + "】对【" + eventPlayer.account + "】使用了公开文本");

        let card1: Card | undefined = undefined;
        if (eventPlayer.handCardArray.length > 0) {
            card1 = eventPlayer.handCardArray[random(eventPlayer.handCardArray.length)];
        }

        if (card1 != undefined) {
            if (card1 instanceof GongKaiWenBen) {
                room.addEventTips("【" + this.belong!.account + "】替换到了公开文本");
                eventPlayer.removeCard(card1, true);
            } else {
                this._belong?.addCardArray([card1], "对" + eventPlayer.account + "公开文本");
            }
        }

        eventPlayer.addCardArray([this], "被" + this.belong!.account + "公开文本");
    }
}