import { Express, RequestHandler } from "express";
const routes: IRoutes[] = [];

export function GET(route: string, middleware?: RequestHandler) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "GET",
            route,
            middleware
        });
    };
}

export function PUT(route: string, middleware?: RequestHandler) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "PUT",
            route,
            middleware
        });
    };
}

export function PATCH(route: string, middleware?: RequestHandler) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "PATCH",
            route,
            middleware
        });
    };
}

export function DEL(route: string, middleware?: RequestHandler) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "DEL",
            route,
            middleware
        });
    };
}

export function POST(route: string, middleware?: RequestHandler) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "POST",
            route,
            middleware
        });
    };
}

export function AllRoute(route: string, middleware?: RequestHandler) {
    return function (target: any, propertyKey: string, descriptor: PropertyDescriptor) {
        routes.push({
            function: descriptor.value,
            type: "ALL",
            route,
            middleware
        });
    };
}

export function setupRoutes(app: Express) {
    for (let i = 0; i < routes.length; i++) {
        const route = routes[i];
        console.log(route);

        if (route.middleware) {
            app.use("/" + route.route, route.middleware);
        }

        switch (route.type) {
            case "ALL":
                app.all("/" + route.route, route.function);
                break;
            case "POST":
                app.post("/" + route.route, route.function);
                break;
            case "PATCH":
                app.patch("/" + route.route, route.function);
                break;
            case "DEL":
                app.delete("/" + route.route, route.function);
                break;
            case "PUT":
                app.put("/" + route.route, route.function);
                break;
            case "GET":
                app.get("/" + route.route, route.function);
                break;

            default:
                break;
        }
    }
}

interface IRoutes {
    route: string;
    type: string;
    function: RequestHandler;
    middleware?: RequestHandler;
}