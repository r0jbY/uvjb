import jwt, { VerifyErrors } from 'jsonwebtoken';
import { Request, Response, NextFunction } from 'express';
import { refreshToken } from './refreshToken';

export const verifyJwt = (req: Request, res: Response, next: NextFunction): void => {
    if(req.cookies && (req.cookies.accessToken || req.cookies.refreshToken)) {
        const token = req.cookies.accessToken;
        
        jwt.verify(token, process.env.ACCESS_SECRET as string, (err : VerifyErrors | null) => {
            if(err) {
                refreshToken(req, res, next);
            }
            else {
                console.log('Authenticated');
                next();
            }
        });
    } else {
        console.log('No token');
        res.status(401).json({message: "No token"});
    }
};
