"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const verifyjwt_1 = require("../../middleware/verifyjwt");
const TaskContoller_1 = require("../../controllers/tasks/TaskContoller");
const router = express_1.default.Router();
router.route("/tasks")
    .post(verifyjwt_1.verifyJWT, TaskContoller_1.createTask)
    .get(verifyjwt_1.verifyJWT, TaskContoller_1.getAllTasks);
router.route("/tasks/:task_id")
    .get(verifyjwt_1.verifyJWT, TaskContoller_1.getSingleTask)
    .delete(verifyjwt_1.verifyJWT, TaskContoller_1.deleteTask);
router.route("/taskbyDate")
    .get(verifyjwt_1.verifyJWT, TaskContoller_1.getAllTasksByDate);
exports.default = router;
