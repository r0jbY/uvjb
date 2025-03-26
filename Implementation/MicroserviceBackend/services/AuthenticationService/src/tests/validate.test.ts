import { validate } from "../middleware/validate";
import {z} from "zod";
import { Request, Response, NextFunction } from "express";

describe("validate middleware", () => {
    const mockSchema = z.object({
      email: z.string().email(),
      password: z.string().min(6),
    });
  
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: jest.Mock;
  
    beforeEach(() => {
      req = {
        body: {},
      };
      res = {
        status: jest.fn().mockReturnThis(),
        json: jest.fn(),
      };
      next = jest.fn();
    });
  
    it("should call next() if validation passes", () => {
      req.body = {
        email: "user@example.com",
        password: "password123",
      };
  
      const middleware = validate(mockSchema);
      middleware(req as Request, res as Response, next);
  
      expect(next).toHaveBeenCalled();

    });
  
    it("should respond with 400 if validation fails", () => {
      req.body = {
        email: "invalid-email",
        password: "short",
      };
  
      const middleware = validate(mockSchema);
      middleware(req as Request, res as Response, next);
  
      expect(res.status).toHaveBeenCalledWith(400);
    });
  });