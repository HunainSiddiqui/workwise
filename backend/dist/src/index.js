"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const cookieParser = require('cookie-parser');
const user_1 = require("./router/user");
const seat_1 = require("./router/seat");
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(cookieParser());
app.use((0, cors_1.default)());
app.use("/api/v1/user", user_1.userRouter);
app.use("/api/v1/seat", seat_1.seatRouter);
app.listen(3000, () => {
    console.log("Server is running on port 3000");
});
