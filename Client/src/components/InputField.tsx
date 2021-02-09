import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
} from "@chakra-ui/react";
import { useField } from "formik";
import { FC, InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  type: string;
  placeholder?: string;
};

const InputField: FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <Input
        {...field}
        type={props.type}
        id={field.name}
        placeholder={props.label ? props.label : props.placeholder}
        style={{
          background: "var(--white-color)",
          border: "none",
          borderWidth: "2px",
        }}
        autoFocus={props.autoFocus}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
