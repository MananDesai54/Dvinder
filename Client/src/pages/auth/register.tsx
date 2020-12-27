import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FC } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useRegisterMutation } from "../../generated/graphql";
import { handleAuthAndError } from "../../utils";
import { useRouter } from "next/router";
import NextLink from "next/link";
// import { REGISTER_MUTATION } from "../mutations";
// import { useMutation } from "urql";

interface registerProps {}

const Register: FC<registerProps> = ({}) => {
  const [, register] = useRegisterMutation();
  const router = useRouter();

  return (
    <Wrapper variant="small">
      <Formik
        initialValues={{ username: "", password: "", email: "" }}
        onSubmit={async (values, errors) => {
          const response = await register(values);
          console.log(typeof response.data?.registerUser);
          handleAuthAndError(errors, router, response.data?.registerUser);
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
            <Box mt={2}>
              Already have account ?{" "}
              <NextLink href="/auth/login">
                <Link fontWeight="bold"> Login</Link>
              </NextLink>
            </Box>
          </Form>
        )}
      </Formik>
    </Wrapper>
  );
};

export default Register;
