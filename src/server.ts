
import express, { NextFunction ,Request,Response} from "express"
import cors from "cors"
import userAuthRouter from "./routes/auth/a"
import taskRouter from "./routes/tasks/tasks.js"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import { corsOptions } from "./config/corsOption"
const app = express()
const port = 8080
dotenv.config();
app.use(express.json(), bodyParser.json());
app.use(cors(corsOptions))

app.all("/", (req: Request, res: Response) => {
  res.send({
    status: true,
    message: "Welcome to pernstack api",
  });
});
app.use("/api",userAuthRouter)
app.use("/api",taskRouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})