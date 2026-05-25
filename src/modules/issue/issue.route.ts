import { Router } from "express";
import { issueController } from "./issue.controller";
import { auth } from "../../middleware/auth/auth";
import { USER_ROLE } from "../../Types";

const route = Router();

route.post(
  "/", 
  auth(USER_ROLE.maintainer, USER_ROLE.contributor), 
  issueController.createIssue
);

route.get("/", issueController.getAllIssue);

route.get("/:id", issueController.singleIssue);

route.patch(
  "/:id",
  auth(USER_ROLE.maintainer, USER_ROLE.contributor),
  issueController.updateIssue
);
route.delete(
  "/:id",
  auth(USER_ROLE.maintainer),
  issueController.deleteIssue
);
export const issueRoute = route;
