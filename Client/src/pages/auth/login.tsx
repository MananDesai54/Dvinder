import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useLoginMutation } from "../../generated/graphql";
import { handleAuthAndError } from "../../utils";

interface LoginProps {}

const Login: FC<LoginProps> = ({}) => {
  const [, login] = useLoginMutation();
  const router = useRouter();

  return (
    <Formik
      // username included for matching types for handleAuthAndError
      initialValues={{ email: "", password: "", username: "" }}
      onSubmit={async (values, errors) => {
        const response = await login({
          email: values.email,
          password: values.password,
        });
        handleAuthAndError(errors, router, response.data?.login);
      }}
    >
      {() => (
        <Wrapper>
          <Form>
            <InputField name="email" type="email" label="Email" />
            <Box mt={4}>
              <InputField name="password" type="password" label="Password" />
            </Box>
            <Button mt={4} colorScheme="teal" type="submit">
              Login
            </Button>
          </Form>
        </Wrapper>
      )}
    </Formik>
  );
};

export default Login;
