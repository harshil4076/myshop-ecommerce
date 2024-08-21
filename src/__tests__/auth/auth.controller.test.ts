import request from "supertest";
import createServer from "../../server";
import { AppDataSource } from "../../data-source";
import { encrypt } from "../../helpers/helpers";

const app = createServer();
jest.mock("../../helpers/helpers.ts", () => ({
  encrypt: {
    comparePassword: jest.fn((password, hashedPassword) => true),
    generateToken: jest.fn(() => "mockToken"),
  },
}));

describe("When login", () => {
  let userRepositoryMock;
  beforeAll(() => {
    userRepositoryMock = {
      findOneBy: jest.fn(),
    };

    jest
      .spyOn(AppDataSource, "getRepository")
      .mockReturnValue(userRepositoryMock);
  });

  afterAll(() => {
    jest.restoreAllMocks();
  });

  it("should return 500 when Email and Password are missing", () => {
    request(app)
      .post("/auth/login")
      .send({})
      .expect(500, {
        message: "Email and password required!",
      })
      .then((response) => {
        expect(response.body).toEqual({
          message: "Email and password required!",
        });
      });
  });

  it("should return 404 when the email is not found", async () => {
    const mockUsers = { email: "john@email.com", password: "John" };
    // const users = await AppDataSource.getRepository(User).find();
    userRepositoryMock.findOneBy.mockResolvedValue(null);

    const response = await request(app).post("/auth/login").send(mockUsers);
    expect(response.status).toBe(404);
    expect(response.body).toEqual({
      message: "User not found. Please signup first",
    });
  });

  it("should return 200 if password is incorrect", async () => {
    const mockUsers = { email: "john@email.com", password: "John" };
    userRepositoryMock.findOneBy.mockResolvedValue(mockUsers);
    (encrypt.comparePassword as jest.Mock).mockReturnValue(false);
    const response = await request(app)
      .post("/auth/login")
      .send({ email: "john@email.com", password: "password" });
    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message:
        "Password didn't match. Are you sure you are using the right password?",
    });
  });

  it("should return 200 and a token if login is successful", async () => {
    const mockUsers = {
      email: "john@email.com",
      password: "hashedPassword",
      name: "John",
    };
    userRepositoryMock.findOneBy.mockResolvedValue(mockUsers);
    (encrypt.comparePassword as jest.Mock).mockReturnValue(true);

    const response = await request(app)
      .post("/auth/login")
      .send({ email: "john@email.com", password: "password" });
    expect(response.status).toBe(200);
    expect(response.body.message).toEqual("Signin Successful");
    expect(response.body.token).toBe("mockToken");
    expect(response.body.userDataSent).toEqual({
      email: "john@email.com",
      name: "John",
    });
  });
});
