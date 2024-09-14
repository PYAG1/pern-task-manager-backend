"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getSingleTask = exports.deleteTask = void 0;
exports.createTask = createTask;
exports.getAllTasks = getAllTasks;
const _types_1 = require("../../types/@types");
const db_1 = require("../../config/db");
async function createTask(req, res) {
    try {
        const { title, due_date, description, time, priority } = req.body;
        if (!title || !due_date) {
            return res.status(_types_1.HttpStatus.BAD_REQUEST).send({
                status: false,
                message: "Please provide a title and due date",
            });
        }
        const createTaskQuery = `
            INSERT INTO tasks (title, description, due_date, time, priority, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
        const createTask = await db_1.pool.query(createTaskQuery, [
            title,
            description,
            due_date,
            time,
            priority,
            req.user_id,
        ]);
        return res.status(_types_1.HttpStatus.CREATED).send({
            status: true,
            message: "Task created successfully",
            data: createTask.rows[0],
        });
    }
    catch (error) {
        console.error("Error creating task:", error);
        return res.status(_types_1.HttpStatus.INTERNAL_SERVER_ERROR).send({
            status: false,
            message: "An error occurred while creating the task",
        });
    }
}
async function getAllTasks(req, res) {
    try {
        if (!req.user_id) {
            return res.status(401).send({
                status: false,
                message: "Unauthorized: No user ID found",
            });
        }
        const getAllTasksQuery = await db_1.pool.query("SELECT * FROM tasks WHERE user_id = $1", [req.user_id]);
        return res.status(200).send({
            status: true,
            message: "Tasks retrieved successfully",
            data: getAllTasksQuery.rows || [],
        });
    }
    catch (error) {
        console.error("Error fetching tasks:", error);
        return res.status(500).send({
            status: false,
            message: "An error occurred while fetching tasks",
        });
    }
}
const deleteTask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const deleteTaskQuery = await db_1.pool.query("DELETE FROM tasks WHERE task_id = $1 RETURNING *", [task_id]);
        if (deleteTaskQuery.rowCount === 0) {
            return res.status(404).send({
                status: false,
                message: "Task not found",
            });
        }
        return res.status(200).send({
            status: true,
            message: "Task deleted successfully",
        });
    }
    catch (error) {
        console.error("Error deleting task:", error);
        return res.status(500).send({
            status: false,
            message: "An error occurred while deleting the task",
        });
    }
};
exports.deleteTask = deleteTask;
const getSingleTask = async (req, res) => {
    try {
        const { task_id } = req.params;
        const getSingleTaskQuery = await db_1.pool.query("SELECT * FROM tasks WHERE task_id = $1", [task_id]);
        if (getSingleTaskQuery.rowCount === 0) {
            return res.status(404).send({
                status: false,
                message: "Task not found",
            });
        }
        return res.status(200).send({
            status: true,
            message: "Task retrieved successfully",
            data: getSingleTaskQuery.rows[0],
        });
    }
    catch (error) {
        console.error("Error fetching task:", error);
        return res.status(500).send({
            status: false,
            message: "An error occurred while retrieving the task",
        });
    }
};
exports.getSingleTask = getSingleTask;
