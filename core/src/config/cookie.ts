import { CookieOptions } from "express";

const isProduction = process.env.NODE_ENV === "production";

export const accesCookieConfig: CookieOptions = {
  maxAge: 1 * 60 * 1000,
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};

export const refreshCookieConfig: CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: isProduction,
  sameSite: "lax",
  path: "/",
};
