import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { refreshToken } from './refreshToken';

type Role = 'buddy' | 'superbuddy' | 'admin';
const roleHierarchy: Record<Role, number> = {
  buddy: 1,
  superbuddy: 2,
  admin: 3,
} as const;

export const verifyJwt = (requiredRole?: Role) => {
    return (req: Request, res: Response, next: NextFunction): void => {

        const tokenFromCookie = req.cookies?.accessToken ;
        const tokenFromHeader = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;

        const token = tokenFromCookie || tokenFromHeader;
        const isWebRequest = Boolean(tokenFromCookie || req.cookies?.refreshToken);

        

        jwt.verify(token, process.env.ACCESS_SECRET as string, async (err: VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
            if (err) {
                if (isWebRequest) {
                    // Automatically try refreshing for web
                    return refreshToken(req, res, next);
                }

                // For mobile, just reject
                return res.status(401).json({ message: "Invalid token." });
            }

            // Valid token: continue
            const payload = decoded as { id: string; role: string };

            req.headers['x-user-id'] = payload.id;
            req.headers['x-user-role'] = payload.role;

            // Role enforcement
            const userRole = payload.role as Role;

            if (
                requiredRole &&
                userRole in roleHierarchy &&
                roleHierarchy[userRole] < roleHierarchy[requiredRole]
            ) {
                return res.status(403).json({ message: "Forbidden - Insufficient access." });
            }
            console.log(payload);
            next();
        });

    };
};