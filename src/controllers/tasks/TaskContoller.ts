import { Response, Request } from "express";
import { HttpStatus, Irequest } from "../../types/@types";
import { pool } from "../../config/db";

export async function createTask(req: Irequest, res: Response) {
  try {
    const { title, due_date, description, time, priority } = req.body;

    if (!title || !due_date) {
      return res.status(HttpStatus.BAD_REQUEST).send({
        status: false,
        message: "Please provide a title and due date",
      });
    }

    const createTaskQuery = `
            INSERT INTO tasks (title, description, due_date, time, priority, user_id)
            VALUES ($1, $2, $3, $4, $5, $6)
            RETURNING *;
        `;
    const createTask = await pool.query(createTaskQuery, [
      title,
      description,
      due_date,
      time,
      priority,
      req.user_id,
    ]);

    return res.status(HttpStatus.CREATED).send({
      status: true,
      message: "Task created successfully",
      data: createTask.rows[0],
    });
  } catch (error) {
    console.error("Error creating task:", error);
    return res.status(HttpStatus.INTERNAL_SERVER_ERROR).send({
      status: false,
      message: "An error occurred while creating the task",
    });
  }
}

export async function getAllTasks(req: Irequest, res: Response) {
  try {
    if (!req.user_id) {
      return res.status(401).send({
        status: false,
        message: "Unauthorized: No user ID found",
      });
    }

    const getAllTasksQuery = await pool.query(
      "SELECT * FROM tasks WHERE user_id = $1",
      [req.user_id]
    );

    return res.status(200).send({
      status: true,
      message: "Tasks retrieved successfully",
      data: getAllTasksQuery.rows || [],
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).send({
      status: false,
      message: "An error occurred while fetching tasks",
    });
  }
}

export const deleteTask = async (req: Request, res: Response) => {
  try {
    const { task_id } = req.params;

    const deleteTaskQuery = await pool.query(
      "DELETE FROM tasks WHERE task_id = $1 RETURNING *",
      [task_id]
    );

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
  } catch (error) {
    console.error("Error deleting task:", error);

    return res.status(500).send({
      status: false,
      message: "An error occurred while deleting the task",
    });
  }
};

export const getSingleTask = async (req: Request, res: Response) => {
  try {
    const { task_id } = req.params;

    const getSingleTaskQuery = await pool.query(
      "SELECT * FROM tasks WHERE task_id = $1",
      [task_id]
    );

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
  } catch (error) {
    console.error("Error fetching task:", error);

    return res.status(500).send({
      status: false,
      message: "An error occurred while retrieving the task",
    });
  }
};


export const getAllTasksByDate = async (req: Request, res: Response) => {
  try {
    const { start_date, end_date } = req.query;

    // Base query to get all tasks
    let query = "SELECT * FROM tasks";
    const values: any[] = [];


    if (start_date && end_date) {
      query += " WHERE created_at >= $1 AND created_at <= $2";
      values.push(start_date, end_date);
    } else if (start_date) {
      query += " WHERE created_at >= $1";
      values.push(start_date);
    } else if (end_date) {
      query += " WHERE created_at <= $1";
      values.push(end_date);
    }

    const getTasksQuery = await pool.query(query, values);

    return res.status(200).json({
      status: true,
      message: "Tasks retrieved successfully",
      data: getTasksQuery.rows,
    });
  } catch (error) {
    console.error("Error fetching tasks:", error);
    return res.status(500).json({
      status: false,
      message: "An error occurred while retrieving tasks",
    });
  }
};

