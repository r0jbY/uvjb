import request from "supertest";
import app from "../app";
import { AuthService } from "../services/auth.service";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"


jest.mock("../services/auth.service");

jest.mock("bcryptjs", () => ({
  compare: jest.fn(), 
}));

describe("Auth Routes - Integration (Mocked DB)", () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    it("should return 404 if user not found", async () => {
        (AuthService.getUserByEmail as jest.Mock).mockResolvedValue(null);

        const res = await request(app).post("/auth/login").send({
            email: "ghost@example.com",
            password: "wrongpass"
          });

          expect(res.status).toBe(404);
          expect(res.body).toEqual({ message: "Invalid credentials", result: false })
    });

    it("should return 404 if wrong password", async () => {
        (AuthService.getUserByEmail as jest.Mock).mockResolvedValue({
            id: "user123",
            email: "test@example.com",
            password: "hashed-password",
            role: "user"
        });

        
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const res = await request(app).post("/auth/login").send({
            email: "ghost@example.com",
            password: "wrongpass"
          });

          expect(res.status).toBe(404);
          expect(res.body).toEqual({ message: "Invalid credentials", result: false })
    });

    it("should return 200 and set cookies if login successful", async () => {
        (AuthService.getUserByEmail as jest.Mock).mockResolvedValue({
          id: "user123",
          email: "test@example.com",
          password: "hashed-password",
          role: "user"
        });
    
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
    
        jest.spyOn(jwt, "sign").mockImplementation(() => "mocked-token");
    
        const res = await request(app).post("/auth/login").send({
          email: "test@example.com",
          password: "correct-password"
        });
    
        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
        const cookies = res.headers["set-cookie"];
        expect(cookies.length).toBe(2);
        expect(cookies[0]).toMatch(/accessToken=mocked-token/);
        expect(cookies[1]).toMatch(/refreshToken=mocked-token/);
      });

      test.each([
        [{ email: "", password: "correct-password" }],
        [{ email: "test@example.com", password: "" }],
        [{ email: "", password: "" }],
        [{}]])("should return 400 for invalid input: %s (%s)", async (body) => {
        const res = await request(app).post("/auth/login").send(body);
    
        expect(res.status).toBe(400);
      });

      it("should clear cookie on logout and return 200", async () =>{ 
            const res = await request(app).post("/auth/logout");

            expect(res.status).toBe(200);

            const rawCookies = res.headers["set-cookie"];
            const cookies = Array.isArray(rawCookies) ? rawCookies : [rawCookies || ""];


            // Check that both accessToken and refreshToken were cleared
            const accessTokenCleared = cookies.find((c: string) =>
            c.startsWith("accessToken=") && c.includes("Expires=Thu, 01 Jan 1970")
            );
            const refreshTokenCleared = cookies.find((c: string) =>
            c.startsWith("refreshToken=") && c.includes("Expires=Thu, 01 Jan 1970")
            );

            expect(accessTokenCleared).toBeDefined();
            expect(refreshTokenCleared).toBeDefined();

      });

});