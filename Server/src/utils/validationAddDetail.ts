import validator from "validator";
import { ErrorResponse, MoreUserData, ValidationField } from "../config/types";

const re = /^(?:(?:31(\/|-|\.)(?:0?[13578]|1[02]))\1|(?:(?:29|30)(\/|-|\.)(?:0?[13-9]|1[0-2])\2))(?:(?:1[6-9]|[2-9]\d)?\d{2})$|^(?:29(\/|-|\.)0?2\3(?:(?:(?:1[6-9]|[2-9]\d)?(?:0[48]|[2468][048]|[13579][26])|(?:(?:16|[2468][048]|[3579][26])00))))$|^(?:0?[1-9]|1\d|2[0-8])(\/|-|\.)(?:(?:0?[1-9])|(?:1[0-2]))\4(?:(?:1[6-9]|[2-9]\d)?\d{2})$/;

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
      re.test(addData.birthDate as string),
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
