import {Player} from "../../../model/Player";
import {Room} from "../../../model/Room";
import {Event} from "../../Event";
import {EventType} from "../../EventType";
import {GAME_CONFIG} from "../../../util/Constant";
import {Card} from "../../../model/Card";
import {_6_PlayerRoundEnd} from "./_6_PlayerRoundEnd";
import {Stack} from "../../../util/Stack";

export class _5_IntelligenceCircle implements Event {
    private static readonly SEND_BUTTON_INFO = {
        buttonArray: [
            {classType: "submit", needCardNum: 1, needPlayerNum: 1, root: "game/sendIntelligence", name: "发情报",},
        ]
    }

    private readonly currentPlayer: Player;
    private readonly intelligenceCard: Card;//要传出的情报
    private readonly circlePlayerStack: Stack<Player>;//情报传递顺序
    private lastTime = GAME_CONFIG.ROUND_ALL_TIME;

    private currentEventType = EventType.NONE;

    constructor(currentPlayer: Player, intelligenceCard: Card, targetPlayer: Player) {
        this.currentPlayer = currentPlayer;
        this.intelligenceCard = intelligenceCard;
        this.circlePlayerStack = this.getCirclePlayerArray(targetPlayer);
    }

    getEffectType(room: Room): EventType {
        switch (this.currentEventType) {
            case EventType.NONE:
                return EventType.PRE;
        }
        return EventType.NONE;

        // let data = {
        //     account: this.currentPlayer.account,
        //     time: this.lastTime,
        //     allTime: GAME_CONFIG.ROUND_ALL_TIME,
        //     allTips: this.currentPlayer.account + "的情报阶段",
        //     myTips: "请选择1张情报和1名玩家",
        // }
        //
        // room.broadcast("roomEvent/updateTime", data);
        //
        // if (this.lastTime <= 0) {
        //     return EventType.REMOVE_AND_NEXT;
        // }
        //
        // if (this.lastTime === GAME_CONFIG.ROUND_ALL_TIME) {
        //     this.sendClientInfo(room, this.currentPlayer);
        // }
        //
        // this.lastTime -= GAME_CONFIG.GAME_FRAME_TIME;
        // return EventType.NONE;
    }

    prv(room: Room): void {
        if (this.intelligenceCard.hand) {
            //移除玩家手牌
            this.currentPlayer.removeCard(this.intelligenceCard);
        }
    }

    doEvent(room: Room): void {
        throw new Error("Method not implemented.");
    }

    over(room: Room): void {
        throw new Error("Method not implemented.");
    }

    nextEvent(room: Room): Event {
        this.currentPlayer.send("roomEvent/clearButton");
        return new _6_PlayerRoundEnd(this.currentPlayer);
    }

    sendClientInfo(room: Room, player: Player): void {
    }

    private getCirclePlayerArray(targetPlayer: Player): Stack<Player> {
        return new Stack<Player>();
    }

}