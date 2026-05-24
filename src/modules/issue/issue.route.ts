import { Router } from "express";
import { issueController } from "./issue.controller";

const route = Router();

route.post("/", issueController.createIssue);
route.get("/", issueController.getAllIssue);

route.get("/:id", issueController.singleIssue);

route.put("/:id",issueController.updateIssue);

route.delete("/:id"),

export const issueRoute = route;
