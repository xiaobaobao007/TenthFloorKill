import {Player} from "../model/Player";
import {Event} from "../fight/Event";

export class Stack<T> {
    private items: T[] = [];

    // 入栈操作
    push(item: T): void {
        this.items.push(item);
    }

    // 出栈操作
    pop(): T | undefined {
        return this.items.pop();
    }

    // 获取栈顶元素
    peek(): T | undefined {
        return this.items[this.items.length - 1];
    }

    // 获取栈的大小
    size(): number {
        return this.items.length;
    }

    // 清空栈
    clear(): void {
        this.items = [];
    }

    //玩家重新登录
    public static reLogin(player: Player, stack: Stack<Event>): void {
        for (let item of stack.items) {
            item.sendClientInfo(player.room!, player);
        }
    }
}