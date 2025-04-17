import AuthController from "../controllers/AuthController";
import { AuthService } from "../services/auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import { v4 as uuidv4 } from "uuid"

jest.mock("../services/auth.service");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

jest.mock("../utils/publisher");

describe("AuthController", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;

  beforeEach(() => {
    jest.clearAllMocks();
    req = {
      body: { email: "test@example.com", password: "password123", role: "admin" },
    };
    res = {
      cookie: jest.fn(),
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
      send: jest.fn(),
      locals: {}
    };
    (uuidv4 as jest.Mock).mockReturnValue("test-uuid");
  });

  describe("login", () => {
    it("should return 404 if user not found", async () => {
      (AuthService.getUserByEmail as jest.Mock).mockResolvedValue(null);

      await AuthController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials", result: false });
    });

    it("should return 404 if password is invalid", async () => {
      (AuthService.getUserByEmail as jest.Mock).mockResolvedValue({ password: "hashed" });
      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await AuthController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({ message: "Invalid credentials", result: false });
    });

    it("should return 200 and set cookies if login is successful", async () => {
      const mockUser = { id: "user123", password: "hashed", role: "admin" };
      (AuthService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      (jwt.sign as jest.Mock).mockImplementation((payload) => `token-${payload.id}`);

      await AuthController.login(req as Request, res as Response);

      expect(res.cookie).toHaveBeenCalledTimes(2);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({
        message: "User logged in successfully",
        result: true,
        userid: "user123"
      });
    });

    it("should return 401 if role is not admin", async () => {
      const mockUser = { id: "user123", password: "hashed", role: "user" };
      (AuthService.getUserByEmail as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      await AuthController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith({
        message: "Access denied",
      });
    });

    it("should return 500 when a database error occurs", async () => {
      (AuthService.getUserByEmail as jest.Mock).mockRejectedValue(new Error("DB Failure"));

      await AuthController.login(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({
        message: "Internal server error",
      });

    });
  });

  describe("logout", () => {
    it("should clear cookies and return 200", async () => {
      await AuthController.logout(req as Request, res as Response);

      expect(res.cookie).toHaveBeenCalledWith("accessToken", "", expect.objectContaining({ expires: expect.any(Date) }));
      expect(res.cookie).toHaveBeenCalledWith("refreshToken", "", expect.objectContaining({ expires: expect.any(Date) }));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Logout successful");
    });
  });

  describe("register", () => {
    it("should return 200 and 'Account created' when AuthService.createAccount returns true", async () => {
      (AuthService.createAccount as jest.Mock).mockResolvedValue(true);
      (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");

      await AuthController.register(req as Request, res as Response);


      // Verify that dependencies were called with the expected values
      expect(uuidv4).toHaveBeenCalled();
      expect(bcrypt.hash).toHaveBeenCalledWith("password123", 12);
      expect(AuthService.createAccount).toHaveBeenCalledWith("test-uuid", "test@example.com", "hashed-password", "admin");

      // Verify response
      expect(res.status).toHaveBeenCalledWith(200);

    });

    it("should return 400 and 'Account creation failed' when AuthService.createAccount throws an error", async () => {
      (AuthService.createAccount as jest.Mock).mockRejectedValue(new Error("Creation error"));

      await AuthController.register(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(400);
    });
  });

  describe("whoAmI", () => {
    it("should return 401 if there is no access token", async () => {

      req.cookies = {};

      await AuthController.whoAmI(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        { message: "Expired access" }
      );
    });

    it("should return 401 if access token is invalid", async () => {

      req.cookies = { accessToken: "123" };

      (jwt.verify as jest.Mock).mockImplementation((_token, _secret, callback) => {
        callback(new Error("Invalid token"), null);
      });

      await AuthController.whoAmI(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.json).toHaveBeenCalledWith(
        { message: "Expired access" }
      );
    });

    it("should return 200 and user info if token is valid", async () => {
      req.cookies = { accessToken: "valid-token" };
      (jwt.verify as jest.Mock).mockImplementation((_token, _secret, callback) => {
        callback(null, { id: "user123", role: "admin" });
      });

      await AuthController.whoAmI(req as Request, res as Response);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ id: "user123", role: "admin" });
    });
  });
});
