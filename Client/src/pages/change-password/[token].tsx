import { Box, Button, Link } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { NextPage } from "next";
import { useRouter } from "next/router";
import React, { FC, useState } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import { useChangePasswordMutation } from "../../generated/graphql";
import { arrayToObject } from "../../utils";
import NavLink from "next/link";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../../utils/createUrqlClient";

const ChangePassword: FC = () => {
  const [, changePassword] = useChangePasswordMutation();
  const router = useRouter();
  const [tokenError, setTokenError] = useState("");

  return (
    <Formik
      initialValues={{ newPassword: "" }}
      onSubmit={async (values, { setErrors }) => {
        const response = await changePassword({
          token:
            typeof router.query.token === "string" ? router.query.token : "",
          newPassword: values.newPassword,
        });
        if (response.data?.changePassword?.errors) {
          const errorMap = arrayToObject(response.data.changePassword.errors);
          if ("token" in errorMap) {
            setTokenError(errorMap.token);
          }
          setErrors(errorMap);
        } else if (response.data?.changePassword?.user) {
          router.push("/");
        }
      }}
    >
      {({ isSubmitting }) => (
        <Wrapper>
          <Form>
            <InputField
              name="newPassword"
              type="password"
              label="New Password"
              required
            />
            {tokenError && (
              <Box
                style={{
                  color: "red",
                }}
              >
                {tokenError},{" "}
                <NavLink href="/forget-password">
                  <Link color="black">Click here to get new one</Link>
                </NavLink>
              </Box>
            )}
            <Button
              isLoading={isSubmitting}
              mt={4}
              colorScheme="teal"
              type="submit"
            >
              Change Password
            </Button>
          </Form>
        </Wrapper>
      )}
    </Formik>
  );
};

// ChangePassword.getInitialProps = ({ query }) => {
//   return {
//     token: query.token as string,
//   };
// };

// export default ChangePassword;
export default withUrqlClient(createUrqlClient, { ssr: false })(ChangePassword);
