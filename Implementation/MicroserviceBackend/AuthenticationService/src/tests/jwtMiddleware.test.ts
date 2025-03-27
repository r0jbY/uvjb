import { verifyJwt } from "../middleware/jwtMiddleware";
import { Request, Response, NextFunction } from "express";
import  jwt, { VerifyErrors }  from "jsonwebtoken";
import { refreshToken } from "../middleware/refreshToken";

jest.mock('jsonwebtoken', () => ({
    verify: jest.fn(),
  }));
jest.mock('../middleware/refreshToken', () => ({
    refreshToken: jest.fn(),
}));

describe("jwt middleware", () => {
    
    let req: Partial<Request>;
    let res: Partial<Response>;
    let next: NextFunction;

    beforeEach(() => {
        req = { cookies: {} };
        res = {
          status: jest.fn().mockReturnThis(),
          json: jest.fn(),
        };
        next = jest.fn();
    });

    it("should return 401 where there is no token", () => {
        verifyJwt(req as Request, res as Response, next);
        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({ message: 'No token' });
    });

    it('should call next if jwt.verify succeeds', () => {
        req.cookies = { accessToken: 'validToken' };
    
        (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
          callback(null, { id: '123' });
        });
    
        verifyJwt(req as Request, res as Response, next);
    
        expect(jwt.verify).toHaveBeenCalledWith('validToken', process.env.ACCESS_SECRET!, expect.any(Function));
        
        expect(next).toHaveBeenCalled();
      });
      
    it('should call refreshToken if jwt.verify fails', () => {
       
        req.cookies = { accessToken: 'invalidToken', refreshToken: 'someRefreshToken' };
    
       
        const error = new Error('Expired token') as VerifyErrors;
        (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
          callback(error, undefined);
        });
    
        verifyJwt(req as Request, res as Response, next);
    
        expect(refreshToken).toHaveBeenCalledWith(req, res, next);
      });
});