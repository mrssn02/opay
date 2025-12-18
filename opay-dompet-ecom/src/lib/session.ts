import { cookies } from "next/headers";
import { verifySession } from "./jwt";

export function getSession() {
  const token = cookies().get("session")?.value;
  if (!token) return null;
  return verifySession(token);
}
