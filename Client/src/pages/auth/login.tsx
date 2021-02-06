import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import { FC } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
// import { useLoginMutation, useMeQuery } from "../../generated/graphql";
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useMeQuery,
} from "../../generated/apollo-graphql";
import { handleAuthAndError, isServer } from "../../utils";
import NextLink from "next/link";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";
import { withApolloClient } from "../../utils/withApollo";
import GitHubLogin from "react-github-login";

interface LoginProps {}

const Login: FC<LoginProps> = ({}) => {
  // const [, login] = useLoginMutation();
  const [login] = useLoginMutation();
  const router = useRouter();

  // const [{ data }] = useMeQuery();
  const { data } = useMeQuery();

  if (data?.me && !isServer()) {
    router.replace("/");
  }

  return (
    <Formik
      // username included for matching types for handleAuthAndError
      initialValues={{ email: "", password: "", username: "" }}
      onSubmit={async (values, errors) => {
        // const response = await login({
        //   usernameOrEmail: values.email,
        //   password: values.password,
        // });
        const response = await login({
          variables: {
            usernameOrEmail: values.email,
            password: values.password,
          },
          update: (cache, { data }) => {
            cache.writeQuery<MeQuery>({
              query: MeDocument,
              data: {
                __typename: "Query",
                me: data?.login.user,
              },
            });
            cache.evict({ fieldName: "feeds" });
          },
        });
        handleAuthAndError(errors, router, response.data?.login);
      }}
    >
      {() => (
        <Wrapper variant="small">
          <GitHubLogin
            clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}
            onSuccess={(response: any) => console.log(response)}
            onFailure={(response: any) => console.log(response)}
            redirectUri=""
            scope="user:email"
          />
          <Form>
            <InputField name="email" type="text" label="Username Or Email" />
            <Box mt={4}>
              <InputField name="password" type="password" label="Password" />
            </Box>
            <Box mt={2}>
              <NextLink href="/forget-password">
                <Link fontWeight="bold"> Forgot password? </Link>
              </NextLink>
            </Box>
            <Button mt={4} colorScheme="teal" type="submit">
              Login
            </Button>
          </Form>
          <Box mt={2}>
            Already have account ?{" "}
            <NextLink href="/auth/register">
              <Link fontWeight="bold"> Register</Link>
            </NextLink>
          </Box>
        </Wrapper>
      )}
    </Formik>
  );
};

// export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
export default withApolloClient({ ssr: false })(Login);
