const showMe = ["male", "female", "non", "all"];
const lookingFor = ["love", "friend", "project", "all"];

export const getCheckboxValue = (values: boolean[], type: string) => {
  if (values[values.length - 1] || (values[0] && values[1] && values[2])) {
    return "all";
  }
  let finalValue = "";
  const valueToGetOf: string[] = type === "showMe" ? showMe : lookingFor;
  valueToGetOf.forEach((value, index) => {
    if (values[index]) {
      finalValue = finalValue.concat(`${value} `);
    }
  });
  return finalValue;
};
