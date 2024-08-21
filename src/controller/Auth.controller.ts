import { Request, Response } from "express";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { encrypt } from "../helpers/helpers";
import { UserResponse } from "../dto/user.dto";

export class AuthController {
  static async login(req: Request, res: Response) {
    try {
      const { email, password } = req.body;
      if (!email || !password) {
        return res
          .status(500)
          .json({ message: "Email and password required!" });
      }

      const userRepository = AppDataSource.getRepository(User);

      const user = await userRepository.findOneBy({ email: email });
      if (!user) {
        return res
          .status(404)
          .json({ message: "User not found. Please signup first" });
      }

      //condition to check password
      const isPasswordValid = encrypt.comparePassword(password, user.password);

      if (!isPasswordValid) {
        return res.status(200).json({
          message:
            "Password didn't match. Are you sure you are using the right password?",
        });
      }
      const userDataSent = new UserResponse();
      userDataSent.email = user.email;
      userDataSent.name = user.name;
      const token = encrypt.generateToken({ id: `${user.id}` });

      return res
        .status(200)
        .json({ message: "Signin Successful", token, userDataSent });
    } catch (error) {
      return res.status(500).json({ message: "Internal Server Error" });
    }
  }
  static async getProfile(req: Request, res: Response) {
    if (!req["currentUser"]) {
      return res.status(401).json({ message: "Unauthorized!" });
    }

    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: req["currentUser"].id },
    });
    return res.status(200).json({ ...user, password: undefined });
  }
}
