import {Player} from "../model/Player";
import {Event} from "../fight/Event";

export class Stack<T> {
    private items: T[] = [];

    // 入栈操作
    push(item: T): void {
        this.items.push(item);
        console.info("add stack", this.printStack());
    }

    // 出栈操作
    pop(): T | undefined {
        let pop = this.items.pop();
        console.info("pop stack", this.printStack());
        return pop;
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

    //反转所有元素
    reverse(): void {
        this.items.reverse();
    }

    printStack(): string {
        let s = "";
        for (let i = 0; i < this.items.length; i++) {
            if (s != "") {
                s += ","
            }
            s += this.getEventToString(this.items[i] as Event);
        }
        return "[" + s + "]";
    }

    getEventToString(event: Event): string {
        if (event.getEventPlayer()) {
            return event.getEventPlayer()?.account + event.constructor.name;
        } else {
            return event.constructor.name;
        }
    }

    //玩家重新登录
    public static reLogin(player: Player, stack: Stack<Event>): void {
        for (let item of stack.items) {
            item.sendClientInfo(player.room!, player);
        }
    }
}