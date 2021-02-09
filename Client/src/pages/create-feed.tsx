import { Box, Button, Fade, Flex, ScaleFade } from "@chakra-ui/react";
import { Formik, Form } from "formik";
import { useRouter } from "next/router";
import React, { FC, Fragment, useState } from "react";
import InputField from "../components/InputField";
import Layout from "../components/Layout";
import Wrapper from "../components/Wrapper";
import { useCreateFeedMutation } from "../generated/apollo-graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { withApolloClient } from "../utils/withApollo";
import { arrayToObject, isServer } from "../utils/index";
import Dropzone from "react-dropzone";
import { VscNewFile } from "react-icons/vsc";
import { FaTimes } from "react-icons/fa";
const Editor = React.lazy(() => import("../components/CodeEditor"));
// import { useCreateFeedMutation } from "../generated/graphql";
// import { withUrqlClient } from "next-urql";
// import { createUrqlClient } from "../utils/createUrqlClient";

interface CreateFeedProps {}

const CreateFeed: FC<CreateFeedProps> = ({}) => {
  // const [, createFeed] = useCreateFeedMutation();
  const [wantToAdd, setWantToAdd] = useState("editor");
  const [imageSrc, setImageSrc] = useState<any>();
  const [createFeed, { loading }] = useCreateFeedMutation();
  const router = useRouter();

  useIsAuth();

  return (
    <Formik
      // username included for matching types for handleAuthAndError
      initialValues={{
        title: "",
        code: "",
        projectIdea: "",
        theme: "material",
        language: "xml",
      }}
      onSubmit={async (values, { setErrors }) => {
        console.log(values);
        // const response = await createFeed({ ...values, type: "showcase" });
        const response = await createFeed({
          variables: { ...values, type: "showcase" },
          update: (cache) => {
            cache.evict({ fieldName: "feeds" }); //evict is same as invalidate
          },
        });
        console.log(response);
        if (response.data?.createFeed.feed) {
          router.push("/");
        }
        if (response.data?.createFeed.errors) {
          setErrors(arrayToObject(response.data.createFeed.errors));
        }
      }}
    >
      {({ setFieldValue, values }) => (
        <Layout>
          <Wrapper variant="small">
            <Form>
              <InputField name="title" type="text" label="Title" />
              <Box mt={4}>
                <h1
                  style={{
                    fontWeight: 500,
                  }}
                >
                  Want to add
                </h1>
                <Flex justifyContent="space-around" my={4}>
                  <Button
                    style={{
                      background:
                        wantToAdd.toLowerCase() === "editor"
                          ? "var(--background-secondary)"
                          : "var(--background-tertiary)",
                      color:
                        wantToAdd.toLowerCase() === "editor"
                          ? "white"
                          : "black",
                    }}
                    onClick={() => setWantToAdd("editor")}
                  >
                    Code Snippet
                  </Button>
                  <Button
                    style={{
                      background:
                        wantToAdd.toLowerCase() === "image"
                          ? "var(--background-secondary)"
                          : "var(--background-tertiary)",
                      color:
                        wantToAdd.toLowerCase() === "image" ? "white" : "black",
                    }}
                    onClick={() => setWantToAdd("image")}
                  >
                    Image
                  </Button>
                  <Button
                    style={{
                      background:
                        wantToAdd.toLowerCase() === "project"
                          ? "var(--background-secondary)"
                          : "var(--background-tertiary)",
                      color:
                        wantToAdd.toLowerCase() === "project"
                          ? "white"
                          : "black",
                    }}
                    onClick={() => setWantToAdd("project")}
                  >
                    Project Idea
                  </Button>
                </Flex>
              </Box>

              {!isServer() && (
                <React.Suspense fallback={<Fragment></Fragment>}>
                  {wantToAdd.toLowerCase() === "editor" && (
                    <ScaleFade
                      in={wantToAdd.toLowerCase() === "editor"}
                      style={{
                        borderRadius: "1rem",
                        overflow: "hidden",
                        boxShadow: "0 0 30px rgba(0, 0, 0, 0.3)",
                      }}
                    >
                      <Editor
                        onChange={(text: string) => setFieldValue("code", text)}
                        value={values.code}
                      />
                    </ScaleFade>
                  )}
                </React.Suspense>
              )}

              {wantToAdd.toLowerCase() === "image" && (
                <ScaleFade in={wantToAdd.toLowerCase() === "image"}>
                  <Dropzone
                    onDrop={(acceptedFiles) => {
                      const file = acceptedFiles[0];
                      const reader = new FileReader();
                      const url = reader.readAsDataURL(file);

                      reader.onloadend = () => {
                        setImageSrc([reader.result]);
                      };
                    }}
                  >
                    {({ getRootProps, getInputProps }) => (
                      <section>
                        <div
                          {...getRootProps()}
                          style={{
                            height: "200px",
                            border: "1px dashed",
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
                                }}
                              >
                                <FaTimes size={30} height="10px" width="10px" />
                              </div>
                              <img
                                width="100%"
                                height="100%"
                                style={{
                                  objectFit: "cover",
                                }}
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
                              <VscNewFile size={30} />
                              <input {...getInputProps()} accept="image/*" />
                              <p>
                                Drag 'n' drop file here, or click to select
                                files
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
                    />
                  </Box>
                </ScaleFade>
              )}
              <Button
                my={10}
                style={{
                  background: "var(--background-primary)",
                  color: "var(--text-primary)",
                  boxShadow: "0 10px 30px rgba(0, 0, 255, 0.3)",
                }}
                type="submit"
                width="100%"
                isLoading={loading}
              >
                Create Feed
              </Button>
            </Form>
          </Wrapper>
        </Layout>
      )}
    </Formik>
  );
};

// export default withUrqlClient(createUrqlClient, { ssr: false })(CreateFeed);
export default withApolloClient({ ssr: false })(CreateFeed);
