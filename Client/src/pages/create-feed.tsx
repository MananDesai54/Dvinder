import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { withUrqlClient } from "next-urql";
import { useRouter } from "next/router";
import React, { FC, useEffect } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useCreateFeedMutation, useMeQuery } from "../generated/graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { createUrqlClient } from "../utils/createUrqlClient";

interface CreateFeedProps {}

const CreateFeed: FC<CreateFeedProps> = ({}) => {
  const [, createFeed] = useCreateFeedMutation();
  const router = useRouter();

  useIsAuth();

  return (
    <Formik
      // username included for matching types for handleAuthAndError
      initialValues={{ title: "", imageUrl: "" }}
      onSubmit={async (values) => {
        const response = await createFeed({ ...values, type: "showcase" });
        console.log(response);
        if (response.data?.createFeed.feed) {
          router.push("/");
        }
      }}
    >
      {() => (
        <Wrapper variant="small">
          <Form>
            <InputField name="title" type="text" label="Title" />
            <Box mt={4}>
              <InputField name="imageUrl" type="text" label="ImageUrl" />
            </Box>
            <Button mt={4} colorScheme="teal" type="submit">
              Create Feed
            </Button>
          </Form>
        </Wrapper>
      )}
    </Formik>
  );
};

export default withUrqlClient(createUrqlClient, { ssr: false })(CreateFeed);
