import { UserController } from "./controller/UserController";
import authToken from "./middleware/authToken";

const apiRoute = "/api";

export const Routes = [
  {
    method: "get",
    route: apiRoute + "/users",
    controller: UserController,
    action: "findAllUsers",
    middleware: authToken,
  },
  {
    method: "get",
    route: apiRoute + "/users/:id",
    controller: UserController,
    action: "findUser",
    middleware: authToken,
  },
  {
    method: "post",
    route: apiRoute + "/register",
    controller: UserController,
    action: "registerUser",
  },
  {
    method: "post",
    route: apiRoute + "/login",
    controller: UserController,
    action: "loginUser",
  },
  {
    method: "post",
    route: apiRoute + "/update/:id",
    controller: UserController,
    action: "updateUser",
    middleware: authToken,
  },
  {
    method: "delete",
    route: apiRoute + "/remove_user",
    controller: UserController,
    action: "removeUser",
    middleware: authToken,
  },
];
