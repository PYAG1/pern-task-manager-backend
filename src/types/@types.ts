import { Request } from "express";

export interface User {
    user_id: number;
    username: string;
    password_hash: string;
    createdAt: Date;
    updatedAt: Date;

  }
  

  export interface Task {
    task_id: number;                  // Unique identifier for the task
    user_Id: number;              // ID of the user who created the task
    title: string;               // Task title
    description: string;        // Optional task description
    isCompleted: boolean;        // Status of the task (completed or not)
    createdAt: Date;             // Timestamp when the task was created
    updatedAt: Date;             // Timestamp when the task was last updated
  }

  export interface Subtask {
    id: number;                  // Unique identifier for the subtask
    task_Id: number;              // ID of the associated task
    title: string;               // Subtask title
    isCompleted: boolean;        // Status of the subtask
    createdAt: Date;             // Timestamp when the subtask was created
    updatedAt: Date;             // Timestamp when the subtask was last updated
  }

  export enum HttpStatus {
    OK = 200,
    CREATED = 201,
    BAD_REQUEST = 400,
    UNAUTHORIZED = 401,
    FORBIDDEN = 403,
    NOT_FOUND = 404,
    CONFLICT = 409,
    INTERNAL_SERVER_ERROR = 500
  }
  

 
  export interface tokenPayload {
    id: string;
   
  }

  export interface Irequest extends Request{
    user_id:string
  }