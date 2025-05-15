import request from "supertest";
import app from "../../app";
import { prisma } from "../../config/database";

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
            const user = res.body.find((u: any) => u.id === id);
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

describe("User Routes - Get 1 User", () => {
    it("should return the user for a valid ID", async () => {
        const res = await request(app).get("/users/30000000-0000-0000-0000-000000000001");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            firstName: "Sophie",
            lastName: "Anderson",
            phoneNumber: "+31612345678",
            address: "12 Park Lane",
            active: true
        });
    });

    it("should return 404 if user is not found", async () => {
        const res = await request(app).get("/users/99999999-9999-9999-9999-999999999999");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "User not found"
        });
    });
});

describe("User Routes - Get users by ids", () => {
    it("should return a list of users by their ids", async () => {
        const res = (await request(app).post("/users/byIds").send({ids : ["30000000-0000-0000-0000-000000000001", "30000000-0000-0000-0000-000000000002"]}));

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(2);
    });

    it("should return 400 if ids are not provided", async () => {
        const res = (await request(app).post("/users/byIds"));

        expect(res.status).toBe(400);
        expect(res.body).toEqual({
            success: false,
            message: "Invalid or missing 'ids' in request body."
        });
    });
});