import AuthController from "../controllers/AuthController";
import { AuthService } from "../services/auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { Request, Response } from "express";
import {v4 as uuidv4} from "uuid"

jest.mock("../services/auth.service");
jest.mock("bcryptjs");
jest.mock("jsonwebtoken");
jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

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
      send: jest.fn()
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
      const mockUser = { id: "user123", password: "hashed", role: "user" };
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
});
