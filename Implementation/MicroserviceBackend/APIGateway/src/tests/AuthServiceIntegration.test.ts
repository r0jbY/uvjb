import { Server } from "http";
import request from "supertest";
import app from "../app"; // API Gateway's Express app
import jwt from "jsonwebtoken"

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

describe("Integration Test: API Gateway -> AuthService (login + logout)", () => {
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

describe("Integration Test: API Gateway -> AuthService (register)", () => {
  it("should return 401 when there is not JWT", async () => {

    const res = await request(app).post("/auth/register").send({
      email: "robert@gmail.com",
      password: "password",
    });

    expect(res.status).toBe(401);
  });

  const invalidPayloads = [
    { password: "password", role: "user" },
    { email: "not-an-email", password: "password", role: "user" },
    { email: "robert@gmail.com", role: "user" },
    { email: "robert@gmail.com", password: "short", role: "user" },
    { email: "robert@gmail.com", password: "password", role: "notarole" },
    { email: "robert@gmail.com", password: "password" },
  ];
  it.each(invalidPayloads)("should return 400 on invalid input and valid JWT", async (payload) => {

    const accessToken = jwt.sign({ id: '123', role: 'user' }, process.env.ACCESS_SECRET as string, { expiresIn: '15m' })

    const res = await request(app)
      .post("/auth/register")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send(payload);

    expect(res.status).toBe(400);
  });

  it("should return 200 when registration works", async () => {

    const accessToken = jwt.sign({ id: '123', role: 'user' }, process.env.ACCESS_SECRET as string, { expiresIn: '15m' })

    const res = await request(app)
      .post("/auth/register")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({
        email: "newuser@example.com",
        password: "newpassword",
        role: "admin",
      });

    expect(res.status).toBe(200);
  });


  it("should return 400 when registration fails but JWT passes", async () => {

    const accessToken = jwt.sign({ id: '123', role: 'user' }, process.env.ACCESS_SECRET as string, { expiresIn: '15m' })

    const res = await request(app)
      .post("/auth/register")
      .set("Cookie", [`accessToken=${accessToken}`])
      .send({
        email: "exists@gmail.com",
        password: "newpassword",
        role: "user",
      });

    expect(res.status).toBe(400);
    expect(res.text).toEqual("Account creation failed");
  });

});

describe("Integration Test: API Gateway -> AuthService (whoAmI)", () => {
  it("should return 401 if token is missing", async () => {
    const res = await request(app)
      .get("/auth/whoAmI");

    expect(res.status).toBe(401);
    
  })

  it("should return 401 if token is not valid", async () => {

    const accessToken = jwt.sign({ id: '123', role: 'user' }, 'badSecret', { expiresIn: '15m' })

    const res = await request(app)
      .get("/auth/whoAmI")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(res.status).toBe(401);
    
  })

  it("should return 200 and user credentials if acess token is valid", async () => {

    const accessToken = jwt.sign({ id: '123', role: 'user' }, process.env.ACCESS_SECRET as string, { expiresIn: '15m' })

    const res = await request(app)
      .get("/auth/whoAmI")
      .set("Cookie", [`accessToken=${accessToken}`]);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({id: '123', role: 'user'});
    
  })

  it("should return 200 and user credentials if accessToken is not valid and refresh token is valid", async () => {

    const refreshToken = jwt.sign({ id: '123', role: 'user' }, process.env.REFRESH_SECRET as string, { expiresIn: '15m' });
    const accessToken = '123';

    const res = await request(app)
      .get("/auth/whoAmI")
      .set("Cookie", [`refreshToken=${refreshToken}`, `accessToken=${accessToken}`]);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({id: '123', role: 'user'});
    
  })

  it("should return 200 and user credentials if only refresh token exists", async () => {

    const refreshToken = jwt.sign({ id: '123', role: 'user' }, process.env.REFRESH_SECRET as string, { expiresIn: '15m' })

    const res = await request(app)
      .get("/auth/whoAmI")
      .set("Cookie", [`refreshToken=${refreshToken}`]);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({id: '123', role: 'user'});
    
  })
});
