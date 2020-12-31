import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../config/types";

export const isAuth: MiddlewareFn<MyContext> = ({ context: { req } }, next) => {
  if (!req.session.userId) {
    throw new Error("Not Authenticated");
  }
  return next();
};
