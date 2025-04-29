import {Card} from "../../model/Card";
import {ROUTER} from "../../util/SocketUtil";
import {CARD_MI_MI_XIA_DA, COLOR_, COLOR_BLUE, COLOR_GREY, COLOR_RED} from "../../util/Constant";
import {Player} from "../../model/Player";
import {InitManager} from "../../manager/InitManager";
import {_0_WaitPlayerChooseOneCard, ChooseCardEvent} from "../cardEvent/_0_WaitPlayerChooseOneCard";
import {EventManager} from "../../manager/EventManager";
import {_0_GameStartEvent} from "../normalEvent/_0_base/_0_GameStartEvent";
import {Room} from "../../model/Room";
import {SaveCard} from "./base/SaveCard";

export class MiMiXiaDa extends SaveCard implements ChooseCardEvent {
    constructor(color: string, direction: string, operation: string, lock: boolean) {
        super(CARD_MI_MI_XIA_DA, color, direction, operation, lock);
    }

    canUse(): boolean {
        return !this._belong!.inRounding;
    }

    doEvent(eventCard: Card, player: undefined, chooseColor: string | undefined) {
        chooseColor = MiMiXiaDa.getColor(chooseColor);

        const room = this._belong?.room!;
        let eventPlayer = room.getInRoundPlayer()!;

        let tips = "【" + this._belong?.account + "】要求你下发【" + InitManager.getStringValue(COLOR_ + chooseColor) + "】";
        eventPlayer.send(ROUTER.roomEvent.ADD_EVENT_TIPS, tips);

        let effectError = true;

        let allName = "";
        for (let card of eventPlayer.handCardArray) {
            if (card.isSameColor(chooseColor)) {
                effectError = false;
                break;
            }

            if (allName != "") allName += ",";
            allName += card.getName();
        }

        if (effectError) {
            this._belong?.send(ROUTER.roomEvent.ADD_EVENT_TIPS, "【" + eventPlayer?.account + "】的手牌有【" + allName + "】");
            this.belong!.room?.eventStack.push(new _0_WaitPlayerChooseOneCard("请查看【" + eventPlayer.account + "】的手牌", "确认", this, this.belong!, eventPlayer, undefined));
        }

        for (const one of (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.getItems()) {
            if (one.playerCard instanceof MiMiXiaDa && (effectError || one.playerCard != this)) {
                one.canEffect = false;
            }
        }
    }

    choose(toPlayer: Player, card: Card | undefined): void {
    }

    private static getColor(chooseColor: string | undefined): string {
        if (chooseColor == COLOR_GREY || chooseColor == COLOR_BLUE || chooseColor == COLOR_RED) {
            return chooseColor;
        }
        return COLOR_GREY;
    }

    public static getMiMiXiaDaColor(room: Room): string | undefined {
        for (let event of (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.getItems()) {
            if (event.canEffect && event.playerCard instanceof MiMiXiaDa) {
                return MiMiXiaDa.getColor(event.param);
            }
        }
        return undefined;
    }

}