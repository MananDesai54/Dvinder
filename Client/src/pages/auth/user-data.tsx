import {
  Box,
  Button,
  FormLabel,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { FC } from "react";
import InputField from "../../components/InputField";
import Wrapper from "../../components/Wrapper";
import {
  useAddMoreDetailMutation,
  useMeQuery,
} from "../../generated/apollo-graphql";
import { useIsAuth } from "../../hooks/useIsAuth";
import { arrayToObject } from "../../utils";
import { updateUserDataInCache } from "../../utils/updateUserDataInCache";
import { withApolloClient } from "../../utils/withApollo";

interface UserDataProps {}

const UserData: FC<UserDataProps> = ({}) => {
  // useIsAuth();
  const [addMoreDetail] = useAddMoreDetailMutation();
  const router = useRouter();

  const { data } = useMeQuery();

  return (
    <Formik
      initialValues={{
        bio: "",
        flair: "",
        gender: "",
        maxAge: 15,
        minAge: 18,
        showMe: "all",
        birthDate: new Date().toString(),
        lookingFor: "",
      }}
      onSubmit={async (values, { setErrors }) => {
        const response = await addMoreDetail({
          variables: values,
          update: (cache, { data }) =>
            updateUserDataInCache(cache, data?.addMoreDetail),
        });
        console.log(response);
        if (response.data?.addMoreDetail.errors) {
          setErrors(arrayToObject(response.data.addMoreDetail.errors));
        }
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Wrapper variant="small">
          <h1
            style={{
              margin: "1rem 0",
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "var(--text-primary)",
            }}
          >
            Add Detail
          </h1>
          <Form>
            <InputField name="bio" type="text" label="Bio" isTextArea />
            <Box mt={4}>
              <InputField name="flair" type="text" label="Flair" />
            </Box>
            <RadioGroup
              onChange={(nextValue) => setFieldValue("gender", nextValue)}
              value={values.gender}
              mt={4}
            >
              <FormLabel color="var(--white-color)">
                How do you like to be called?
              </FormLabel>
              <Stack direction="row" color="white">
                <Radio value="male">He/Him</Radio>
                <Radio value="female">She/Her</Radio>
                <Radio value="none">Non binary</Radio>
              </Stack>
            </RadioGroup>
            <RadioGroup
              onChange={(nextValue) => setFieldValue("showMe", nextValue)}
              value={values.showMe}
              mt={4}
            >
              <FormLabel color="var(--white-color)">Show Me</FormLabel>
              <Stack direction="row" color="white">
                <Radio value="male">Male</Radio>
                <Radio value="female">Female</Radio>
                <Radio value="none">Non Binary</Radio>
                <Radio value="all">All</Radio>
              </Stack>
            </RadioGroup>
            <RadioGroup
              onChange={(nextValue) => setFieldValue("lookingFor", nextValue)}
              value={values.lookingFor}
              mt={4}
            >
              <FormLabel color="var(--white-color)">Looking For</FormLabel>
              <Stack direction="row" color="white">
                <Radio value="love">Love</Radio>
                <Radio value="friend">Friend</Radio>
                <Radio value="project">Project Buddy</Radio>
              </Stack>
            </RadioGroup>
            <Box mt={4}>
              <InputField name="minAge" type="number" label="Min Age" />
            </Box>
            <Box mt={4}>
              <InputField name="maxAge" type="number" label="Max Age" />
            </Box>
            <Box mt={4}>
              <InputField name="birthDate" type="text" label="Show Me" />
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
              Add UserData
            </Button>
          </Form>
        </Wrapper>
      )}
    </Formik>
  );
};

export default withApolloClient({ ssr: false })(UserData);
