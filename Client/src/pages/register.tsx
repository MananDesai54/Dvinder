import { Box, Button } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FC } from "react";
import { useMutation } from "urql";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { REGISTER_MUTATION } from "../mutations";

interface registerProps {}

const Register: FC<registerProps> = ({}) => {
  const [, register] = useMutation(REGISTER_MUTATION);

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={(values) => {
          return register(values);
        }}
      >
        {({ isSubmitting }) => (
          <Form>
            <InputField name="username" type="text" label="Username" />
            <Box mt={4}>
              <InputField name="email" type="email" label="Email" />
            </Box>
            <Box mt={4}>
              <InputField name="password" type="password" label="Password" />
            </Box>
            <Button
              isLoading={isSubmitting}
              type="submit"
              colorScheme="teal"
              mt={4}
            >
              Register
            </Button>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
