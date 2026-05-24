import type { Request, Response } from "express";
import { issueService } from "./issue.server";

const createIssue = async (req: Request, res: Response) => {
  const { title, description, type } = req.body;

  try {
    if (!title || title.length > 150) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }

    if (!description || description.length < 20) {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }
    if (type !== "bug" && type !== "feature_request") {
      return res.status(400).json({
        success: false,
        message: "Bad Request",
      });
    }
    const reporterId = (req as any).user.id;

    const result = await issueService.createIssueIntoDb(req.body, reporterId);
    res.status(201).json({
      success: true,
      message: "Issue created successfully",
      data: result.rows[0],
    });
  } catch (error: any) {
    res.status(500).json({
      success: false,
      message: "Something went wrong",
      errors: error.message || error,
    });
  }
};
