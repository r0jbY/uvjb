"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJwt = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const refreshToken_1 = require("./refreshToken");
const verifyJwt = (req, res, next) => {
    if (req.cookies && (req.cookies.accessToken || req.cookies.refreshToken)) {
        const token = req.cookies.accessToken;
        jsonwebtoken_1.default.verify(token, process.env.ACCESS_SECRET, (err) => {
            if (err) {
                (0, refreshToken_1.refreshToken)(req, res, next);
            }
            else {
                console.log('Authenticated');
                next();
            }
        });
    }
    else {
        console.log('No token');
        res.status(401).json({ message: "No token" });
        return;
    }
};
exports.verifyJwt = verifyJwt;
