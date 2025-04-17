import { loginSchema, registerSchema } from "../utils/auth.schema";

describe("loginSchema", () => {
    it("should pass with valid email and password", () => {
        const result = loginSchema.safeParse( {
            email: "user@gmail.com",
            password: "good123"
        })

        expect(result.success).toBe(true);
    });

    it("should fail if email is invalid", () => {
        const result = loginSchema.safeParse({
          email: "not-an-email",
          password: "secure123",
        });
    
        expect(result.success).toBe(false);
        expect(result.error?.issues[0].message).toMatch(/invalid email/i);
      });
    
      it("should fail if password is too short", () => {
        const result = loginSchema.safeParse({
          email: "user@example.com",
          password: "123",
        });
    
        expect(result.success).toBe(false);
      });
    
      it("should fail if fields are missing", () => {
        const result = loginSchema.safeParse({});
    
        expect(result.success).toBe(false);
      });
    
});

describe("registerSchema", () => {
  it("should pass with all valid fields", () => {
    const result = registerSchema.safeParse({
      email: "user@gmail.com",
      password: "good123",
      role: "admin",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+123456789",
      address: "123 Main St"
    });

    expect(result.success).toBe(true);
  });

  it("should fail if email is invalid", () => {
    const result = registerSchema.safeParse({
      email: "not-an-email",
      password: "secure123",
      role: "admin",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+123456789",
      address: "123 Main St"
    });

    expect(result.success).toBe(false);
  });

  it("should fail if password is too short", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "123",
      role: "admin",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+123456789",
      address: "123 Main St"
    });

    expect(result.success).toBe(false);
  });

  it("should fail if role is invalid", () => {
    const result = registerSchema.safeParse({
      email: "r.balint@gmail.com",
      password: "secure123",
      role: "random",
      firstName: "John",
      lastName: "Doe",
      phoneNumber: "+123456789",
      address: "123 Main St"
    });

    expect(result.success).toBe(false);
  });

  it("should fail if required fields are missing", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "secure123",
      role: "user"
      // Missing firstName, lastName, phoneNumber, address
    });

    expect(result.success).toBe(false);
  });

  it("should fail if phoneNumber is too short", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "secure123",
      role: "user",
      firstName: "Alice",
      lastName: "Smith",
      phoneNumber: "1234",
      address: "123 Main St"
    });

    expect(result.success).toBe(false);
  });

  it("should fail if address is too short", () => {
    const result = registerSchema.safeParse({
      email: "user@example.com",
      password: "secure123",
      role: "user",
      firstName: "Alice",
      lastName: "Smith",
      phoneNumber: "+123456789",
      address: "123"
    });

    expect(result.success).toBe(false);
  });
});