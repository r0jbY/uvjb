import request from "supertest";
import app from "../../app";
import * as publisher from "../../utils/publisher";
import jwt from "jsonwebtoken";
import { prisma } from "../../config/database";

jest.mock("../../utils/publisher");

// test/helpers/authHeaders.ts
export const adminHeaders = {
  'x-user-id':  '00000000-0000-0000-0000-000000000000', // any UUID
  'x-user-role': 'admin',
};

export const selfHeaders = (id: string) => ({
  'x-user-id':  id,
  'x-user-role': 'user',
});


describe("Auth Routes (login + logout) - Integration (Mocked DB)", () => {

  it("should return 401 if email not found", async () => {

    const res = await request(app).post("/auth/login").send({
      email: "ghost@example.com",
      password: "wrongpass"
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({
      success: false,
      message: "Invalid credentials",
    });

  });

  it("should return 404 if wrong password", async () => {

    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
      password: "wrongpass"
    });

    expect(res.status).toBe(401);
    expect(res.body).toEqual({ message: "Invalid credentials", success: false })
  });

  it("should return 200 and set cookies if login successful", async () => {



    const res = await request(app).post("/auth/login").send({
      email: "alice@example.com",
      password: "password"
    });

    expect(res.status).toBe(200);

    const cookies = res.headers["set-cookie"];
    expect(cookies.length).toBe(2);
    expect(cookies[0]).toContain('accessToken');
    expect(cookies[1]).toContain('refreshToken');


  });

  it("should return 403 if user is not admin", async () => {

    const res = await request(app).post("/auth/login").send({
      email: "bob@example.com",
      password: "password"
    });

    expect(res.status).toBe(403);
    expect(res.body).toEqual({ message: "Access denied", success: false })


  });


  it("should return 400 for invalid input", async () => {

    const res = await request(app).post("/auth/login").send({ email: "", password: "correct-password" });

    expect(res.status).toBe(400);

  });


  it("should clear cookie on logout and return 200", async () => {
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

  it("should return 200 and 'Account created' on successful registration", async () => {

    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "newuser@example.com",
        password: "newpassword",
        role: "buddy",
        firstName: "Alice",
        lastName: "Johnson",
        phoneNumber: "+123456789",
        address: "123 Main St",
        active: true
      });

    expect(res.status).toEqual(200);
    expect(res.body).toEqual({ message: "Account created" });

    expect(publisher.publishUserCreatedEvent).toHaveBeenCalledWith(
      expect.objectContaining({
        firstName: "Alice",
        lastName: "Johnson",
        phoneNumber: "+123456789",
        address: "123 Main St",
        active: true
      })
    );

  });


  it("should return 409 and 'Account creation failed' if email is already in use", async () => {
    // Arrange


    const res = await request(app)
      .post("/auth/register")
      .send({
        email: "alice@example.com",
        password: "failpassword",
        role: "admin",
        firstName: "Alice",
        lastName: "Johnson",
        phoneNumber: "+123456789",
        address: "123 Main St",
        active: true

      });

    // Assert
    expect(res.status).toBe(409);
    expect(res.body).toEqual({ message: "Email is already in use.", success: false });
  });

  it("should return 400 for invalid input", async () => {
    // Arrange


    const res = await request(app)
      .post("/auth/register")
      .send({
        password: "failpassword",
        role: "admin",
        firstName: "Alice",
        lastName: "Johnson",
        phoneNumber: "+123456789",
        address: "123 Main St",
        active: true

      });

    // Assert
    expect(res.status).toBe(400);
    expect(res.body).toEqual({ message: "Validation failed" });
  });
});

describe("Auth Routes - WhoAmI", () => {
  it("should return 400 and user id & role if token is valid", async () => {

    const validToken = jwt.sign({ id: "123", role: "admin" }, process.env.ACCESS_SECRET!, { expiresIn: '1min' });

    const res = await request(app)
      .get("/auth/whoAmI")
      .set("Cookie", [`accessToken=${validToken}`]);

    expect(res.status).toBe(200);
    console.log(res.body);
    expect(res.body).toEqual({ id: "123", role: "admin" });
  });
});

