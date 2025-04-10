const routerHandelMap = new Map();

function loadRoutes() {
    let routeClasses = [BaseRoutes, RoomEventRoutes, RoomRoutes, RoomSkillRoutes];

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
        }
    }

    console.info("路由加载成功");
}