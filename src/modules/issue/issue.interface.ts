import type { status, Type } from "../../Types";

export interface IIssue {
  id: number;
  title: string;
  description: string;
  type: Type;
  status: status;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

export interface GetAllIssue {
  type?: string;
  status?: string;
  sort?: string;
}


export interface IDbIssue extends IIssue {
  id: number;
  status: status;
  reporter_id: number;
  created_at: Date;
  updated_at: Date;
}

