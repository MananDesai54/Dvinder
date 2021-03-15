import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  Input,
  Link,
  useToast,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import NextLink from "next/link";
import { useRouter } from "next/router";
import { FC, Fragment, useEffect, useState } from "react";
import GitHubLogin from "react-github-login";
import { FaGithub } from "react-icons/fa";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import {
  useAddOrUpdatePasswordMutation,
  useRegisterMutation,
  useRegisterWithGithubMutation,
} from "../../generated/apollo-graphql";
import { useIsAuth } from "../../hooks/useIsAuth";
import { arrayToObject } from "../../utils";
import { updateUserDataInCache } from "../../utils/updateUserDataInCache";
import { withApolloClient } from "../../utils/withApollo";

interface registerProps {}

const Register: FC<registerProps> = ({}) => {
  const [register] = useRegisterMutation();
  const [registerWithGithub] = useRegisterWithGithubMutation();
  const [addPassword] = useAddOrUpdatePasswordMutation();
  const [doneRegistration, setDoneRegistration] = useState(false);
  const [doneAddPassword, setDoneAddPassword] = useState(false);
  const [password, setPassword] = useState("");
  const [reEnterPassword, setReEnterPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCreatingPassword, setIsCreatingPassword] = useState(false);

  const router = useRouter();
  const isAuth = useIsAuth();
  const toast = useToast();

  useEffect(() => {
    if (isAuth) {
      router.replace("/");
    }
  }, []);

  if (isAuth && doneAddPassword) {
    router.replace("/auth/user-data");
  }

  return (
    <Wrapper variant="small">
      {doneRegistration ? (
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            if (password !== reEnterPassword) {
              setError("Passwords need to be same");
              setTimeout(() => {
                setError("");
              }, 3000);
            } else {
              setIsCreatingPassword(true);
              const response = await addPassword({
                variables: { password },
                update: (cache, { data }) =>
                  updateUserDataInCache(cache, data?.addOrUpdatePassword),
              });
              if (response.data?.addOrUpdatePassword.success) {
                setDoneAddPassword(true);
              } else {
                setError(response.data!.addOrUpdatePassword.message);
              }
              setIsCreatingPassword(false);
            }
          }}
        >
          <h1
            style={{
              margin: "2rem 0",
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "var(--text-primary)",
            }}
          >
            Create Password
          </h1>
          <FormControl>
            <FormLabel color="white" htmlFor="password">
              {"Password"}
            </FormLabel>
            <Input
              name="password"
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              style={{
                background: "white",
              }}
            />
            {error && <FormErrorMessage>{error}</FormErrorMessage>}
          </FormControl>
          <FormControl mt={4}>
            <FormLabel color="white" htmlFor="reEnterPassword">
              {"Re-Enter Password"}
            </FormLabel>
            <Input
              name="reEnterPassword"
              type="password"
              placeholder="Re-Enter Password"
              value={reEnterPassword}
              onChange={(e) => setReEnterPassword(e.target.value)}
              style={{
                background: "white",
              }}
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

          <Button
            isLoading={isCreatingPassword}
            type="submit"
            my={4}
            style={{
              background: "var(--background-primary)",
              color: "var(--text-primary)",
              boxShadow: "0 10px 30px rgba(0, 0, 255, 0.3)",
            }}
            width="100%"
          >
            Create Password
          </Button>
        </form>
      ) : (
        <Fragment>
          <Formik
            initialValues={{ username: "", password: "", email: "" }}
            onSubmit={async (values, { setErrors }) => {
              const response = await register({
                variables: values,
                update: (cache, { data }) =>
                  updateUserDataInCache(cache, data?.registerUser),
              });
              if (response.data?.registerUser.errors) {
                setErrors(arrayToObject(response.data.registerUser.errors));
              } else if (response.data?.registerUser.user) {
                toast({
                  title: "Password created.",
                  description: "Account password has been created.",
                  status: "success",
                  duration: 5000,
                  isClosable: true,
                });
                setDoneAddPassword(true);
              }
            }}
          >
            {({ isSubmitting }) => (
              <Fragment>
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
                    isLoading={isSubmitting || isLoading}
                    mt={10}
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
                  <Box
                    mt={2}
                    textAlign="center"
                    style={{
                      color: "var(--white-color)",
                    }}
                  >
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
                </Form>
                <GitHubLogin
                  clientId={process.env.NEXT_PUBLIC_GITHUB_CLIENT_ID}
                  onSuccess={async (response: any) => {
                    setIsLoading(true);
                    const responseData = await registerWithGithub({
                      variables: { code: response.code },
                      update: (cache, { data }) =>
                        updateUserDataInCache(cache, data?.registerWithGithub),
                    });
                    if (responseData.data?.registerWithGithub.user) {
                      setDoneRegistration(true);
                      if (
                        responseData.data.registerWithGithub.message === "Done"
                      ) {
                        setDoneRegistration(true);
                      }
                    }
                    toast({
                      title: "Account created.",
                      description: "We've created your account for you.",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                    setIsLoading(false);
                  }}
                  onFailure={(response: any) => {
                    console.log(response);
                    toast({
                      title: "Something went wrong",
                      description: "Please try again with github",
                      status: "error",
                      duration: 5000,
                      isClosable: true,
                    });
                    setIsLoading(false);
                  }}
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
              </Fragment>
            )}
          </Formik>
        </Fragment>
      )}
    </Wrapper>
  );
};

export default withApolloClient({ ssr: false })(Register);
