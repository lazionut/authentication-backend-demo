import { UserController } from "./controller/UserController";

const apiRoute = "/api";

export const Routes = [
  {
    method: "get",
    route: apiRoute + "/users",
    controller: UserController,
    action: "findAllUsers",
  },
  {
    method: "get",
    route: apiRoute + "/users/email/:email",
    controller: UserController,
    action: "findEmail",
  },
  {
    method: "get",
    route: apiRoute + "/users/username/:username",
    controller: UserController,
    action: "findUser",
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
  },
  {
    method: "delete",
    route: apiRoute + "/remove_user",
    controller: UserController,
    action: "removeUser",
  },
];
