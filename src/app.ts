import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { request } from "http";
const app: Application = express();


app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World");
});





export default app
