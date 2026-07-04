// lib/session.ts
// Handles Joy's login session using iron-session

import { getIronSession, IronSessionData } from "iron-session";
import { cookies } from "next/headers";

// Extend iron-session's data type
declare module "iron-session" {
  interface IronSessionData {
    isLoggedIn?: boolean;
  }
}

const sessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: "house-of-joy-admin",
  cookieOptions: {
    secure: process.env.NODE_ENV === "production",
    httpOnly: true,
    maxAge: 60 * 60 * 24 * 7, // 1 week
  },
};

export async function getSession() {
  const session = await getIronSession<IronSessionData>(
    await cookies(),
    sessionOptions
  );
  return session;
}
