import {
  Box,
  Button,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Fade,
  Flex,
  ScaleFade,
  useToast,
} from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React, { FC, Fragment, useRef, useState } from "react";
import InputField from "./InputField";
import Wrapper from "./Wrapper";
import { useCreateFeedMutation } from "../generated/apollo-graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { arrayToObject, isServer } from "../utils/index";
import Dropzone from "react-dropzone";
import { VscNewFile } from "react-icons/vsc";
import { FaTimes } from "react-icons/fa";
import SwapButtons from "./SwapButtons";
import LanguageSelect from "./LanguageSelect";
import ThemeSelect from "./ThemeSelect";
const Editor = React.lazy(() => import("./CodeEditor"));

interface CreateFeedProps {
  open: boolean;
  onClose: () => void;
}

const CreateFeed: FC<CreateFeedProps> = ({ open, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);
  const [wantToAdd, setWantToAdd] = useState("editor");
  const [imageSrc, setImageSrc] = useState<any>();
  const [file, setFile] = useState<any>();
  const [language, setLanguage] = useState<string>("javascript");
  const [theme, setTheme] = useState<string>("material");
  const imageRef = useRef<HTMLImageElement>();

  const [createFeed, { loading }] = useCreateFeedMutation();
  const toast = useToast();
  useIsAuth();

  return (
    <Drawer isOpen={open} onClose={onClose} placement="right" size="md">
      <DrawerOverlay
        style={{
          backdropFilter: "blur(2px)",
        }}
      >
        <DrawerContent>
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white" textAlign="center">
            Add new feed
          </DrawerHeader>
          <DrawerBody>
            <Formik
              initialValues={{
                title: "",
                code: "",
                projectIdea: "",
              }}
              onSubmit={async (values, { setErrors, setFieldValue }) => {
                try {
                  const response = await createFeed({
                    variables: {
                      ...values,
                      type: "showcase",
                      file,
                      language,
                      theme,
                    },
                    update: (cache, { data }) => {
                      if (data?.createFeed.feed) {
                        cache.evict({ fieldName: "feeds" }); //evict is same as invalidate
                      }
                    },
                  });
                  if (response.data?.createFeed.feed) {
                    setFile(null);
                    setImageSrc(null);
                    setFieldValue("title", "");
                    setFieldValue("projectIdea", "");
                    setFieldValue("code", "");
                    onClose();
                    toast({
                      title: "Success",
                      description: "Feed has been created successfully",
                      status: "success",
                      duration: 5000,
                      isClosable: true,
                    });
                    return;
                  }
                  if (response.data?.createFeed.errors) {
                    setErrors(arrayToObject(response.data.createFeed.errors));
                  }
                } catch (error) {
                  console.log(error.message);
                }
              }}
            >
              {({ setFieldValue, values }) => (
                <Wrapper variant="small">
                  <Form>
                    <InputField name="title" type="text" label="Title" />
                    <Box mt={4}>
                      <h1
                        style={{
                          fontWeight: 500,
                          color: "var(--white-color)",
                        }}
                      >
                        Want to add
                      </h1>
                      <Flex justifyContent="space-around" my={4}>
                        <SwapButtons
                          addTitle="editor"
                          title="Code Snippet"
                          wantToAdd={wantToAdd}
                          setWantToAdd={() => setWantToAdd("editor")}
                          resetOthers={() => {
                            setFieldValue("projectIdea", "");
                            setFile(null);
                            setImageSrc(null);
                          }}
                        />
                        <SwapButtons
                          addTitle="image"
                          title="Image"
                          wantToAdd={wantToAdd}
                          setWantToAdd={() => setWantToAdd("image")}
                          resetOthers={() => {
                            setFieldValue("code", "");
                            setFieldValue("projectIdea", "");
                          }}
                        />
                        <SwapButtons
                          addTitle="project"
                          title="Project Idea"
                          wantToAdd={wantToAdd}
                          setWantToAdd={() => setWantToAdd("project")}
                          resetOthers={() => {
                            setFile(null);
                            setImageSrc(null);
                            setFieldValue("code", "");
                          }}
                        />
                      </Flex>
                    </Box>

                    {!isServer() && (
                      <React.Suspense fallback={<Fragment></Fragment>}>
                        {wantToAdd.toLowerCase() === "editor" && (
                          <ScaleFade in={wantToAdd.toLowerCase() === "editor"}>
                            <Flex my={4} justifyContent="space-between">
                              <LanguageSelect
                                onChange={(value) => setLanguage(value)}
                                value={language}
                              />
                              <ThemeSelect
                                onChange={(value) => setTheme(value)}
                                value={theme}
                              />
                            </Flex>
                            <Box
                              style={{
                                borderRadius: "1rem",
                                overflow: "hidden",
                              }}
                            >
                              <Editor
                                onChange={(text: string) =>
                                  setFieldValue("code", text)
                                }
                                value={values.code}
                                language={language}
                                theme={theme}
                              />
                            </Box>
                          </ScaleFade>
                        )}
                      </React.Suspense>
                    )}

                    {wantToAdd.toLowerCase() === "image" && (
                      <ScaleFade in={wantToAdd.toLowerCase() === "image"}>
                        <Dropzone
                          onDrop={async (acceptedFiles) => {
                            const file = acceptedFiles[0];
                            const reader = new FileReader();
                            const url = reader.readAsDataURL(file);

                            reader.onloadend = () => {
                              setImageSrc([reader.result]);
                              setFile(file);
                            };
                          }}
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section>
                              <div
                                {...getRootProps()}
                                style={{
                                  height: "300px",
                                  border: "1px dashed var(--text-primary)",
                                  borderRadius: "1rem",
                                  display: "flex",
                                  justifyContent: "center",
                                  alignItems: "center",
                                  outline: "none",
                                  flexDirection: "column",
                                  cursor: "pointer",
                                  overflow: "hidden",
                                  position: "relative",
                                }}
                              >
                                {imageSrc ? (
                                  <Fade in={!!imageSrc}>
                                    <div
                                      style={{
                                        position: "absolute",
                                        padding: "10px",
                                        background: "rgba(255, 255, 255, 0.5)",
                                        top: "10px",
                                        right: "10px",
                                        borderRadius: "50%",
                                      }}
                                      onClick={() => {
                                        setImageSrc(null);
                                        setFile(null);
                                      }}
                                    >
                                      <FaTimes
                                        size={30}
                                        height="10px"
                                        width="10px"
                                      />
                                    </div>
                                    <img
                                      style={{
                                        objectFit: "cover",
                                      }}
                                      ref={imageRef as any}
                                      src={imageSrc}
                                      alt="selected File"
                                    />
                                  </Fade>
                                ) : (
                                  <Fade
                                    in={!imageSrc}
                                    style={{
                                      display: "flex",
                                      flexDirection: "column",
                                      alignItems: "center",
                                    }}
                                  >
                                    <VscNewFile
                                      size={30}
                                      color="var(--text-primary)"
                                    />
                                    <input
                                      {...getInputProps()}
                                      accept="image/*"
                                    />
                                    <p
                                      style={{
                                        textAlign: "center",
                                        color: "var(--text-primary)",
                                      }}
                                    >
                                      Drag 'n' drop coding meme or some amazing
                                      programming photo here, or click to select
                                      one
                                    </p>
                                  </Fade>
                                )}
                              </div>
                            </section>
                          )}
                        </Dropzone>
                      </ScaleFade>
                    )}
                    {wantToAdd.toLowerCase() === "project" && (
                      <ScaleFade in={wantToAdd.toLowerCase() === "project"}>
                        <Box>
                          <InputField
                            name="projectIdea"
                            type="text"
                            placeholder="Project Idea"
                            autoFocus={true}
                            isTextArea
                          />
                        </Box>
                      </ScaleFade>
                    )}
                    <Button
                      my={10}
                      style={{
                        background: "var(--background-secondary)",
                        color: "var(--text-primary)",
                      }}
                      type="submit"
                      width="100%"
                      isLoading={loading || isLoading}
                    >
                      Create Feed
                    </Button>
                  </Form>
                </Wrapper>
              )}
            </Formik>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default CreateFeed;
