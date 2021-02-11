import { Box, Button, Link } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
// import Image from 'next/image';
import { FC } from "react";
import GitHubLogin from "react-github-login";
import { FaGithub } from "react-icons/fa";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import {
  useLoginMutation,
  useLoginWithGithubMutation,
  useMeQuery,
} from "../../generated/apollo-graphql";
import { handleAuthAndError, isServer } from "../../utils";
import { updateUserDataInCache } from "../../utils/updateUserDataInCache";
import { withApolloClient } from "../../utils/withApollo";
import { useIsAuth } from "../../hooks/useIsAuth";

interface LoginProps {}

const Login: FC<LoginProps> = ({}) => {
  const [login] = useLoginMutation();
  const [loginWithGithub] = useLoginWithGithubMutation();
  const router = useRouter();

  const { data } = useMeQuery();

  if (data?.me && !isServer()) {
    router.replace("/");
  }

  return (
    <Formik
      initialValues={{ email: "", password: "", username: "" }}
      onSubmit={async (values, errors) => {
        const response = await login({
          variables: {
            usernameOrEmail: values.email,
            password: values.password,
          },
          update: (cache, { data }) =>
            updateUserDataInCache(cache, data?.login),
        });
        handleAuthAndError(errors, router, response.data?.login);
      }}
    >
      {({ isSubmitting }) => (
        <Wrapper variant="small">
          <h1
            style={{
              margin: "2rem 0",
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "var(--text-primary)",
            }}
          >
            Login
          </h1>
          <Form>
            <InputField name="email" type="text" label="Username Or Email" />
            <Box mt={4}>
              <InputField name="password" type="password" label="Password" />
            </Box>
            <Box mt={2}>
              <NextLink href="/forget-password">
                <Link
                  style={{
                    color: "gray",
                    fontSize: "14px",
                  }}
                >
                  {" "}
                  Forgot password?{" "}
                </Link>
              </NextLink>
            </Box>
            <Button
              isLoading={isSubmitting}
              my={4}
              style={{
                background: "var(--background-primary)",
                color: "var(--text-primary)",
                boxShadow: "0 10px 30px rgba(0, 0, 255, 0.3)",
              }}
              type="submit"
              width="100%"
            >
              Login
            </Button>
          </Form>
          <Box
            mt={2}
            textAlign="center"
            style={{
              color: "var(--white-color)",
            }}
          >
            Already have account ?{" "}
            <NextLink href="/auth/register">
              <Link fontWeight="bold"> Register</Link>
            </NextLink>
          </Box>
          <Box my={4} display="flex" alignItems="center">
            <Box
              height="1px"
              flex="1"
              borderRadius={10}
              background="rgba(255, 255, 255, 0.5)"
            ></Box>
            <Box
              mx={2}
              style={{
                color: "gray",
              }}
            >
              Or Continue With
            </Box>
            <Box
              height="1px"
              borderRadius={10}
              flex="1"
              background="rgba(255, 255, 255, 0.5)"
            ></Box>
          </Box>
          <GitHubLogin
            clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}
            onSuccess={async (response: any) => {
              const responseData = await loginWithGithub({
                variables: { code: response.code },
                update: (cache, { data }) =>
                  updateUserDataInCache(cache, data?.loginWithGithub),
              });
              console.log(responseData);
            }}
            onFailure={(response: any) => console.log(response)}
            redirectUri=""
            scope="user:email"
          >
            <div
              style={{
                width: "400px",
                display: "flex",
                justifyContent: "center",
                outline: "none",
              }}
            >
              <FaGithub
                size={30}
                style={{
                  padding: "10px",
                  background: "var(--white-color)",
                  borderRadius: "10px",
                  width: "50px",
                  height: "50px",
                  boxShadow: "0 0 40px rgba(0, 0, 0, 0.3)",
                  outline: "none",
                }}
              />
            </div>
          </GitHubLogin>
        </Wrapper>
      )}
    </Formik>
    // </Box>
  );
};

export default withApolloClient({ ssr: false })(Login);
