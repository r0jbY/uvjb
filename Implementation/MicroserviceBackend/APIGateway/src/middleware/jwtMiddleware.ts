import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { refreshToken } from './refreshToken';
import { attachUser } from '../utils/attachUser';

type Role = 'buddy' | 'superbuddy' | 'admin';

export const verifyJwt = (requiredRole?: Role) => {
    return (req: Request, res: Response, next: NextFunction): void => {

        const tokenFromCookie = req.cookies?.accessToken;
        const tokenFromHeader = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization.split(" ")[1] : null;

        const token = tokenFromCookie || tokenFromHeader;
        const isWebRequest = Boolean(tokenFromCookie || req.cookies?.refreshToken);



        jwt.verify(token, process.env.ACCESS_SECRET as string, async (err: VerifyErrors | null, decoded: string | jwt.JwtPayload | undefined) => {
            if (err) {
                if (isWebRequest) {
                    // Automatically try refreshing for web
                    return refreshToken(req, res, next, requiredRole);
                }

                // For mobile, just reject
                return res.status(401).json({ message: "Invalid token." });
            }

            // Valid token: continue

            
            const ok = attachUser(
                req,
                res,
                decoded as { id: string; role: string },
                requiredRole
            );
            
            if (ok) next();
        });

    };
};