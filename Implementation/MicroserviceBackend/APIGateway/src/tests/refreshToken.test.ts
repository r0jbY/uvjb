import { Request, Response, NextFunction } from "express";
import jwt, { VerifyErrors } from "jsonwebtoken";
import { refreshToken } from "../middleware/refreshToken";

jest.mock("jsonwebtoken", () => ({
  verify: jest.fn(),
  sign: jest.fn(),
}));

describe("refreshToken middleware", () => {
  let req: Partial<Request>;
  let res: Partial<Response>;
  let next: NextFunction;

  beforeEach(() => {
    req = { cookies: {} };
    res = {
      sendStatus: jest.fn(),
      cookie: jest.fn(),
      locals:{}
    };
    next = jest.fn();

    process.env.REFRESH_SECRET = "testRefreshSecret";
    process.env.ACCESS_SECRET = "testAccessSecret";
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it("should return 401 if no refresh token is provided", () => {
   
    refreshToken(req as Request, res as Response, next);
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("should return 401 if jwt.verify fails", () => {
    req.cookies = { refreshToken: "invalidRefreshToken" };

    const error = new Error("Invalid token") as VerifyErrors;
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(error, undefined);
    });

    refreshToken(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "invalidRefreshToken",
      "testRefreshSecret",
      expect.any(Function)
    );
    expect(res.sendStatus).toHaveBeenCalledWith(401);
  });

  it("should generate a new access token, set the cookie, and call next if jwt.verify succeeds", () => {
    req.cookies = { refreshToken: "validRefreshToken" };

    const decodedPayload = { id: "123", role: "user" };
    (jwt.verify as jest.Mock).mockImplementation((token, secret, callback) => {
      callback(null, decodedPayload);
    });
    (jwt.sign as jest.Mock).mockReturnValue("newAccessToken");

    refreshToken(req as Request, res as Response, next);

    expect(jwt.verify).toHaveBeenCalledWith(
      "validRefreshToken",
      "testRefreshSecret",
      expect.any(Function)
    );
    expect(jwt.sign).toHaveBeenCalledWith(
      { id: decodedPayload.id, role: decodedPayload.role},
      "testAccessSecret",
      { expiresIn: "15m" }
    );
    expect(res.cookie).toHaveBeenCalledWith("accessToken", "newAccessToken", {
      httpOnly: true,
      secure: true,
      sameSite: "none",
    });
    expect(next).toHaveBeenCalled();
  });
});
