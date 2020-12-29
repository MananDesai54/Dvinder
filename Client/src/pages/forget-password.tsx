import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import router from "next/dist/next-server/lib/router/router";
import React, { FC, Fragment, useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useForgetPasswordMutation } from "../generated/graphql";

const ForgetPassword: FC<{}> = ({}) => {
  const [, forgetPassword] = useForgetPasswordMutation();
  const [message, setMessage] = useState("");

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={async (values) => {
        const response = await forgetPassword(values);
        if (response.data?.forgetPassword) {
          setMessage(
            "Check email with reset password link, if not received then use correct email"
          );
        }
      }}
    >
      {({ values }) => (
        <Wrapper>
          {message ? (
            <Box style={{ color: "green" }}>{message}</Box>
          ) : (
            <Fragment>
              <Form>
                <InputField name="email" type="email" label="Email" required />
                <Button
                  mt={4}
                  colorScheme="teal"
                  type="submit"
                  disabled={!values.email}
                >
                  Reset Password
                </Button>
              </Form>
            </Fragment>
          )}
        </Wrapper>
      )}
    </Formik>
  );
};

export default ForgetPassword;
