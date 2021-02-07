import {
  Box,
  Button,
  Link,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { FC, Fragment, useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import {
  MeDocument,
  MeQuery,
  useMeQuery,
  useRegisterMutation,
  useRegisterWithGithubMutation,
  useAddOrUpdatePasswordMutation,
} from "../../generated/apollo-graphql";
import { handleAuthAndError, isServer } from "../../utils";
import { useRouter } from "next/router";
import NextLink from "next/link";
import { withApolloClient } from "../../utils/withApollo";
import GitHubLogin from "react-github-login";
import { useIsAuth } from "../../hooks/useIsAuth";
import { FaGithub } from "react-icons/fa";
// import { useMeQuery, useRegisterMutation } from "../../generated/graphql";
// import { createUrqlClient } from "../../utils/createUrqlClient";
// import { withUrqlClient } from "next-urql";

interface registerProps {}

const Register: FC<registerProps> = ({}) => {
  // const [, register] = useRegisterMutation();
  const [register] = useRegisterMutation();
  const [registerWithGithub] = useRegisterWithGithubMutation();
  const [addPassword] = useAddOrUpdatePasswordMutation();
  const [doneRegistration, setDoneRegistration] = useState(false);
  const [doneAddPassword, setDoneAddPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [error, setError] = useState("");

  const router = useRouter();
  const isAuth = useIsAuth();
  // const [{ data }] = useMeQuery();
  // const { data } = useMeQuery();

  if (isAuth || doneAddPassword) {
    router.replace("/");
  }

  return (
    <Wrapper variant="small">
      {doneRegistration ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            console.log(password, reEnterPassword);
            if (password !== reEnterPassword) {
              setError("Passwords need to be same");
              setTimeout(() => {
                setError("");
              }, 3000);
            } else {
              const response = await addPassword({
                variables: { password },
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.addOrUpdatePassword.user,
                    },
                  });
                  cache.evict({ fieldName: "feeds" });
                },
              });
              if (response.data?.addOrUpdatePassword.success) {
                setDoneAddPassword(true);
              } else {
                setError(response.data!.addOrUpdatePassword.message);
              }
            }
          }}
        >
          <FormControl>
            <FormLabel htmlFor="password">{"Password"}</FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel htmlFor="reEnterPassword">
              {"Re-Enter Password"}
            </FormLabel>
            <Input
              name="reEnterPassword"
              type="password"
              placeholder="Re-Enter Password"
              value={reEnterPassword}
              onChange={(e) => setReEnterPassword(e.target.value)}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
          {error && (
            <Box
              style={{
                color: "red",
              }}
            >
              {error}
            </Box>
          )}

          <Button type="submit" colorScheme="teal" mt={4}>
            Create Password
          </Button>
        </form>
      ) : (
        <Fragment>
          <Formik
            initialValues={{ username: "", password: "", email: "" }}
            onSubmit={async (values, errors) => {
              // const response = await register(values);
              const response = await register({
                variables: values,
                update: (cache, { data }) => {
                  cache.writeQuery<MeQuery>({
                    query: MeDocument,
                    data: {
                      __typename: "Query",
                      me: data?.registerUser.user,
                    },
                  });
                  cache.evict({ fieldName: "feeds" });
                },
              });
              handleAuthAndError(errors, router, response.data?.registerUser);
            }}
          >
            {({ isSubmitting }) => (
              <Form>
                <h1
                  style={{
                    margin: "2rem 0",
                    textAlign: "center",
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  Register
                </h1>
                <InputField name="username" type="text" label="Username" />
                <Box mt={4}>
                  <InputField name="email" type="email" label="Email" />
                </Box>
                <Box mt={4}>
                  <InputField
                    name="password"
                    type="password"
                    label="Password"
                  />
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
                  Register
                </Button>
                <Box mt={2} textAlign="center">
                  Already have account ?{" "}
                  <NextLink href="/auth/login">
                    <Link fontWeight="bold"> Login</Link>
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
                    const responseData = await registerWithGithub({
                      variables: { code: response.code },
                    });
                    if (responseData.data?.registerWithGithub.user) {
                      setDoneRegistration(true);
                    }
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
                      marginLeft: "175px",
                    }}
                  />{" "}
                </GitHubLogin>
              </Form>
            )}
          </Formik>
        </Fragment>
      )}
    </Wrapper>
  );
};

// export default withUrqlClient(createUrqlClient, { ssr: false })(Register);
export default withApolloClient({ ssr: false })(Register);
