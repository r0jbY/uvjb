// utils/attachUser.ts – one small helper you can reuse
import { Request, Response } from 'express';

type Role = 'buddy' | 'superbuddy' | 'admin';
const roleHierarchy: Record<Role, number> = {
  buddy: 1,
  superbuddy: 2,
  admin: 3,
} as const;

export const attachUser = (
  req: Request,
  res: Response,
  payload: { id: string; role: string },
  requiredRole?: Role
): boolean /* true = ok, false = reject already */ => {
  // 1) headers for downstream micro-services
 
  req.headers['x-user-id']   = payload.id;
  req.headers['x-user-role'] = payload.role;

  // 2) optional role hierarchy enforcement
  if (
    requiredRole &&
    payload.role in roleHierarchy &&
    roleHierarchy[payload.role as Role] < roleHierarchy[requiredRole]
  ) {
    res.status(403).json({ message: 'Forbidden - Insufficient access.' });
    return false;
  }
  return true;
};
