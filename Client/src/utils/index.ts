import { FormikHelpers } from "formik";
import { NextRouter } from "next/router";
import { OperationResult } from "urql";
import { ErrorResponse } from "../generated/graphql";

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
    router.push("/");
  }
};
