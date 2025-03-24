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
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const db_1 = __importDefault(require("./config/db"));
const userRouters_1 = __importDefault(require("./routers/userRouters"));
const doctorRouters_1 = __importDefault(require("./routers/doctorRouters"));
const adminRouters_1 = __importDefault(require("./routers/adminRouters"));
const ErrorMiddleware_1 = require("./middlewares/ErrorMiddleware");
const consumer_1 = __importDefault(require("./config/kafka/consumer"));
const dotenv_1 = __importDefault(require("dotenv"));
if (process.env.NODE_ENV === "production") {
    dotenv_1.default.config({ path: ".env.production" });
}
else {
    dotenv_1.default.config({ path: ".env.development" });
}
const app = (0, express_1.default)();
const PORT = Number(process.env.PORT);
const FRONTEND_URL = process.env.FRONTEND_URL;
const SERVICE = process.env.SERVICE || "Auth Service";
console.log("\nEnvironment Variables:", { PORT, FRONTEND_URL, SERVICE });
const corsOptions = {
    origin: FRONTEND_URL,
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
    credentials: true,
};
// middlewares
app.use((0, cors_1.default)(corsOptions));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
app.use((0, cookie_parser_1.default)());
app.use((0, morgan_1.default)("dev"));
app.use(ErrorMiddleware_1.ErrorMiddleware);
app.use((req, res, next) => {
    console.log(`📝 LOG: ${req.method} request to ${req.originalUrl}`);
    next();
});
app.use("/user", userRouters_1.default);
app.use("/doctor", doctorRouters_1.default);
app.use("/admin", adminRouters_1.default);
(0, consumer_1.default)();
app.get('/', (req, res) => {
    res.send("Auth Service is running 🚀");
});
process.on("uncaughtException", (err) => {
    console.error(" Uncaught Exception:", err.message);
    process.exit(1);
});
process.on("unhandledRejection", (reason) => {
    console.error(" Unhandled Rejection:", reason);
    process.exit(1);
});
const startAuthService = () => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, db_1.default)();
        app.listen(PORT, () => {
            console.log(` \n${SERVICE} is running on port ${PORT}`);
        });
    }
    catch (error) {
        console.error("Error starting the server:", error);
        process.exit(1);
    }
});
startAuthService();
