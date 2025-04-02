import request from "supertest";
import app from "../app";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken"
import {v4 as uuidv4} from "uuid"
import { prisma } from "../config/database";



jest.mock("../config/database", () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
      create: jest.fn()
    },
  },
}));

jest.mock("bcryptjs", () => {
  const actualBcrypt = jest.requireActual("bcryptjs");
  return {
    ...actualBcrypt,
    hash: jest.fn(),
  };
});




jest.mock("uuid", () => ({
  v4: jest.fn(),
}));

describe("Auth Routes (login + logout) - Integration (Mocked DB)", () => {
    beforeEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
    });

    it("should return 404 if user not found", async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

        const res = await request(app).post("/auth/login").send({
            email: "ghost@example.com",
            password: "wrongpass"
          });

          expect(res.status).toBe(404);
          expect(res.body).toEqual({ message: "Invalid credentials", result: false })

          jest.clearAllMocks();
    });

    it("should return 404 if wrong password", async () => {
        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
            id: "user123",
            email: "test@example.com",
            password: "hashed-password",
            role: "user"
        });
   

        const res = await request(app).post("/auth/login").send({
            email: "ghost@example.com",
            password: "wrongpass"
          });

          expect(res.status).toBe(404);
          expect(res.body).toEqual({ message: "Invalid credentials", result: false })
    });

    it("should return 200 and set cookies if login successful", async () => {

        (prisma.user.findUnique as jest.Mock).mockResolvedValue({
          id: "123",
          email: "user@example.com",
          password: "$2a$12$jSWFV2sLrjNhhyWlYXGUCe7/22QddgDJ.mbcDlfvGFPtG2PvzVSTS",
          role: "admin",
        });

        jest.spyOn(jwt, "sign").mockImplementation(() => "mocked-token");
    
        const res = await request(app).post("/auth/login").send({
          email: "user@example.com",
          password: "correct-password"
        });
    
        expect(res.status).toBe(200);
        expect(res.body.result).toBe(true);
        const cookies = res.headers["set-cookie"];
        expect(cookies.length).toBe(2);
        expect(cookies[0]).toMatch(/accessToken=mocked-token/);
        expect(cookies[1]).toMatch(/refreshToken=mocked-token/);

        jest.restoreAllMocks();
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


describe("Auth Routes - Register", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should return 200 and 'Account created' on successful registration", async () => {
    
    (uuidv4 as jest.Mock).mockReturnValue("test-uuid");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    (prisma.user.create as jest.Mock).mockResolvedValue({
      id: "user123",
      email: "newuser@example.com",
      password: "newpassword",
      role: "user"
    });

    const accessToken = jwt.sign({id: '123', role: 'user'}, process.env.ACCESS_SECRET as string, {expiresIn: '15m'})

    const res = await request(app)
      .post("/auth/register")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({
        email: "newuser@example.com",
        password: "newpassword",
        role: "user",
      });

    
    expect(res.status).toBe(200);
    expect(res.text).toEqual("Account created");
    
    expect(uuidv4).toHaveBeenCalled();
    expect(bcrypt.hash).toHaveBeenCalledWith("newpassword", 12);

  });


  it("should return 400 and 'Account creation failed' if an error occurs during registration", async () => {
    // Arrange
    (uuidv4 as jest.Mock).mockReturnValue("test-uuid");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");
    (prisma.user.create as jest.Mock).mockRejectedValue(new Error("Creation error"));

    const validToken = jwt.sign({ id: "admin" }, process.env.ACCESS_SECRET!, {expiresIn: '1min'});

    const res = await request(app)
      .post("/auth/register")
      .set("Cookie", [`accessToken=${validToken}`])
      .send({
        email: "failuser@example.com",
        password: "failpassword",
        role: "user",
      });

    // Assert
    expect(res.status).toBe(400);
    expect(res.text).toEqual("Account creation failed");
  });

  it("should return 401 if token is invalid", async () => {
    (uuidv4 as jest.Mock).mockReturnValue("test-uuid");
    (bcrypt.hash as jest.Mock).mockResolvedValue("hashed-password");

    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "failuser@example.com",
        password: "failpassword",
        role: "user",
      });

    expect(res.status).toBe(401);
  });

  test.each([
    [{ email: "", password: "password", role: "user" }],
    [{ email: "newuser@example.com", password: "", role: "user" }],
    [{ email: "newuser@example.com", password: "password", role: "123" }],
    [{}],
  ])("should return 400 for invalid input: %o", async (body) => {

    const validToken = jwt.sign({ id: "admin" }, process.env.ACCESS_SECRET!, {expiresIn: '1min'});

    const res = await request(app)
      .post("/auth/register")
      .set("Cookie", [`accessToken=${validToken}`])
      .send(body);
    expect(res.status).toBe(400);
  });
});