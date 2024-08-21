import request from "supertest";
import createServer from "../server";

describe("Test app", () => {
  test("/ route", async () => {
    const app = createServer();
    const res = await request(app).get("/");
    expect(res.body).toEqual({ message: "Bad Request" });
  });
});
