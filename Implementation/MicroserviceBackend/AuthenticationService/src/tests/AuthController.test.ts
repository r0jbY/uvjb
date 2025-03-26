import AuthController from "../controllers/AuthController";
import { AuthService } from "../services/auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

jest.mock("../services/auth.service");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

describe("AuthController", () => {
  let req: any;
  let res: any;

  beforeEach(() => {
    req = {
      body: { email: "test@example.com", password: "password123" },
    };
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn()
    };
    jest.clearAllMocks();
  });

  describe("login", () => {
    it("should return 404 if user not found", async () => {
      (AuthService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials", result: false });
    });

    it("should return 404 if password is invalid", async () => {
      (AuthService.getUserByEmail as jest.Mock).mockResolvedValue({ password: "hashed" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials", result: false });
    });

    it("should return 200 and set cookies if login is successful", async () => {
      const mockUser = { id: "user123", password: "hashed", role: "user" };
      (AuthService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockImplementation((payload) => `token-${payload.id}`);

      await AuthController.login(req, res);

      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User logged in successfully",
        result: true,
        userid: "user123"
      });
    });

    it("should return 500 when a database error occurs", async () => {
      (AuthService.getUserByEmail as jest.Mock).mockRejectedValue(new Error("DB Failure"));

      await AuthController.login(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });

    })
  });

  describe("logout", () => {
    it("should clear cookies and return 200", async () => {
      await AuthController.logout(req, res);

      expect(res.cookie).toHaveBeenCalledWith("accessToken", "", expect.objectContaining({ expires: expect.any(Date) }));
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", "", expect.objectContaining({ expires: expect.any(Date) }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Logout successful");
    });
  });
});
