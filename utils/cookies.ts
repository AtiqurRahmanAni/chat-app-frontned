import { cookies } from "next/headers";

export function deleteCookies() {
  if (cookies().has("tkn")) {
    cookies().delete("tkn");
  }
}

export function setCookies(token: string) {
  cookies().set({
    name: "tkn",
    value: token,
    httpOnly: true,
    sameSite: "strict",
    secure: process.env.NODE_ENV !== "development",
  });
}

export function getLoggedInInfo() {
  return cookies().get("tkn")?.value;
}
