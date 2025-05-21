import request from "supertest";
import app from "../../app";
import { prisma } from "../../config/database";

describe("Network Routes - Integration", () => {

  const clientId = "11111111-1111-1111-1111-111111111111";
  
  it("should return the correct buddies for a given client and layer", async () => {
    const res = await request(app).get(`/network/getAll/${clientId}/2`);

    expect(res.status).toBe(200);
    expect(res.body).toEqual(
      expect.arrayContaining([
        { buddy_id: "bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb" },
        { buddy_id: "dddddddd-dddd-dddd-dddd-dddddddddddd" },
      ])
    );
  });

  it("should return 400 if getNetwork gets invalid clientId or layer", async () => {
  const res = await request(app).get(`/network/getAll/valid-id/not-a-number`);

  expect(res.status).toBe(400);
  expect(res.body).toEqual({
    success: false,
    message: "Invalid client ID or layer"
  });
});

  it("should add and remove buddies for a client network", async () => {
    const res = await request(app)
      .put("/network/manage")
      .send({
        clientId,
        addBuddies: ["ffffffff-ffff-ffff-ffff-ffffffffffff"],
        removeBuddies: ["bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"],
        layer: 2,
      });

    expect(res.status).toBe(200);
    expect(res.body).toEqual({ message: "Client network updated successfully." });

    const finalNetwork = await prisma.network.findMany({
      where: { client_id: clientId, layer: 2 },
      select: {
        buddy_id: true
      }
    });

    expect(finalNetwork).toEqual(
      expect.arrayContaining([
        { buddy_id: "ffffffff-ffff-ffff-ffff-ffffffffffff" },
        { buddy_id: "dddddddd-dddd-dddd-dddd-dddddddddddd" },
      ])
    );
  });
});
