import { getSession } from "./session";

export function requireAdmin() {
  const s = getSession();
  if (!s || s.role !== "ADMIN") return null;
  return s;
}
