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

export const getCheckboxBoolean = (values: string, type: string) => {
  if (values === "all") {
    return [false, false, false, true];
  } else {
    const valuesArray = values.split(" ");
    valuesArray.length = valuesArray.length - 1;
    if (valuesArray.length === 3) {
      return [false, false, false, true];
    } else {
      const finalResult = [false, false, false, false];
      const valueToGetOf: string[] = type === "showMe" ? showMe : lookingFor;
      valuesArray.forEach((value) => {
        finalResult[valueToGetOf.indexOf(value)] = true;
      });
      return finalResult;
    }
  }
};
