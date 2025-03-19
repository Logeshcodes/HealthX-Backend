"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const dotenv_1 = require("dotenv");
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const consumer_1 = __importDefault(require("./config/kafka/consumer"));
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT) || 5003;
const FRONTEND_URL = process.env.FRONTEND_URL || "http://localhost:3000";
console.log("Environment Variables:", { PORT, FRONTEND_URL });
const corsOptions = {
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
app.use((0, cors_1.default)(corsOptions));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, morgan_1.default)("dev"));
app.use((req, res, next) => {
    console.log(`📝 LOG: ${req.method} request to ${req.originalUrl}`);
    next();
});
(0, consumer_1.default)();
app.get("/test-cors", (req, res) => {
    res.json({ message: "CORS is working!" });
});
// Root Route
app.get("/", (req, res) => {
    res.json("Notification service is running 🚀");
});
// Error Handling Middleware
app.use((err, req, res, next) => {
    console.error(" Error:", err.message);
    res.status(500).json({ error: "Internal Server Error" });
});
// Start the Server
app.listen(PORT, () => {
    console.log(`Notification Service is running on port ${PORT}`);
});
