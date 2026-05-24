import { pool } from "../../db";
import type { IIssue } from "./issue.interface";

const createIssueIntoDb = async (payload: IIssue, reporterId: number) => {
  const { title, description, type } = payload;

  const result = await pool.query(
    `INSERT INTO issues(title,description,type,reporter_id) VALUES($1,$2,$3,$4) RETURNING *
    `,
    [title, description, type, reporterId],
  );

  return result;
};

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
        role: reporterUser?.role
      },
    };
  });

  return combinedData
};

export const issueService = {
  createIssueIntoDb,
  getAllIssueIntoDb
};
