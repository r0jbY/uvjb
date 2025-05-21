import { manageNetworkSchema } from "../../utils/schema"

describe("manageNetworkSchema", () => {
  it("should pass with valid input", () => {
    const result = manageNetworkSchema.safeParse({
      clientId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      addBuddies: ["bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"],
      removeBuddies: ["cccccccc-cccc-cccc-cccc-cccccccccccc"],
      layer: 1,
    });

    expect(result.success).toBe(true);
  });

  it("should fail if clientId is missing", () => {
    const result = manageNetworkSchema.safeParse({
      addBuddies: ["bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb"],
      removeBuddies: ["cccccccc-cccc-cccc-cccc-cccccccccccc"],
      layer: 2,
    });

    expect(result.success).toBe(false);
  });

  it("should fail if buddy IDs are not UUIDs", () => {
    const result = manageNetworkSchema.safeParse({
      clientId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      addBuddies: ["not-a-uuid"],
      removeBuddies: [],
      layer: 1,
    });

    expect(result.success).toBe(false);
  });

  it("should fail if layer is not 1 or 2", () => {
    const result = manageNetworkSchema.safeParse({
      clientId: "aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa",
      addBuddies: [],
      removeBuddies: [],
      layer: 3,
    });

    expect(result.success).toBe(false);
  });

});
