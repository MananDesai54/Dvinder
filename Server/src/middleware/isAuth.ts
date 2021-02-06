import { MiddlewareFn } from "type-graphql";
import { MyContext } from "../config/types";

export const isAuth: MiddlewareFn<MyContext> = ({ context: { req } }, next) => {
  console.log(req.session.userId);
  if (!req.session.userId) {
    throw new Error("Not Authenticated");
  }
  return next();
};
