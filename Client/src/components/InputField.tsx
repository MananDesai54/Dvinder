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
      <FormLabel
        fontSize="1.2rem"
        color="var(--white-color)"
        htmlFor={field.name}
      >
        {props.label}
      </FormLabel>
      <InputOrTextarea
        {...field}
        type={props.type}
        id={field.name}
        placeholder={props.placeholder ? props.placeholder : props.label}
        style={{
          background: "var(--white-color)",
          // color: "var(--white-color)",
        }}
        autoFocus={props.autoFocus}
        _placeholder={{ fontWeight: 500 }}
      />
      {error && <FormErrorMessage>{error}</FormErrorMessage>}
    </FormControl>
  );
};

export default InputField;
