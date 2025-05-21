import errorHandler from "../../middleware/errorHandler";
import { NextFunction, Request, Response } from "express";

describe("Global error handler", () => {
  let res: Partial<Response>;
  const mockJson = jest.fn();
  const mockStatus = jest.fn();
  const mockType = jest.fn();
  const next = jest.fn();

  beforeEach(() => {
    mockJson.mockReset();
    mockStatus.mockReset();
    mockType.mockReset();

    
    res = {
      status: mockStatus.mockImplementation(() => ({
        type: mockType.mockImplementation(() => ({
          json: mockJson
        }))
      }))
    };
  });

  it("should return 500 and message when statusCode is not defined", () => {
    
    const error = new Error("");

    errorHandler(error, {} as Request, res as Response, next as NextFunction);

    expect(mockStatus).toHaveBeenCalledWith(500);
    expect(mockType).toHaveBeenCalledWith("application/json");
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: "Internal Server Error",
    });
  });

  it("should return custom status code and message", () => {
    const error = new Error("Unauthorized") as Error & { statusCode?: number };
    error.statusCode = 401;

    errorHandler(error, {} as Request, res as Response, next as NextFunction);

    expect(mockStatus).toHaveBeenCalledWith(401);
    expect(mockType).toHaveBeenCalledWith("application/json");
    expect(mockJson).toHaveBeenCalledWith({
      success: false,
      message: "Unauthorized",
    });
  });
});
