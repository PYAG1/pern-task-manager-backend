import  express, { Router }  from "express"
import { verifyJWT } from "../../middleware/verifyjwt"
import { createTask, deleteTask, getAllTasks, getAllTasksByDate, getSingleTask } from "../../controllers/tasks/TaskContoller"
const router:Router= express.Router()

router.route("/tasks")
.post(verifyJWT,createTask)
.get(verifyJWT,getAllTasks)


router.route("/tasks/:task_id")
.get(verifyJWT,getSingleTask)
.delete(verifyJWT,deleteTask)

router.route("/taskbyDate")
.get(verifyJWT,getAllTasksByDate)

export default router