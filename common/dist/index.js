"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.eventTicketInput = exports.eventInput = exports.signinInput = exports.signupInput = void 0;
const zod_1 = __importDefault(require("zod"));
exports.signupInput = zod_1.default.object({
    name: zod_1.default.string(),
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6),
    phonenumber: zod_1.default.string().length(10)
});
exports.signinInput = zod_1.default.object({
    email: zod_1.default.string().email(),
    password: zod_1.default.string().min(6)
});
exports.eventInput = zod_1.default.object({
    title: zod_1.default.string().max(23),
    description: zod_1.default.string(),
    images: zod_1.default.string().optional(),
    date: zod_1.default.string().refine(dateStr => {
        const inputDate = new Date(dateStr);
        const currentDate = new Date();
        currentDate.setHours(0, 0, 0, 0);
        return inputDate >= currentDate;
    }, {
        message: "Date must be equal to or greater than the current date"
    }),
    time: zod_1.default.string(),
    location: zod_1.default.string().max(27),
    tickets: zod_1.default.number().min(1),
    fee: zod_1.default.number().min(0)
});
exports.eventTicketInput = zod_1.default.object({
    quantity: zod_1.default.number().min(1).max(4)
});
