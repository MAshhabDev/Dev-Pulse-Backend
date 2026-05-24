import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

// Create Issue

const createIssueIntoDb = async (payload: IIssue, reporterId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `INSERT INTO issues(title,description,type,reporter_id) VALUES($1,$2,$3,$4) RETURNING *
    `,
    [title, description, type, reporterId],
  );

  return result.rows[0];
};

// Get All Issue
const getAllIssueIntoDb = async () => {
  const issueData = await pool.query(
    `SELECT * FROM issues ORDER BY created_at DESC `,
  );

  const issues = issueData.rows;
  if (issues.length === 0) {
    return [];
  }
  const reporterIds = issues.map((issue) => issue.reporter_id);

  const result = await pool.query(
    `SELECT id,name, role FROM users WHERE id=ANY($1)`,
    [reporterIds],
  );

  const users = result.rows;

  const combinedData = issues.map((issue) => {
    const reporterUser = users.find((user) => user.id === issue.reporter_id);
    return {
      id: issue.id,
      title: issue.title,
      description: issue.description,
      type: issue.type,
      status: issue.status,
      created_at: issue.created_at,
      updated_at: issue.updated_at,
      reporter: {
        id: reporterUser?.id,
        name: reporterUser?.name,
        role: reporterUser?.role,
      },
    };
  });

  return combinedData;
};

// Single Issue

const singleIssueIntoDb = async (id: string) => {
  const singleIssue = await pool.query(
    `
        
        SELECT * FROM issues where id=$1`,
    [id],
  );

  if (singleIssue.rows.length === 0) {
    return null;
  }

  const issue = singleIssue.rows[0];

  const user = await pool.query(
    `SELECT id, name, role FROM users WHERE id = $1`,
    [issue.reporter_id],
  );

  const reporterUser = user.rows[0];
  const combinedSingleIssue = {
    id: issue.id,
    title: issue.title,
    description: issue.description,
    type: issue.type,
    status: issue.status,
    created_at: issue.created_at,
    updated_at: issue.updated_at,
    reporter: {
      id: reporterUser?.id,
      name: reporterUser?.name,
      role: reporterUser?.role,
    },
  };

  return combinedSingleIssue;
};

// Update Issue

const updateIssueIntoDb = async (
  id: string,
  payload: any,
  userId: number,
  role: string,
) => {
  const issueData = await pool.query(`SELECT * FROM issues WHERE id=$1`, [id]);
  if (issueData.rows.length === 0) {
    throw new Error("Issue not found");
  }
  const issue = issueData.rows[0];

  if (role === "contributor") {
    if (issue.reporter_id !== userId) {
      throw new Error("You can only update your own issues");
    }
    if (issue.status !== "open") {
      throw new Error("Cannot update an issue that is not open");
    }
  }

  const status = role === "maintainer" ? payload.status : issue.status;

  const updatedResult = await pool.query(
    `UPDATE issues 
     SET 
        title = COALESCE($1, title), 
        description = COALESCE($2, description), 
        type = COALESCE($3, type), 
        status = COALESCE($4, status), 
        updated_at = NOW() 
     WHERE id = $5 
     RETURNING *`,
    [
      payload.title || null,
      payload.description || null,
      payload.type || null,
      status || null,
      id,
    ],
  );

  return updatedResult.rows[0];
};

// Delete Issue
const deleteIssueIntoDb = async (id: string, role: string) => {
  if (role !== "maintainer") {
    throw new Error("Forbidden: Only maintainers can delete issues");
  }
  const issue = await pool.query(`SELECT * FROM issues WHERE id = $1`, [id]);
  if (issue.rows.length === 0) {
    throw new Error("Issue not found");
  }
  const result = await pool.query(
    `DELETE FROM issues WHERE id=$1 RETURNING *`,
    [id],
  );
  return result.rows[0];
};
export const issueService = {
  createIssueIntoDb,
  getAllIssueIntoDb,
  singleIssueIntoDb,
  updateIssueIntoDb,
  deleteIssueIntoDb,
};
