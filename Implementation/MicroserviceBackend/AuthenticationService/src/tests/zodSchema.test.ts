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
  it("should pass with valid email, password and role", () => {
      const result = registerSchema.safeParse( {
          email: "user@gmail.com",
          password: "good123",
          role: "admin"
      })

      expect(result.success).toBe(true);
  });

  it("should fail if email is invalid", () => {
      const result = registerSchema.safeParse({
        email: "not-an-email",
        password: "secure123",
        role: "admin"
      });
  
      expect(result.success).toBe(false);
    });
  
    it("should fail if password is too short", () => {
      const result = registerSchema.safeParse({
        email: "user@example.com",
        password: "123",
      });
  
      expect(result.success).toBe(false);
    });

    it("should fail if role is invalid", () => {
      const result = registerSchema.safeParse({
        email: "r.balint@gmail.com",
        password: "secure123",
        role: "random"
      });
  
      expect(result.success).toBe(false);
      
    });
  
    it("should fail if fields are missing", () => {
      const result = registerSchema.safeParse({});
  
      expect(result.success).toBe(false);
    });
  
});