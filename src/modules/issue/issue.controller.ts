import type { Request, Response } from "express";
import { issueService } from "./issue.service";
import sendResponse from "../../utility/sendResponse";

const createIssue = async (req: Request, res: Response) => {
  const { title, description, type } = req.body;

  try {
    if (!title || title.length > 150) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Bad Request",
      });
    }

    if (!description || description.trim().length < 20) {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Bad Request: Description must be at least 20 characters long",
      });
    }
    if (type !== "bug" && type !== "feature_request") {
      return sendResponse(res, {
        statusCode: 400,
        success: false,
        message: "Bad Request",
      });
    }
    const reporterId = (req as Request & { user: { id: number } }).user.id;

    const result = await issueService.createIssueIntoDb(req.body, reporterId);
    sendResponse(res, {
      statusCode: 201,
      success: true,
      message: "Issue created successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something Went Wrong";
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
    });
  }
};

const getAllIssue = async (req: Request, res: Response) => {
  try {
    const result = await issueService.getAllIssueIntoDb();

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue fetched successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something Went Wrong";
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
    });
  }
};

const singleIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const result = await issueService.singleIssueIntoDb(id as string);
    if (!result) {
      return sendResponse(res, {
        statusCode: 404,
        success: false,
        message: "Issue not found",
      });
    }

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Single Issue fetched successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something Went Wrong";
    sendResponse(res, {
      statusCode: 500,
      success: false,
      message: errorMessage,
    });
  }
};

const updateIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const { role, id: userId } = (
      req as Request & { user: { id: number; role: string } }
    ).user;
    const result = await issueService.updateIssueIntoDb(
      id as string,
      req.body,
      userId,
      role,
    );

    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue updated successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something Went Wrong";
    let statusCode = 500;
    if (errorMessage === "Issue not found") statusCode = 404;
    if (errorMessage.includes("only update your own")) statusCode = 403;
    if (errorMessage.includes("not open")) statusCode = 409;
    sendResponse(res, {
      statusCode,
      success: false,
      message: errorMessage,
    });
  }
};

const deleteIssue = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { role } = (req as Request & { user: { role: string } }).user;
    const result = await issueService.deleteIssueIntoDb(
      id as string,
      role as string,
    );
    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Issue deleted successfully",
      data: result,
    });
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Something Went Wrong";

    let statusCode = 500;
    if (errorMessage === "Issue not found") statusCode = 404;
    if (errorMessage.includes("Forbidden")) statusCode = 403;

    sendResponse(res, {
      statusCode,
      success: false,
      message: errorMessage,
    });
  }
};
export const issueController = {
  createIssue,
  getAllIssue,
  singleIssue,
  updateIssue,
  deleteIssue,
};
