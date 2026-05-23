import type { Role } from "../../Types";

export interface IUser {
  name: string;
  email: string;
  password: string;
  role: Role;
}
