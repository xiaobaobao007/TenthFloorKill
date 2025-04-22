import {Room} from "../../model/Room";
import {Event} from "../Event";
import {EventType} from "../EventType";
import {PoYi} from "../card/PoYi";
import {ROUTER} from "../../util/SocketUtil";

export class ShiPoCardEvent implements Event {
    poyiCard: PoYi;
    effectToCard: PoYi;

    constructor(poyiCard: PoYi, effectToCard: PoYi) {
        this.poyiCard = poyiCard;
        this.effectToCard = effectToCard;
    }

    getEffectType(room: Room): EventType {
        return EventType.EFFECT;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        this.sendClientInfo(room);
    }

    frameOver(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        throw new Error("Method not implemented.");
    }

    sendClientInfo(room: Room): void {
        const otherCardInfo = this.effectToCard.getSelfCardInfo();
        this.poyiCard.belong!.send(ROUTER.roomEvent.UPDATE_ALL_INTELLIGENCE, otherCardInfo);
    }

    public static canUse() {
    }
}