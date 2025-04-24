import {CLIENT_STRING_DATA} from "../util/Constant";

export class InitManager {
    private static stringMap = new Map<string, string>();

    public static iniStringData() {
        for (const data of CLIENT_STRING_DATA) {
            this.stringMap.set(data.name, data.value);
        }
    }

    public static getStringValue(name: string) {
        return this.stringMap.get(name);
    }

    public static setStringValue(name: string, value: string) {
        return this.stringMap.set(name, value);
    }
}