export type Role = "contributor" | "maintainer";

export interface IUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  updated_at: Date;
}

export type status = "open" | "in_progress" | "resolved";

export type Type = "bug" | "feature_request";
