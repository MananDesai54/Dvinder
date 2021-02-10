import {
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Textarea,
} from "@chakra-ui/react";
import { useField } from "formik";
import { FC, InputHTMLAttributes } from "react";

type InputFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  name: string;
  label?: string;
  type: string;
  placeholder?: string;
  isTextArea?: boolean;
};

const InputField: FC<InputFieldProps> = (props) => {
  const [field, { error }] = useField(props);

  let InputOrTextarea: any = Input;
  if (props.isTextArea) {
    InputOrTextarea = Textarea;
  }
  return (
    <FormControl isInvalid={!!error}>
      <FormLabel htmlFor={field.name}>{props.label}</FormLabel>
      <InputOrTextarea
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
