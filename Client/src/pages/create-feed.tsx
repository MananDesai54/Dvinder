import { Box, Button } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React, { FC } from "react";
import InputField from "../components/InputField";
import Wrapper from "../components/Wrapper";
import { useCreateFeedMutation } from "../generated/graphql";

interface CreateFeedProps {}

const CreateFeed: FC<CreateFeedProps> = ({}) => {
  const [, createFeed] = useCreateFeedMutation();
  const router = useRouter();

  return (
    <Formik
      // username included for matching types for handleAuthAndError
      initialValues={{ title: "", imageUrl: "" }}
      onSubmit={async (values, errors) => {
        const response = await createFeed(values);
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

export default CreateFeed;
