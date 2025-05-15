import request from "supertest";
import app from "../../app";
import { prisma } from "../../config/database";

describe("Client Routes - Get All Clients", () => {
    it("should return all seeded clients correctly", async () => {
        const res = await request(app).get("/clients/getAll");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(5); // You seeded 5 clients

        const expectedIds = [
            "00000000-0000-0000-0000-000000000001",
            "00000000-0000-0000-0000-000000000002",
            "00000000-0000-0000-0000-000000000003",
            "00000000-0000-0000-0000-000000000004",
            "00000000-0000-0000-0000-000000000005"
        ];

        for (const id of expectedIds) {
            const client = res.body.find((c: any) => c.id === id);
            expect(client).toBeDefined();
        }

    });

    it("should return only 3 clients when limit=3 is passed", async () => {
        const res = await request(app).get("/clients/getAll?limit=3");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(3);
    });

    it("should return empty array when requesting offset 2 with limit=5", async () => {
        const res = await request(app).get("/clients/getAll?limit=5&offset=20");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(0);
    });
});

describe("Client Routes - Search Clients", () => {
    it("should return all clients when query is empty", async () => {
        const res = await request(app).get("/clients/search?query=");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toBe(5); // Based on your seed
    });


    it("should return matching clients for query string", async () => {
        const res = await request(app).get("/clients/search?query=Smith");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(2);

    });

    it("should return limited results when limit is provided", async () => {
        const res = await request(app).get("/clients/search?query=Smith&limit=1");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(1);
    });

    it("should return empty array when no results match", async () => {
        const res = await request(app).get("/clients/search?query=non-existent&limit=1");

        expect(res.status).toBe(200);
        expect(Array.isArray(res.body)).toBe(true);
        expect(res.body.length).toEqual(0);
    });
});

describe("Client Routes - Get 1 Client", () => {
    it("should return the client for a valid ID", async () => {
        const res = await request(app).get("/clients/00000000-0000-0000-0000-000000000001");

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            firstName: "Alice",
            lastName: "Johnson",
            phoneNumber: "+31123456789",
            address: "123 Elm St",
            active: true,
            deviceCode: "10000000-0000-0000-0000-000000000001",
            superbuddyId: "20000000-0000-0000-0000-000000000001"
        });
    });

    it("should return 404 if client is not found", async () => {
        const res = await request(app).get("/clients/99999999-9999-9999-9999-999999999999");

        expect(res.status).toBe(404);
        expect(res.body).toEqual({
            success: false,
            message: "Client not found"
        });
    });
});

describe("Client Routes - Create Client", () => {
    it("should create a new client successfully", async () => {
        const res = await request(app).post("/clients/create").send({
            deviceCode: "10000000-0000-0000-0000-000000000099",
            superbuddyId: "20000000-0000-0000-0000-000000000001",
            firstName: "Frank",
            lastName: "Banner",
            phoneNumber: "+31012345678",
            address: "999 Birch Rd",
            active: true
        });

        expect(res.status).toBe(200);
        expect(res.body).toEqual({
            message: "Client created successfully."
        });

        const created = await prisma.client.findFirst({
            where: {
                device_code: "10000000-0000-0000-0000-000000000099"
            }
        });

        expect(created).not.toBeNull();
        expect(created?.first_name).toBe("Frank");
    });

    it("should return 409 if device code already exists", async () => {
        const res = await request(app).post("/clients/create").send({
            deviceCode: "10000000-0000-0000-0000-000000000001",
            superbuddyId: "20000000-0000-0000-0000-000000000001",
            firstName: "Duplicate",
            lastName: "Test",
            phoneNumber: "+31098765432",
            address: "100 Conflict Ln",
            active: true
        });

        expect(res.status).toBe(409);
        expect(res.body).toEqual({
            success: false,
            message: "Device code is already in use."
        });
    });

    it("should return 400 if body is invalid", async () => {
        const res = await request(app).post("/clients/create").send({
            superbuddyId: "20000000-0000-0000-0000-000000000001",
            firstName: "Duplicate",
            lastName: "Test",
            phoneNumber: "+31098765432",
            address: "100 Conflict Ln",
            active: true
        });

        expect(res.status).toBe(400);
    });
})

describe("Client Routes - Update Client", () => {
    const existingClientId = "00000000-0000-0000-0000-000000000001";

  it("should update an existing client successfully", async () => {
    const res = await request(app).put(`/clients/update/${existingClientId}`).send({
      deviceCode: "10000000-0000-0000-0000-000000000001",
      superbuddyId: "20000000-0000-0000-0000-000000000003",
      firstName: "UpdatedName",
      lastName: "UpdatedLast",
      phoneNumber: "+31111111111",
      address: "New Address Rd",
      active: false
    });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Client updated successfully." });

    const updated = await prisma.client.findUnique({ where: { id: existingClientId } });
    expect(updated?.first_name).toBe("UpdatedName");
    expect(updated?.superbuddy_id).toBe("20000000-0000-0000-0000-000000000003");
  });

  it("should return 409 if updated device code already exists", async () => {
    const res = await request(app).put(`/clients/update/${existingClientId}`).send({
      deviceCode: "10000000-0000-0000-0000-000000000002", // already exists in seed
      superbuddyId: "20000000-0000-0000-0000-000000000001",
      firstName: "Test",
      lastName: "Conflict",
      phoneNumber: "+31000000000",
      address: "Conflict Address",
      active: true
    });

    expect(res.status).toBe(409);
    expect(res.body).toEqual({
      success: false,
      message: "Device code already in use."
    });
  });

  it("should return 400 if update payload is invalid", async () => {
    const res = await request(app).put(`/clients/update/${existingClientId}`).send({
      firstName: "OnlyName"
    });

    expect(res.status).toBe(400);
  });

  it("should return 500 for non-existent client ID", async () => {
    const res = await request(app).put(`/clients/update/00000000-0000-0000-0000-999999999999`).send({
      deviceCode: "10000000-0000-0000-0000-000000000099",
      superbuddyId: "20000000-0000-0000-0000-000000000001",
      firstName: "Ghost",
      lastName: "User",
      phoneNumber: "+31012300000",
      address: "404 Street",
      active: true
    });

    expect(res.status).toBe(500); 
    expect(res.body.success).toBe(false);
  });

  
});

describe("Client Routes - Delete Client", () => {
  const clientId = "00000000-0000-0000-0000-000000000002"; // seeded in your DB

  it("should delete an existing client successfully", async () => {
    // Ensure the client exists first
    const existsBefore = await prisma.client.findUnique({ where: { id: clientId } });
    expect(existsBefore).not.toBeNull();

    const res = await request(app).delete(`/clients/delete/${clientId}`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Client deleted successfully." });

    const deleted = await prisma.client.findUnique({ where: { id: clientId } });
    expect(deleted).toBeNull();
  });

  it("should return 500 if client does not exist", async () => {
    const res = await request(app).delete("/clients/delete/00000000-0000-0000-0000-999999999999");

    expect(res.status).toBe(500);
    expect(res.body).toEqual({
      success: false,
      message: "Failed to delete client. Internal server error."
    });
  });

});
