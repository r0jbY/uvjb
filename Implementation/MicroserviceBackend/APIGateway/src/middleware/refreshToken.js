"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken = (req, res, next) => {
    console.log("Entered refresh");
    const refreshToken = req.cookies.refreshToken;
    if (!refreshToken) {
        console.log("Failed");
        res.sendStatus(401);
        return;
    }
    jsonwebtoken_1.default.verify(refreshToken, process.env.REFRESH_SECRET, (err, _decoded) => {
        if (err || !_decoded) {
            console.log('Expired access');
            res.sendStatus(401);
            return;
        }
        else {
            const payload = _decoded;
            const accessToken = jsonwebtoken_1.default.sign({ id: payload.id, role: payload.role }, process.env.ACCESS_SECRET, { expiresIn: "15m" });
            res.locals.accessToken = accessToken;
            res.cookie("accessToken", accessToken, {
                httpOnly: true,
                secure: true,
                sameSite: "none",
            });
            next();
        }
    });
};
exports.refreshToken = refreshToken;
