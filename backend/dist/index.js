"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const cors_1 = __importDefault(require("cors"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = require("./db");
const middleware_1 = require("./middleware");
const config_1 = require("./config");
const utils_1 = require("./utils");
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.post("/api/v1/signup", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    //TODO zod validation and hash the password,fix the error codes
    const username = req.body.username;
    const password = req.body.password;
    const hashedPassword = yield bcrypt_1.default.hash(password, 10);
    try {
        yield db_1.UserModel.create({
            username: username,
            password: hashedPassword,
        });
        res.json({ message: "User signed up sucessfully" });
    }
    catch (e) {
        res.status(409).json({
            message: "User already exists",
        });
    }
}));
app.post("/api/v1/signin", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const username = req.body.username;
    const password = req.body.password;
    try {
        const existingUser = yield db_1.UserModel.findOne({ username });
        if (existingUser && typeof existingUser.password === 'string' && (yield bcrypt_1.default.compare(password, existingUser.password))) {
            const token = jsonwebtoken_1.default.sign({ id: existingUser._id }, config_1.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token });
        }
        else {
            res.status(403).json({ message: "incorrect credentials" });
        }
    }
    catch (error) {
        res.status(500).json({ message: "Something went wrong, please try again" });
    }
}));
app.post("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const title = req.body.title;
    const link = req.body.link;
    const type = req.body.type;
    yield db_1.ContentModel.create({
        title,
        link,
        type,
        userId: req.userId,
        tags: [],
    });
    res.json({
        message: "Content Added",
    });
}));
app.get("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.userId;
    try {
        const content = yield db_1.ContentModel.find({
            userId: userId,
        }).populate("userId", "username");
        res.json({
            content
        });
    }
    catch (error) {
        res.json({ message: "Invalid Username" });
    }
}));
app.delete("/api/v1/content", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const contentId = req.body.contentId;
    try {
        yield db_1.ContentModel.deleteMany({
            contentId,
            userId: req.userId
        });
        res.status(200).json({ message: "Content Deleted" });
    }
    catch (error) {
        res.status(401).json({ message: "Something went wrong,Please try again" });
    }
}));
app.post("/api/v1/brain/share", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const share = req.body.share;
    if (share) {
        const existingLink = yield db_1.LinkModel.findOne({
            userId: req.userId
        });
        if (existingLink) {
            res.json({
                hash: existingLink.hash
            });
            return;
        }
        const hash = (0, utils_1.random)(10);
        yield db_1.LinkModel.create({
            userId: req.userId,
            hash: hash
        });
        res.json({
            message: hash
        });
    }
    else {
        yield db_1.LinkModel.deleteOne({
            userId: req.userId
        });
    }
    res.status(200).json({
        message: "Updated the share"
    });
}));
app.get("/api/v1/brain/:shareLink", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const hash = req.params.shareLink;
    const link = yield db_1.LinkModel.findOne({
        hash
    });
    if (!link) {
        res.json({ message: "sorry,Incorrect input" });
        return;
    }
    const content = yield db_1.ContentModel.find({
        userId: link.userId
    });
    const user = yield db_1.UserModel.findOne({
        _id: link.userId
    });
    if (!user) {
        res.status(411).json({ message: "User not found,error should ideally not happen" });
        return;
    }
    res.json({
        username: user.username,
        content: content
    });
}));
app.get("/api/v1/content/:contentType", middleware_1.userMiddleware, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const reqType = req.params.contentType.toLowerCase();
    const userId = req.userId;
    console.log('Hello' + reqType);
    console.log('Hi' + userId);
    try {
        const Values = yield db_1.ContentModel.find({
            userId: userId,
            type: reqType
        });
        if (Values.length === 0) {
            res.status(403).json({ "message": "NO values" });
        }
        res.status(200).json({ Values });
    }
    catch (error) {
        res.status(403).json({ "error": "error" });
    }
}));
app.listen(3000);
