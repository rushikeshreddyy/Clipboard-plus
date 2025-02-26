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
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateForm = void 0;
const zod_1 = require("zod");
const formSchema = zod_1.z.object({
    username: zod_1.z.string()
        .min(3, 'Username must be atlease 3 characters')
        .max(50, "Username must not exceed 50 characters"),
    password: zod_1.z.string()
        .min(6, "Password must be min of 6 characters")
        .max(50, "Password must be maximum of 50 Characters")
});
const validateForm = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const validatedData = yield formSchema.parseAsync(req.body);
        req.validatedForm = validatedData;
        return next();
    }
    catch (error) {
        if (error instanceof zod_1.z.ZodError) {
            res.status(400).json({
                success: false,
                message: "Form validation Failed",
                errors: error.errors.map(err => ({
                    field: err.path.join('.'),
                    message: err.message
                }))
            });
            return;
        }
        res.status(500).json({
            success: false,
            message: "Internal server error"
        });
    }
    return;
});
exports.validateForm = validateForm;
