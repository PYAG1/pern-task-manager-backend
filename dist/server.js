"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const a_1 = __importDefault(require("./routes/auth/a"));
const tasks_js_1 = __importDefault(require("./routes/tasks/tasks.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const corsOption_1 = require("./config/corsOption");
const app = (0, express_1.default)();
const port = 8080;
dotenv_1.default.config();
app.use(express_1.default.json(), body_parser_1.default.json());
app.use((0, cors_1.default)(corsOption_1.corsOptions));
app.all("/", (req, res) => {
    res.send({
        status: true,
        message: "Welcome to pernstack api",
    });
});
app.use("/api", a_1.default);
app.use("/api", tasks_js_1.default);
app.listen(port, () => {
    console.log(`Example app listening on port ${port}`);
});
