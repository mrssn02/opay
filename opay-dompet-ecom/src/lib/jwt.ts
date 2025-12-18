import crypto from "crypto";

const secret = process.env.JWT_SECRET || "dev_secret_change_me";

type Payload = { userId: string; role: "USER" | "ADMIN"; exp: number };

function b64url(input: Buffer | string) {
  return Buffer.from(input).toString("base64url");
}
function ub64url(input: string) {
  return Buffer.from(input, "base64url").toString("utf8");
}

export function signSession(data: { userId: string; role: "USER" | "ADMIN" }, ttlSeconds = 60 * 60 * 24 * 7) {
  const header = b64url(JSON.stringify({ alg: "HS256", typ: "JWT" }));
  const payload: Payload = { ...data, exp: Math.floor(Date.now() / 1000) + ttlSeconds };
  const body = b64url(JSON.stringify(payload));
  const sig = crypto.createHmac("sha256", secret).update(`${header}.${body}`).digest("base64url");
  return `${header}.${body}.${sig}`;
}

export function verifySession(token: string): null | { userId: string; role: "USER" | "ADMIN" } {
  const parts = token.split(".");
  if (parts.length !== 3) return null;
  const [h, b, s] = parts;
  const sig = crypto.createHmac("sha256", secret).update(`${h}.${b}`).digest("base64url");
  if (sig !== s) return null;

  const payload = JSON.parse(ub64url(b)) as Payload;
  if (!payload?.userId || !payload?.role || !payload?.exp) return null;
  if (payload.exp < Math.floor(Date.now() / 1000)) return null;

  return { userId: payload.userId, role: payload.role };
}
