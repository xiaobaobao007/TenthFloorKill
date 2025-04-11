import {CARD_ALL} from "../util/Constant";
import {shuffleArray} from "../util/MathUtil";
import {Card} from "../model/Card";

export class CardManager {
    private static ALL_CARD_LIST: Card[] = [];

    public static initAllCard() {
        let map = new Map<string, Card>();
        let list = [];

        let color: any = {};
        let direction: any = {};
        let operation: any = {};

        for (let oneCard of CARD_ALL) {
            for (let i = 0; i < oneCard.num; i++) {
                const card = new Card(i, oneCard);
                map.set(card.allId, card);
                list.push(card);

                color[card.color] = color[card.color] ? color[card.color] + 1 : 1;
                direction[card.direction] = direction[card.direction] ? direction[card.direction] + 1 : 1;
                operation[card.operation] = operation[card.operation] ? operation[card.operation] + 1 : 1;
            }
        }

        this.ALL_CARD_LIST = list;
        // console.info(color);
        // console.info(direction);
        // console.info(operation);
        console.info("卡牌初始化成功，数量：", this.ALL_CARD_LIST.length);
    }

    public static getNewPlayerCard(index: number): Card {
        let card = this.ALL_CARD_LIST[index];
        card.hand = true;
        return card;
    }

    public static getInitCardIndex(): number[] {
        let array = [];
        const length = this.ALL_CARD_LIST.length;
        for (let i = 0; i < length; i++) array.push(i);
        return shuffleArray(array);
    }
}