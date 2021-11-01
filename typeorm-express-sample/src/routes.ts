import {UserController} from "./controller/UserController";

const apiRoute = "/api";

export const Routes = [{
    method: "get",
    route: apiRoute+"/users",
    controller: UserController,
    action: "all"
}, {
    method: "get",
    route: apiRoute+"/users/:id",
    controller: UserController,
    action: "one"
}, {
    method: "post",
    route: apiRoute+"/users",
    controller: UserController,
    action: "save"
}, {
    method: "delete",
    route: apiRoute+"/users/:id",
    controller: UserController,
    action: "remove"
}];