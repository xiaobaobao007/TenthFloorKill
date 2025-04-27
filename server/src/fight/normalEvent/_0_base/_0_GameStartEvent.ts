import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {_1_SearchNextPlayer} from "./_1_SearchNextPlayer";
import {Player} from "../../../model/Player";
import {Stack} from "../../../util/Stack";
import {EventManager} from "../../../manager/EventManager";
import {_1_PlayerUseCardSuccess} from "../../cardEvent/_1_PlayerUseCardSuccess";

export class _0_GameStartEvent implements Event {
    private currentEventType = EventType.NONE;

    private _round: number = 0;//回合数
    private _roundEvent: Stack<_1_PlayerUseCardSuccess> = new Stack();//已成功执行影响的事件

    getEffectType(room: Room): EventType {
        if (this.currentEventType == EventType.NONE) {
            this.currentEventType = EventType.EFFECT;
            return EventType.PRE;
        } else if (this.currentEventType == EventType.EFFECT) {
            this.currentEventType = EventType.NEXT;
            return EventType.EFFECT;
        } else {
            return EventType.NEXT;
        }
    }

    prv(room: Room): void {
        room.updateRoomToAllPlayer();
    }

    doEvent(room: Room): void {
        for (const player of room.playerArray) {
            room.playerAddNewHandCard(player, GAME_CONFIG.GAME_INIT_CARD_NUM, "游戏开始");
        }
    }

    frameOver(room: Room): void {
    }

    nextEvent(room: Room): Event {
        return new _1_SearchNextPlayer();
    }

    sendClientInfo(room: Room, player: Player): void {
    }

    reLogin(room: Room, player: Player) {
        for (const event of this._roundEvent.getItems()) {
            event.sendClientInfo(room, player);
        }
    }

    public static popRoundEvent(room: Room) {
        (EventManager.getEvent(room, _0_GameStartEvent.name) as _0_GameStartEvent).roundEvent.pop();
    }

    get roundEvent(): Stack<_1_PlayerUseCardSuccess> {
        return this._roundEvent;
    }

    get round(): number {
        return this._round;
    }

    set round(value: number) {
        this._round = value;
    }
}