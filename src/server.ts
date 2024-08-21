import express from "express";
import { Request, Response } from "express";
import { userRouter } from "./routes/auth.routes";
import * as dotenv from "dotenv";
import "reflect-metadata";
import { errorHandler } from "./middlewares/error.middleware";
dotenv.config();
function createServer() {
  const app = express();
  app.use(express.json());
  app.use(errorHandler);

  app.use("/auth", userRouter);

  app.get("*", (req: Request, res: Response) => {
    res.status(505).json({ message: "Bad Request" });
  });
  return app;
}

export default createServer;
