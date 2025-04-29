import {Card} from "../../../model/Card";
import {CARD_SHI_TAN} from "../../../util/Constant";

/**
 * 试探父类
 */
export abstract class ShiTan extends Card {
    protected constructor(color: string, direction: string, operation: string, lock: boolean, otherTips: string) {
        super(CARD_SHI_TAN, color, direction, operation, lock, otherTips);
    }
}