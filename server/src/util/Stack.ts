import {Player} from "../model/Player";
import {Event} from "../fight/Event";

export class Stack<T> {
    private items: T[] = [];

    // 入栈操作
    push(item: T): void {
        this.items.push(item);
        // console.info("add stack", this.printStack());
    }

    // 出栈操作
    pop(): T | undefined {
        let pop = this.items.pop();
        // console.info("pop stack", this.printStack());
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

    //获得数组
    getItems(): T[] {
        return this.items;
    }

    remove(t: T) {
        let index = this.items.indexOf(t);
        if (index >= 0) {
            this.items.splice(index, 1);
        }
        // console.info("remove stack", this.printStack());
    }

    printStack(): string {
        let s = "";
        for (let i = 0; i < this.items.length; i++) {
            if (s != "") {
                s += " , "
            }
            s += (this.items[i] as Event).constructor.name;
        }
        return "[" + s + "]";
    }

    //玩家重新登录
    public static reLogin(player: Player, stack: Stack<Event>): void {
        for (let item of stack.items) {
            item.sendClientInfo(player.room!, player);
        }
    }
}