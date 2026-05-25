export const USER_ROLE = {
  maintainer: "maintainer",

  contributor: "contributor",
} as const;


export type Role = (typeof USER_ROLE)[keyof typeof USER_ROLE];
export interface IUser {
  id: number;
  name: string;
  email: string;
  role: Role;
  updated_at: Date;
}

export type status = "open" | "in_progress" | "resolved";

export type Type = "bug" | "feature_request";
