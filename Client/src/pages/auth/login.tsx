import { Box, Button, Link, Image } from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
// import Image from 'next/image';
import { FC } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useLoginMutation,
  useMeQuery,
  useLoginWithGithubMutation,
} from "../../generated/apollo-graphql";
import { handleAuthAndError, isServer } from "../../utils";
import NextLink from "next/link";
import { withApolloClient } from "../../utils/withApollo";
import GitHubLogin from "react-github-login";
import { FaGithub } from "react-icons/fa";
// import { useLoginMutation, useMeQuery } from "../../generated/graphql";
// import { withUrqlClient } from "next-urql";
// import { createUrqlClient } from "../../utils/createUrqlClient";

interface LoginProps {}

const Login: FC<LoginProps> = ({}) => {
  // const [, login] = useLoginMutation();
  const [login] = useLoginMutation();
  const [loginWithGithub] = useLoginWithGithubMutation();
  const router = useRouter();

  // const [{ data }] = useMeQuery();
  const { data } = useMeQuery();

  if (data?.me && !isServer()) {
    router.replace("/");
  }

  return (
    // <Box
    //   display="flex"
    //   justifyContent="center"
    //   alignItems="center"
    //   height="70vh"
    // >
    //   <Box
    //     style={{
    //       width: "50%",
    //       display: "flex",
    //       flexDirection: "column",
    //       alignItems: "center",
    //     }}
    //   >
    //     <h1
    //       style={{
    //         fontSize: "3vw",
    //         fontWeight: "bold",
    //         width: "60%",
    //         marginBottom: "3rem",
    //       }}
    //     >
    //       Sign In to Grow Community
    //     </h1>
    //     <p
    //       style={{
    //         fontSize: "20px",
    //         width: "60%",
    //       }}
    //     >
    //       If you don't have an account You can{" "}
    //       <span
    //         style={{
    //           color: "var(--background-primary)",
    //           fontWeight: "bold",
    //           cursor: "pointer",
    //         }}
    //         onClick={() => router.push("/auth/register")}
    //       >
    //         Register here!
    //       </span>
    //     </p>
    //     <div
    //       style={{
    //         background:
    //           "linear-gradient(var(--background-secondary), var(--background-accent) 50%, var(--background-tertiary))",
    //         height: "350px",
    //         width: "350px",
    //         borderRadius: "175px",
    //         position: "absolute",
    //         left: "150px",
    //         top: "20%",
    //         zIndex: -1,
    //         filter: "blur(100px)",
    //         opacity: "0.8",
    //       }}
    //     ></div>
    //     <Image
    //       src="/images/heroImage.png"
    //       style={{
    //         position: "fixed",
    //         bottom: 0,
    //         left: "20px",
    //       }}
    //     />
    //     <Button
    //       style={{
    //         color: "var(--background-primary)",
    //         borderRadius: "100vw",
    //         boxShadow: "0 0 40px rgba(0, 0, 0, 0.2)",
    //         position: "absolute",
    //         top: "20px",
    //         right: "40px",
    //       }}
    //       onClick={() => router.push("/auth/register")}
    //     >
    //       Register
    //     </Button>
    //   </Box>
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
      {({ isSubmitting }) => (
        <Wrapper variant="small" width={300}>
          <h1
            style={{
              margin: "2rem 0",
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
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
          <Box mt={2} textAlign="center">
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
              background="rgba(0, 0, 0, 0.2)"
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
              background="rgba(0, 0, 0, 0.2)"
            ></Box>
          </Box>
          <GitHubLogin
            clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}
            onSuccess={async (response: any) => {
              const responseData = await loginWithGithub({
                variables: { code: response.code },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.loginWithGithub.user,
                    },
                  });
                  cache.evict({ fieldName: "feeds" });
                },
              });
              console.log(responseData);
            }}
            onFailure={(response: any) => console.log(response)}
            redirectUri=""
            scope="user:email"
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
                marginLeft: "125px",
              }}
            />
          </GitHubLogin>
        </Wrapper>
      )}
    </Formik>
    // </Box>
  );
};

// export default withUrqlClient(createUrqlClient, { ssr: false })(Login);
export default withApolloClient({ ssr: false })(Login);
