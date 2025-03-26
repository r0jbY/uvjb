import { loginSchema } from "../utils/auth.schema";

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