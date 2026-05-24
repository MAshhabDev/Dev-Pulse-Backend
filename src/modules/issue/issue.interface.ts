import type { status, Type } from "../../Types";

export interface IIssue {
  title: string;
  description: string;
  type: Type;
}

export interface IDbIssue extends IIssue {
  id: number;
  status: status;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}