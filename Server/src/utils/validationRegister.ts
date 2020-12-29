import validator from "validator";
import { ErrorResponse, UserData, ValidationField } from "../config/types";

export const validateRegister = (userData: UserData) => {
  const errors: ErrorResponse[] = [];
  const validations: ValidationField[] = [
    new ValidationField(
      validator.isEmail(userData.email),
      "Please enter valid email. i.e: abc@xyz.com",
      "email"
    ),
    new ValidationField(
      validator.isLength(userData.password, { min: 8, max: 32 }),
      "Length must be between 8-32.",
      "password"
    ),
    new ValidationField(
      validator.isLength(userData.username!, { min: 3 }) &&
        !validator.contains(userData.username!, "@"),
      "1. Length must be GREATER THAN 2 and must NOT CONTAIN @",
      "username"
    ),
  ];

  for (const validation of validations) {
    if (!validation.success) {
      errors.push(validation);
    }
  }

  return errors;
};
