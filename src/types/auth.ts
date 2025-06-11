export type role = "admin" | "user";

export interface AuthProps {
  email: string;
  password: string;
}

export interface RegisterProps extends AuthProps {
  name: string;
  role: role;
}
