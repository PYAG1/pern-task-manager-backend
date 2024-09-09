
import express, { NextFunction ,Request,Response} from "express"
import cors from "cors"
import userAuthRouter from "./routes/auth/a"
import dotenv from "dotenv"
import bodyParser from "body-parser"
import { hashPassword } from "./services/encryption.service"
const app = express()
const port = 3000
dotenv.config();
app.use(express.json(), bodyParser.json());
app.use(cors())

app.all("/", (req: Request, res: Response) => {
  res.send({
    status: true,
    message: "Welcome to pernstack api",
  });
});
app.use("/api",userAuthRouter)


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})