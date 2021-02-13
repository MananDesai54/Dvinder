import validator from "validator";
import { ErrorResponse, MoreUserData, ValidationField } from "../config/types";

export const validateAddDetail = (addData: MoreUserData) => {
  const errors: ErrorResponse[] = [];
  const validations: ValidationField[] = [
    new ValidationField(
      !validator.isEmpty(addData.flair as string),
      "Please select a flair",
      "flair"
    ),
    new ValidationField(
      !validator.isEmpty(addData.gender as string),
      "Please select a option",
      "gender"
    ),
    new ValidationField(
      !validator.isEmpty(addData.showMe as string),
      "Please select a option",
      "showMe"
    ),
    new ValidationField(
      !validator.isDate(new Date(addData.birthDate as string).toString()),
      "Please provide valid date",
      "birthDate"
    ),
    new ValidationField(
      !validator.isEmpty(addData.lookingFor as string),
      "Please select a option",
      "lookingFor"
    ),
  ];

  for (const validation of validations) {
    if (!validation.success) {
      errors.push(validation);
    }
  }

  return errors;
};
