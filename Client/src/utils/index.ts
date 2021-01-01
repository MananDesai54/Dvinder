import { FormikHelpers } from "formik";
import { NextRouter } from "next/router";
import { ErrorResponse } from "../generated/graphql";
import { QueryInput, Cache } from "@urql/exchange-graphcache";

export const arrayToObject = (errors: ErrorResponse[]) => {
  const errorMap: Record<string, string> = {};
  errors.forEach((error) => {
    errorMap[error.field] = error.message;
  });
  return errorMap;
};

export const handleAuthAndError = (
  {
    setErrors,
  }: FormikHelpers<{
    email: string;
    password: string;
    username: string;
  }>,
  router: NextRouter,
  operation: any
) => {
  if (operation.errors) {
    setErrors(arrayToObject(operation.errors));
  } else if (operation.user) {
    if (router.query.next) {
      router.push(router.query.next.toString());
    } else {
      router.push("/");
    }
  }
};

export function betterUpdateQuery<Result, Query>(
  cache: Cache,
  qi: QueryInput,
  result: any,
  fn: (r: Result, q: Query) => Query
) {
  return cache.updateQuery(qi, (data) => fn(result, data as any) as any);
}

export const isServer = () => typeof window === "undefined";
