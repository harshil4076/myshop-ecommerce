import { UserController } from "../controller/user.controller";
import { AuthController } from "../controller/Auth.controller";
import * as express from "express";
import { authentication, authorization } from "../middlewares/auth.middleware";
const Router = express.Router();

Router.get(
  "/users",
  authentication,
  authorization(["admin"]),
  UserController.getUsers
);

Router.get(
  "/profile",
  authentication,
  authorization(["user", "admin"]),
  AuthController.getProfile
);
Router.post("/signup", UserController.signup);
Router.post("/login", AuthController.login);

Router.put(
  "/update/:id",
  authentication,
  authorization(["user", "admin"]),
  UserController.updateUser
);

Router.delete(
  "/delete/:id",
  authentication,
  authorization(["admin"]),
  UserController.deleteUser
);

export { Router as userRouter };
