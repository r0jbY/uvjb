import { Request, Response, NextFunction } from 'express';
import jwt, {VerifyErrors} from 'jsonwebtoken'

export const refreshToken = (req: Request, res: Response, next: NextFunction): void => {
    
    console.log("Entered refresh");
    const refreshToken = req.cookies.refreshToken;

    if(!refreshToken) {
        console.log("Failed");
        res.sendStatus(401);
    }


    jwt.verify(refreshToken, process.env.REFRESH_SECRET as string, (err : VerifyErrors | null, _decoded: string | undefined | object) => {
        
        if(err || !_decoded) {
            console.log('Expired access');
            res.sendStatus(401);
        }
        else {
            const payload = _decoded as { id: string, role: string };

            const accessToken = jwt.sign(
                { payload },
                process.env.ACCESS_SECRET as string,
                { expiresIn: "15m" }
            );

            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
        
            next();
        }
    });
};
