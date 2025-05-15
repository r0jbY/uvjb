import { clientSchema } from "../../utils/schema"; // adjust path as needed

describe("clientSchema", () => {
  it("should pass with all valid fields", () => {
    const result = clientSchema.safeParse({
      deviceCode: "22222222-2222-2222-2222-222222222222",
      superbuddyId: "33333333-3333-3333-3333-333333333333",
      firstName: "Alice",
      lastName: "Johnson",
      phoneNumber: "+1234567890",
      address: "123 Main St",
      active: true
    });

    expect(result.success).toBe(true);
  });

  it("should fail with invalid UUIDs", () => {
    const result = clientSchema.safeParse({
      deviceCode: "not-a-uuid",
      superbuddyId: "also-not-a-uuid",
      firstName: "Alice",
      lastName: "Johnson",
      phoneNumber: "+1234567890",
      address: "123 Main St"
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues.some(issue => issue.message.includes("Invalid"))).toBe(true);
  });

  it("should fail if required fields are missing", () => {
    const result = clientSchema.safeParse({});
    expect(result.success).toBe(false);
    expect(result.error?.issues.length).toBeGreaterThan(0);
  });

  it("should fail if phone number is invalid", () => {
    const result = clientSchema.safeParse({
      deviceCode: "22222222-2222-2222-2222-222222222222",
      superbuddyId: "33333333-3333-3333-3333-333333333333",
      firstName: "Alice",
      lastName: "Johnson",
      phoneNumber: "123", // too short and invalid format
      address: "123 Main St"
    });

    expect(result.success).toBe(false);
    expect(result.error?.issues[0].message).toMatch(/invalid phone number/i);
  });

  it("should pass if `active` is omitted", () => {
    const result = clientSchema.safeParse({
      deviceCode: "22222222-2222-2222-2222-222222222222",
      superbuddyId: "33333333-3333-3333-3333-333333333333",
      firstName: "Alice",
      lastName: "Johnson",
      phoneNumber: "+1234567890",
      address: "123 Main St"
    });

    expect(result.success).toBe(true);
  });
});
