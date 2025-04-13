import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {_3_PlayerRounding} from "./_3_PlayerRounding";

export class _2_PlayerRoundStart implements Event {
    private currentPlayer: Player;
    private hadEffect = false;

    constructor(currentPlayer: Player) {
        this.currentPlayer = currentPlayer;
    }

    getEffectType(room: Room): EventType {
        if (this.hadEffect) {
            return EventType.REMOVE_AND_NEXT;
        }
        this.hadEffect = true;
        return EventType.EFFECT;
    }

    prv(room: Room): void {
        throw new Error("Method not implemented.");
    }

    doEvent(room: Room): void {
        let newPlayerCardArray = room.getNewPlayerCard(2);
        this.currentPlayer.addCardArray(newPlayerCardArray);

        let handClientInfo = [];
        for (let card of newPlayerCardArray) {
            handClientInfo.push(card.getClientInfo());
        }
        this.currentPlayer.send("roomEvent/newHandCard", {handCard: handClientInfo,});

        let otherData = {
            account: this.currentPlayer.account,
            handCardNum: this.currentPlayer.handCardArray.length,
        };
        room.broadcast("roomEvent/updateHandCardNum", otherData);
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        return new _3_PlayerRounding(this.currentPlayer);
    }
}