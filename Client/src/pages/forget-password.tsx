import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import React, { FC, Fragment, useState } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
// import { useForgetPasswordMutation } from "../generated/graphql";
import { useForgetPasswordMutation } from "../generated/apollo-graphql";
// import { withUrqlClient } from "next-urql";
// import { createUrqlClient } from "../utils/createUrqlClient";
import { withApolloClient } from "../utils/withApollo";

const ForgetPassword: FC<{}> = ({}) => {
  // const [, forgetPassword] = useForgetPasswordMutation();
  const [forgetPassword] = useForgetPasswordMutation();
  const [message, setMessage] = useState("");

  return (
    <Formik
      initialValues={{ email: "" }}
      onSubmit={async (values) => {
        // const response = await forgetPassword(values);
        const response = await forgetPassword({ variables: values });
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

// export default withUrqlClient(createUrqlClient, { ssr: false })(ForgetPassword);
export default withApolloClient({ ssr: false })(ForgetPassword);
