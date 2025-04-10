import 'reflect-metadata';
import fs from 'fs';
import path from 'path';
import {ServerClientRoutes} from "./ServerClientRoutes";

function scanRoutesFolder(folderPath: string) {
    const routeClasses: any[] = [];
    const files = fs.readdirSync(folderPath);

    for (const file of files) {
        const filePath = path.join(folderPath, file);
        const module = require(filePath);
        for (const key in module) {
            if (typeof module[key] === 'function' && module[key].prototype instanceof ServerClientRoutes) {
                routeClasses.push(module[key]);
            }
        }
    }

    return routeClasses;
}

function loadRoutes() {
    const routerHandelMap = new Map<string, any>();
    const folderPath = path.join(__dirname, ''); // 假设路由类文件都在 'routes' 文件夹下
    const routeClasses = scanRoutesFolder(folderPath);

    let routeNum = 0;

    for (const RouteClass of routeClasses) {
        const className = RouteClass.name;
        const routePrefix = className.replace('Routes', '').toLowerCase();
        const routeInstance = new RouteClass();
        const routeHandlers = Object.getOwnPropertyNames(RouteClass.prototype)
            .filter((key) => typeof routeInstance[key] === 'function' && key !== 'constructor');

        for (const handlerName of routeHandlers) {
            const fullRoute = (routePrefix ? `${routePrefix}/${handlerName}` : handlerName).toLowerCase();
            // console.info("addRoute：", fullRoute);
            const handler = routeInstance[handlerName].bind(routeInstance);
            routerHandelMap.set(fullRoute, handler);

            routeNum++;
        }
    }

    console.info("路由加载成功！！！,数量：", routeNum);

    return routerHandelMap;
}

export const routerHandelMap = loadRoutes();