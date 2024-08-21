import { AppDataSource } from "./data-source";
import * as dotenv from "dotenv";
import "reflect-metadata";
import createServer from "./server";
dotenv.config();

const { PORT = 3000 } = process.env;

const app = createServer();

app.listen(PORT, async () => {
  console.log("Server is running on http://localhost:" + PORT);

  await AppDataSource.initialize();
  console.log("Data Source has been initialized!");
});

export default app;
