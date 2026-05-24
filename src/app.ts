import express, {
  type Application,
  type Request,
  type Response,
} from "express";
import { request } from "http";
import { userRoute } from "./modules/user/user.route";
import { authRoute } from "./modules/auth/auth.route";
import { issueRoute } from "./modules/issue/issue.route";
const app: Application = express();

app.use(express());

app.use("api/auth/signup", userRoute);
app.use("api/auth/signin", authRoute);

app.use("api/issues", issueRoute);

app.get("/", async (req: Request, res: Response) => {
  res.send("Hello World");
});

export default app;
