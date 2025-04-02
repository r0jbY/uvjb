import { Server } from "http";
import request from "supertest";
import app from "../app"; // API Gateway's Express app


import { fork, ChildProcess } from "child_process";

let gatewayServer: Server;
let authServiceProcess: ChildProcess;

beforeAll((done) => {
  // Start the Authentication Service in test mode on port 3001
  authServiceProcess = fork("../AuthenticationService/dist/index.js", [], {
    env: { ...process.env, USE_MOCK_DB: "true", PORT: "3001" }
  });
  
  // Wait a bit to ensure the service is up, or use a health check endpoint.
  setTimeout(() => {
    gatewayServer = app.listen(3000, done);
  }, 1000); // Adjust delay as needed
});

afterAll((done) => {
  gatewayServer.close(() => {
    authServiceProcess.kill();
    done();
  });
});

describe("Integration Test: API Gateway -> AuthService (login)", () => {
  it("should return 200 on successful login and contain correct cookies", async () => {

    const res = await request(app).post("/auth/login").send({
      email: "robert@gmail.com",
      password: "password",
    });
    
    expect(res.status).toBe(200);
    
    const cookies = res.headers["set-cookie"];
    const cookiesArr = Array.isArray(cookies) ? cookies : [cookies];

    expect(cookiesArr).toBeDefined();

    const accessTokenCookie = cookiesArr.find((cookie: string) => cookie.includes("accessToken="));
    const refreshTokenCookie = cookiesArr.find((cookie: string) => cookie.includes("refreshToken="));
    
    expect(accessTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toBeDefined();

  });

  it("should return 404 on wrong login", async () => {
  
    const res = await request(app).post("/auth/login").send({
      email: "wrong@gmail.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(404);
    
  });

  it("should return 400 on wrong login input", async () => {
 
    const res = await request(app).post("/auth/login").send({
      email: "wrong@gmail.com",
    });

    expect(res.status).toBe(400);
  });

  it("should return 500 on DB error", async () => {
  
    const res = await request(app).post("/auth/login").send({
      email: "error@db.com",
      password: "wrongpassword",
    });

    expect(res.status).toBe(500);
    
  });

  it("should clear cookies on logout and return 200", async () => {
    
    const res = await request(app)
      .post("/auth/logout")
      .set("Cookie", [
        "accessToken=some_token",
        "refreshToken=some_token"
      ]);
  
    expect(res.status).toBe(200);
    expect(res.text).toEqual("Logout successful");
  
    
    const cookies = res.headers["set-cookie"];
    
    const cookiesArr = Array.isArray(cookies) ? cookies : [cookies];
  
    
    const accessTokenCookie = cookiesArr.find((cookie: string) =>
      cookie.includes("accessToken=")
    );
    const refreshTokenCookie = cookiesArr.find((cookie: string) =>
      cookie.includes("refreshToken=")
    );
  
    expect(accessTokenCookie).toBeDefined();
    expect(refreshTokenCookie).toBeDefined();
  
    expect(accessTokenCookie).toMatch(/Expires=Thu, 01 Jan 1970/);
    expect(refreshTokenCookie).toMatch(/Expires=Thu, 01 Jan 1970/);
  });
});
