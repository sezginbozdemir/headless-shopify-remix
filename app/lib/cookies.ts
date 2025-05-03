import { createCookie } from "@remix-run/node"; // or cloudflare/deno

export const cartIdCookie = createCookie("cartId", {
  maxAge: 604_800,
  path: "/",
  httpOnly: true,
  sameSite: "lax",
});
