import { Request, Response, NextFunction, RequestHandler } from 'express';

export const allowSelfOrAdmin = (paramName: string = 'id'): RequestHandler => {
  return (req: Request, res: Response, next: NextFunction): void => {


    const requesterId   = req.headers['x-user-id']   as string | undefined;
    const requesterRole = req.headers['x-user-role'] as string | undefined;

    if (!requesterId || !requesterRole) {
      res.status(401).json({ message: 'Unauthenticated' });
      return;                              // <- returns void
    }


    if (requesterRole === 'admin') {
      next();
      return;
    }

    const targetId = req.params[paramName];
    if (targetId && targetId === requesterId) {
      next();
      return;
    }

    res.status(403).json({ message: 'Forbidden' });
    return;                                // <- returns void
  };
};
