import { CookieOptions } from "express";
import { EnvConfig } from "./env";

export const accesCookieConfig: CookieOptions = {
  maxAge: 15 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};

export const refreshCookieConfig: CookieOptions = {
  maxAge: 7 * 24 * 60 * 60 * 1000,
  httpOnly: true,
  secure: true,
  sameSite: "strict",
};
