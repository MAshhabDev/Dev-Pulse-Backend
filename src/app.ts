import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issue/issue.route";
const app: Application = express();

app.use(express.json());

app.use("/api/auth/", authRoute);

app.use("/api/issues", issueRoute);

app.get("/", async (req: Request, res: Response) => {
  res.send("Dev Pulse Server Is Running...");
});

export default app;
