import {CARD_ALL} from "../util/Constant";
import {shuffleArray} from "../util/MathUtil";
import {Card} from "../model/Card";

export class CardManager {
    private static ALL_CARD_LIST: Card[] = [];

    public static initAllCard() {
        let map = new Map<string, Card>();
        let list = [];

        for (let oneCard of CARD_ALL) {
            for (let i = 0; i < oneCard.num; i++) {
                const card = new Card(oneCard);
                map.set(card.allId, card);
                list.push(card);
            }
        }

        this.ALL_CARD_LIST = list;
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
        shuffleArray(array);
        return array;
    }
}