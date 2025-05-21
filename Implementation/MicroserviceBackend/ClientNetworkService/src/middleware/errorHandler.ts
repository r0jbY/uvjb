import { NextFunction, Request, Response } from "express";

type TypedError = Error & { statusCode?: number };

const errorHandler = (err: TypedError, _req: Request, res: Response, next: NextFunction) => {

  if (res.headersSent) {
    return next(err); // Let Express handle it if headers are already sent
  }

  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";

  console.error("Global Error Handler:", message);

  res.status(statusCode).type("application/json").json({
    success: false,
    message,
  });
};

export default errorHandler;