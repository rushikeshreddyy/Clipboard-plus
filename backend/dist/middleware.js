"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userMiddleware = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const config_1 = require("./config");
const userMiddleware = (req, res, next) => {
    const header = req.headers['authorization'];
    //console.log( 'header' + header);
    if (!header || !header.startsWith("Bearer ")) {
        res.status(401).json({ message: "You are not logged in" });
        return;
    }
    const token = header.split(" ")[1];
    // console.log( 'token' + token);
    if (!token) {
        res.status(401).json({ message: "Token is missing or malformed" });
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(token, config_1.JWT_SECRET);
        req.userId = decoded.id;
        // console.log('xxxxx'+decoded.id);
        next();
    }
    catch (error) {
        res.status(403).json({
            message: "Invalid or expired token"
        });
    }
};
exports.userMiddleware = userMiddleware;