describe("Auth Routes - GetSuperBuddies", () => {
  it("should return a list of superbuddies matching query", async () => {

    const res = await request(app)
      .get("/auth/superbuddies")
      .query({ query: "charlie", limit: 2 });

    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty("superBuddies");
    expect(Array.isArray(res.body.superBuddies)).toBe(true);
    expect(res.body.superBuddies.length).toBe(1);
    expect(res.body.superBuddies[0].email).toBe("charlie@example.com");
  });

  it("should return empty array if no matches found", async () => {

    const res = await request(app)
      .get("/auth/superbuddies")
      .query({ query: "nonexistent" });

    expect(res.status).toBe(200);
    expect(res.body.superBuddies).toEqual([]);
  });
});

describe('Auth Routes – Delete', () => {
  it('deletes an existing user (admin)', async () => {
    const id = '11111111-1111-1111-1111-111111111111';

    const res = await request(app)
      .delete(`/auth/delete/${id}`)
      .set(adminHeaders);                         // ⬅️ add headers

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: 'User deleted' });

    const deleted = await prisma.user.findUnique({ where: { id } });
    expect(deleted).toBeNull();

    expect(publisher.publishUserDeletedEvent)
      .toHaveBeenCalledWith({ id });
  });

  it('returns 500 if user does not exist', async () => {
    const res = await request(app)
      .delete('/auth/delete/non-existent-id')
      .set(adminHeaders);                         // still authenticated

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      message: 'Failed to delete user. Internal server error.',
    });
  });
});

describe('Auth Routes – Get User', () => {
  it('returns user data for a valid ID (self)', async () => {
    const id = '22222222-2222-2222-2222-222222222222';

    const res = await request(app)
      .get(`/auth/${id}`)
      .set(selfHeaders(id));                      // self access

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      email: 'bob@example.com',
      role:  'buddy',
    });
  });

  it('returns 404 for a non-existent user (admin)', async () => {
    const res = await request(app)
      .get('/auth/00000000-0000-0000-0000-000000000000')
      .set(adminHeaders);

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: 'User not found',
    });
  });
});

describe('Auth Routes – Update User', () => {
  it('updates email & role and publishes event (admin)', async () => {
    const id = '22222222-2222-2222-2222-222222222222';

    const res = await request(app)
      .put(`/auth/update/${id}`)
      .set(adminHeaders)                          // admin header
      .send({
        email:       'bob.updated@example.com',
        role:        'superbuddy',
        firstName:   'Bob',
        lastName:    'Updated',
        address:     'New Address',
        phoneNumber: '+987654321',
        active:      true,
      });

    expect(res.status).toBe(200);

    const updated = await prisma.user.findUnique({ where: { id } });
    expect(updated?.email).toBe('bob.updated@example.com');
    expect(updated?.role).toBe('superbuddy');

    expect(publisher.publishUserUpdatedEvent).toHaveBeenCalledWith({
      id,
      firstName:   'Bob',
      lastName:    'Updated',
      address:     'New Address',
      phoneNumber: '+987654321',
      active:      true,
    });
  });

  it('returns 409 if email already exists (admin)', async () => {
    const id = '22222222-2222-2222-2222-222222222222';

    const res = await request(app)
      .put(`/auth/update/${id}`)
      .set(adminHeaders)
      .send({
        email:       'charlie@example.com', // email of another user
        role:        'buddy',
        firstName:   'Test',
        lastName:    'User',
        address:     'Address',
        phoneNumber: '+123456789',
        active:      true,
      });

    expect(res.status).toBe(409);
    expect(res.body.message).toBe('Email is already in use.');
  });
});