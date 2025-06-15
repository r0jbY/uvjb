import request from "supertest";
import app from "../../app";
import { UserRow } from "../../interfaces/Interfaces";

export const adminHeaders = {
  'x-user-id':  '00000000-0000-0000-0000-000000000000', // arbitrary
  'x-user-role': 'admin',                               // always allowed
};

export const selfHeaders = (id: string) => ({
  'x-user-id':  id,
  'x-user-role': 'user',
})

describe("User Routes - Get All Users", () => {
    it("should return all seeded users correctly", async () => {
        const res = await request(app).get("/users/getAll");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(5); // You seeded 5 clients

        const expectedIds = [
            "30000000-0000-0000-0000-000000000001",
            "30000000-0000-0000-0000-000000000002",
            "30000000-0000-0000-0000-000000000003",
            "30000000-0000-0000-0000-000000000004",
            "30000000-0000-0000-0000-000000000005"
        ];

        for (const id of expectedIds) {
            const user = res.body.find((u: UserRow) => u.id === id);
            expect(user).toBeDefined();
        }

    });

    it("should return only 3 users when limit=3 is passed", async () => {
        const res = await request(app).get("/users/getAll?limit=3");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(3);
    });

    it("should return empty array when requesting offset 20 with limit=5", async () => {
        const res = await request(app).get("/users/getAll?limit=5&offset=20");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });
});

describe("User Routes - Search Users", () => {
    it("should return no users when query is empty", async () => {
        const res = await request(app).get("/users/search?query=");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0); // Based on your seed
    });


    it("should return matching users for query string", async () => {
        const res = await request(app).get("/users/search?query=Anderson");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(2);

    });

    it("should return no users when none match the query", async () => {
        const res = await request(app).get("/users/search?query=nonexistent");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(0);
    });

});

describe('User Routes – Get 1 User', () => {
  it('returns the user for a valid ID (admin)', async () => {
    const userId = '30000000-0000-0000-0000-000000000001';

    const res = await request(app)
      .get(`/users/${userId}`)
      .set(adminHeaders);                       // ⬅️ add both headers

    expect(res.status).toBe(200);
    expect(res.body).toEqual({
      firstName: 'Sophie',
      lastName: 'Anderson',
      phoneNumber: '+31612345678',
      address: '12 Park Lane',
      active: true,
    });
  });

  it('returns 404 if user is not found', async () => {
    const res = await request(app)
      .get('/users/99999999-9999-9999-9999-999999999999')
      .set(adminHeaders);                       // still need auth

    expect(res.status).toBe(404);
    expect(res.body).toEqual({
      success: false,
      message: 'User not found',
    });
  });

  it('returns 403 when a normal user asks for someone else', async () => {
    const res = await request(app)
      .get('/users/30000000-0000-0000-0000-000000000002') // other person
      .set(selfHeaders('30000000-0000-0000-0000-000000000001'));

    expect(res.status).toBe(403);
  });
});

describe('User Routes – Get users by ids', () => {
  it('returns a list of users by their ids (admin)', async () => {
    const res = await request(app)
      .post('/users/byIds')
      .set(adminHeaders)                        // ⬅️ add headers
      .send({
        ids: [
          '30000000-0000-0000-0000-000000000001',
          '30000000-0000-0000-0000-000000000002',
        ],
      });

    expect(res.status).toBe(200);
    expect(Array.isArray(res.body)).toBe(true);
    expect(res.body.length).toBe(2);
  });

  it('returns 400 if ids are not provided', async () => {
    const res = await request(app)
      .post('/users/byIds')
      .set(adminHeaders);                       // still authenticated

    expect(res.status).toBe(400);
    expect(res.body).toEqual({
      success: false,
      message: "Invalid or missing 'ids' in request body.",
    });
  });
});