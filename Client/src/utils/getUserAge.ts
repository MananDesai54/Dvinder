export function getAge(birthDate: string) {
  let array: any;
  if (birthDate?.includes("/")) {
    array = birthDate?.split("/");
  } else if (birthDate?.includes("-")) {
    array = birthDate?.split("-");
  } else if (birthDate?.includes(".")) {
    array = birthDate?.split(".");
  }
  const _birthDate = new Date(array[2], array[1], array[0]);
  const today = new Date();
  let age = today.getFullYear() - _birthDate.getFullYear();
  const m = today.getMonth() - _birthDate.getMonth();
  if (m < 0 || (m === 0 && today.getDate() < _birthDate.getDate())) {
    age--;
  }
  return age;
}
