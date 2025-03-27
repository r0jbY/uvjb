import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { refreshToken } from './refreshToken';

export const verifyJwt = (req: Request, res: Response, next: NextFunction): void => {
    if(req.cookies && (req.cookies.accessToken || req.cookies.refreshToken)) {
        const token = req.cookies.accessToken;
        const accessSecret: string = process.env.ACCESS_SECRET!;

        jwt.verify(token, accessSecret, (err : VerifyErrors | null, _decoded: string | undefined | object) => {
            if(err) {
                refreshToken(req, res, next);
            }
            else {
                console.log('Authenticated');
                next();
            }
        });
    } else {
        res.status(401).json({message: "No token"});
    }
};
