import { Request, Response, NextFunction } from 'express';
import jwt, {VerifyErrors} from 'jsonwebtoken'
import { attachUser } from '../utils/attachUser';

type Role = 'buddy' | 'superbuddy' | 'admin';

export const refreshToken = (req: Request, res: Response, next: NextFunction, requiredRole?: Role): void => {
    
    console.log("Entered refresh");
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) {
        console.log("Failed");
        res.sendStatus(401);
        return;
    }


    jwt.verify(refreshToken, process.env.REFRESH_SECRET as string, (err : VerifyErrors | null, _decoded: string | undefined | object) => {
        
        if(err || !_decoded) {
            console.log('Expired access');
            res.sendStatus(401);
            return;
        }
        else {
            const payload = _decoded as { id: string, role: string };

            const accessToken = jwt.sign(
                {id: payload.id, role: payload.role },
                process.env.ACCESS_SECRET as string,
                { expiresIn: "15m" }
            );

            res.locals.accessToken = accessToken;

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
           
            const ok = attachUser(req, res, payload, requiredRole);
      if (ok) next();
        }
    });
};
