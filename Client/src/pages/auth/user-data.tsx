import {
  Box,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  Button,
  Checkbox,
  Flex,
  FormControl,
  FormLabel,
  Input,
  Radio,
  RadioGroup,
  Stack,
} from "@chakra-ui/react";
import { Form, Formik } from "formik";
import { useRouter } from "next/router";
import React, { FC, useEffect, useRef, useState } from "react";
import Flairs from "../../components/Flairs";
import InputField from "../../components/InputField";
import PlaceSuggestion from "../../components/PlaceSuggestion";
import Wrapper from "../../components/Wrapper";
import {
  useAddMoreDetailMutation,
  useMeQuery,
  usePlaceSearchAutoCorrectMutation,
} from "../../generated/apollo-graphql";
import { arrayToObject } from "../../utils";
import {
  getCheckboxValue,
  getCheckboxBoolean,
} from "../../utils/getCheckBoxValues";
import { updateUserDataInCache } from "../../utils/updateUserDataInCache";
import { withApolloClient } from "../../utils/withApollo";

interface UserDataProps {}

const UserData: FC<UserDataProps> = ({}) => {
  const router = useRouter();
  const [addMoreDetail] = useAddMoreDetailMutation();
  const [showMeArray, setShowMeArray] = useState([false, false, false, false]);
  const [lookingForArray, setLookingForArray] = useState([
    false,
    false,
    false,
    false,
  ]);
  const [genderError, setGenderError] = useState("");
  const [flairError, setFlairError] = useState("");
  const [ageError, setAgeError] = useState("");
  const [addressError, setAddressError] = useState("");
  const [address, setAddress] = useState("");
  const addressRef = useRef<HTMLInputElement | undefined>();
  const { data } = useMeQuery();
  const [placeSearch] = usePlaceSearchAutoCorrectMutation();
  const [places, setPlaces] = useState<string[]>([]);

  useEffect(() => {
    if (data?.me) {
      setShowMeArray(getCheckboxBoolean(data.me.showMe as string, "showMe"));
      setLookingForArray(
        getCheckboxBoolean(data.me.lookingFor as string, "lookingFor")
      );
    }
  }, [data?.me]);

  useEffect(() => {
    const timeout = setTimeout(async () => {
      if (!address) {
        setPlaces([]);
      }
      if (address === addressRef.current?.value && address !== "") {
        try {
          console.log(address);
          const response = await placeSearch({
            variables: {
              keyword: address,
            },
          });
          if (!(response.data?.placeSearchAutoCorrect.status === "error")) {
            setPlaces(response.data?.placeSearchAutoCorrect.predictions || []);
          }
        } catch (error) {
          console.log(error.message);
        }
      }
    }, 500);
    return () => {
      clearTimeout(timeout);
    };
  }, [address]);

  return (
    <Formik
      initialValues={{
        bio: data?.me ? data.me.bio : "",
        flair: data?.me ? (data.me.flair as string) : "",
        gender: data?.me ? data.me.gender : "",
        maxAge: data?.me ? data.me.maxAge : 30,
        minAge: data?.me ? data.me.minAge : 18,
        showMe: "all",
        birthDate: data?.me ? data.me.birthDate : "",
        lookingFor: "all",
      }}
      onSubmit={async (values, { setErrors }) => {
        if (+(values!.minAge as any) > +(values!.maxAge as any)) {
          setAgeError("Please provide valid age range");
          setTimeout(() => {
            setAgeError("");
          }, 5000);
          return;
        }
        const showMeValue = getCheckboxValue(showMeArray, "showMe");
        const lookingForValue = getCheckboxValue(lookingForArray, "lookingFor");
        const response = await addMoreDetail({
          variables: {
            ...values,
            showMe: showMeValue,
            lookingFor: lookingForValue,
            address,
          },
          update: (cache, { data }) =>
            updateUserDataInCache(cache, data?.addMoreDetail),
        });
        if (response.data?.addMoreDetail.success) {
          router.replace("/");
          return;
        }
        if (response.data?.addMoreDetail.errors) {
          setErrors(arrayToObject(response.data.addMoreDetail.errors));
          const gender = response.data.addMoreDetail.errors.find(
            (error) => error.field === "gender"
          );
          if (gender) {
            setGenderError(gender.message);
          }
          const flair = response.data.addMoreDetail.errors.find(
            (error) => error.field === "flair"
          );
          if (flair) {
            setFlairError(flair.message);
          }

          const addressErr = response.data.addMoreDetail.errors.find(
            (error) => error.field === "address"
          );
          if (flair) {
            setAddressError(addressErr!.message);
          }
        }
      }}
    >
      {({ isSubmitting, setFieldValue, values }) => (
        <Wrapper variant="small">
          <Breadcrumb color="white">
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Home</BreadcrumbLink>
            </BreadcrumbItem>

            <BreadcrumbItem>
              <BreadcrumbLink href="#">Detail</BreadcrumbLink>
            </BreadcrumbItem>
          </Breadcrumb>
          <h1
            style={{
              marginBottom: "1rem",
              textAlign: "center",
              fontSize: "2rem",
              fontWeight: "bold",
              color: "var(--text-primary)",
            }}
          >
            {data?.me ? "Edit" : "Add"} Detail
          </h1>
          <Form>
            <InputField name="bio" type="text" label="Bio" isTextArea />
            { !router.query.edit && <FormControl mt={4} position="relative">
              <FormLabel fontSize="1.2rem" color="white" htmlFor="address">
                {"Address"}
              </FormLabel>
              <Input
                ref={addressRef as any}
                name="address"
                type="text"
                placeholder="Address"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                style={{
                  background: "white",
                }}
                _placeholder={{ fontWeight: 500 }}
              />
              {places.length > 0 && (
                <Box
                  style={{
                    position: "absolute",
                    background: "white",
                    zIndex: 100,
                    width: "100%",
                    borderRadius: "0 0 10px 10px",
                  }}
                >
                  <PlaceSuggestion
                    places={places}
                    onClick={(address) => {
                      setAddress(address);
                      setPlaces([]);
                    }}
                  />
                </Box>
              )}
              {addressError && (
                <p
                  style={{
                    color: "#FC8181",
                  }}
                >
                  {addressError}
                </p>
              )}{" "}
            </FormControl>}
            <Box mt={6}>
              <Flairs
                value={values.flair as string}
                onChange={(value) => setFieldValue("flair", value)}
              />
              {flairError && !values.flair && (
                <p
                  style={{
                    color: "#FC8181",
                  }}
                >
                  {flairError}
                </p>
              )}
            </Box>
            <RadioGroup
              onChange={(nextValue) => setFieldValue("gender", nextValue)}
              value={values.gender as string}
              mt={6}
            >
              <FormLabel fontSize="1.2rem" color="var(--white-color)">
                How do you like to be called?
              </FormLabel>
              <Stack direction="row" color="white">
                <Radio value="male">He/Him</Radio>
                <Radio value="female">She/Her</Radio>
                <Radio value="none">Non binary</Radio>
              </Stack>
              {genderError && !values.gender && (
                <p
                  style={{
                    color: "#FC8181",
                  }}
                >
                  {genderError}
                </p>
              )}
            </RadioGroup>
            <Box mt={4}>
              <FormLabel fontSize="1.2rem" color="var(--white-color)">
                Show Me
              </FormLabel>
              <Flex color="white">
                <Checkbox
                  mx={1}
                  isChecked={showMeArray[0]}
                  onChange={(e) =>
                    setShowMeArray([
                      e.target.checked,
                      showMeArray[1],
                      showMeArray[2],
                      showMeArray[3],
                    ])
                  }
                >
                  Male
                </Checkbox>
                <Checkbox
                  mx={1}
                  isChecked={showMeArray[1]}
                  onChange={(e) =>
                    setShowMeArray([
                      showMeArray[0],
                      e.target.checked,
                      showMeArray[2],
                      showMeArray[3],
                    ])
                  }
                >
                  Female
                </Checkbox>
                <Checkbox
                  mx={1}
                  isChecked={showMeArray[2]}
                  onChange={(e) =>
                    setShowMeArray([
                      showMeArray[0],
                      showMeArray[1],
                      e.target.checked,
                      showMeArray[3],
                    ])
                  }
                >
                  Non Binary
                </Checkbox>
                <Checkbox
                  mx={1}
                  isChecked={showMeArray[3]}
                  onChange={(e) =>
                    setShowMeArray([
                      showMeArray[0],
                      showMeArray[1],
                      showMeArray[2],
                      e.target.checked,
                    ])
                  }
                >
                  All
                </Checkbox>
              </Flex>
            </Box>
            <Box mt={6}>
              <FormLabel fontSize="1.2rem" color="var(--white-color)">
                Looking For
              </FormLabel>
              <Flex color="white">
                <Checkbox
                  mx={1}
                  isChecked={lookingForArray[0]}
                  onChange={(e) =>
                    setLookingForArray([
                      e.target.checked,
                      lookingForArray[1],
                      lookingForArray[2],
                      lookingForArray[3],
                    ])
                  }
                >
                  Love
                </Checkbox>
                <Checkbox
                  mx={1}
                  isChecked={lookingForArray[1]}
                  onChange={(e) =>
                    setLookingForArray([
                      lookingForArray[0],
                      e.target.checked,
                      lookingForArray[2],
                      lookingForArray[3],
                    ])
                  }
                >
                  Friend
                </Checkbox>
                <Checkbox
                  mx={1}
                  isChecked={lookingForArray[2]}
                  onChange={(e) =>
                    setLookingForArray([
                      lookingForArray[0],
                      lookingForArray[1],
                      e.target.checked,
                      lookingForArray[3],
                    ])
                  }
                >
                  Project Buddy
                </Checkbox>
                <Checkbox
                  mx={1}
                  isChecked={lookingForArray[3]}
                  onChange={(e) =>
                    setLookingForArray([
                      lookingForArray[0],
                      lookingForArray[1],
                      lookingForArray[2],
                      e.target.checked,
                    ])
                  }
                >
                  All
                </Checkbox>
              </Flex>
            </Box>
            <Box></Box>
            <Box mt={6} position="relative">
              <FormLabel fontSize="1.2rem" color="var(--white-color)">
                Age Range
              </FormLabel>
              <Flex>
                <Box mr={4} width="100px">
                  <InputField
                    name="minAge"
                    type="number"
                    placeholder="Min Age"
                  />
                </Box>
                <Box mr={4} width="100px">
                  <InputField
                    name="maxAge"
                    type="number"
                    placeholder="Max Age"
                  />
                </Box>
              </Flex>
              {ageError && (
                <p
                  style={{
                    color: "#FC8181",
                  }}
                >
                  {ageError}
                </p>
              )}
            </Box>
            <Box mt={6}>
              <InputField
                name="birthDate"
                type="text"
                label="Birth Date"
                placeholder="DD/MM/YYYY or DD-MM-YYYY or DD.MM.YYYY"
              />
            </Box>
            <Button
              isLoading={isSubmitting}
              mt={4}
              mb={16}
              style={{
                background: "var(--background-primary)",
                color: "var(--text-primary)",
                boxShadow: "0 10px 30px rgba(0, 0, 255, 0.3)",
              }}
              type="submit"
              width="100%"
            >
              {data?.me ? "Edit" : "Add"} UserData
            </Button>
          </Form>
        </Wrapper>
      )}
    </Formik>
  );
};

export default withApolloClient({ ssr: false })(UserData);
