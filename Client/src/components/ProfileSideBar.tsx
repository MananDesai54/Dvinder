import {
  Avatar,
  Box,
  Button,
  Divider,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
  Image,
  Tab,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Text,
  Wrap,
  WrapItem,
} from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, Fragment, useEffect, useState } from "react";
import { FaCodeBranch, FaEdit, FaGithub, FaStar } from "react-icons/fa";
import { useMeQuery, useUserFeedsQuery } from "../generated/apollo-graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { getAge } from "../utils/getUserAge";

interface ProfileSideBarProps {
  open: boolean;
  onClose: () => void;
}

const ProfileSideBar: FC<ProfileSideBarProps> = ({ open, onClose }) => {
  const [repos, setRepos] = useState([]);
  const { data } = useMeQuery();
  const { data: feeds } = useUserFeedsQuery();
  const router = useRouter();

  useEffect(() => {
    if (open && data?.me && data.me.githubId) {
      fetch(`https://api.github.com/users/${data.me.username}/repos`)
        .then((res) => res.json())
        .then((data) => {
          const sorted = data
            .sort((a: any, b: any) => b.stargazers_count - a.stargazers_count)
            .slice(0, 6);
          setRepos(sorted);
        })
        .catch((error) => console.log(error.message));
    }
  }, [data?.me, open]);

  const getUserAge = () => {
    let array: any;
    if (data?.me?.birthDate?.includes("/")) {
      array = data?.me?.birthDate?.split("/");
    } else if (data?.me?.birthDate?.includes("-")) {
      array = data?.me?.birthDate?.split("-");
    } else if (data?.me?.birthDate?.includes(".")) {
      array = data?.me?.birthDate?.split(".");
    }
    return getAge(new Date(array[2], array[1], array[0]));
  };

  useIsAuth();

  return (
    <Drawer isOpen={open} onClose={onClose} placement="left" size="md">
      <DrawerOverlay
        style={{
          backdropFilter: "blur(2px)",
        }}
      >
        <DrawerContent>
          <DrawerCloseButton color="white" />
          <DrawerHeader color="white" textAlign="center">
            {data?.me?.username.toUpperCase()}
          </DrawerHeader>
          <DrawerBody>
            <Flex flexDirection="column" alignItems="center">
              <Box position="relative">
                <Avatar
                  name={data?.me?.username}
                  src={data?.me?.profileUrl}
                  size="2xl"
                />
                <Box
                  position="absolute"
                  bottom="2px"
                  right="2px"
                  borderRadius="50%"
                  border="2px solid white"
                  bg="#222"
                  padding="3px"
                >
                  <Image
                    src={`https://img.icons8.com/color/24/000000/${data?.me?.flair}`}
                    alt={data?.me?.flair || "Image"}
                  />
                </Box>
              </Box>
              <Flex
                style={{
                  color: "var(--text-primary)",
                }}
                alignItems="center"
              >
                <span>
                  {data?.me?.username.toUpperCase()},{" "}
                  {data?.me?.birthDate && getUserAge()}
                </span>
              </Flex>
              <p
                style={{
                  color: "var(--white-color)",
                  fontSize: "1.2rem",
                  margin: "1rem 0 0",
                }}
              >
                {data?.me?.bio}
              </p>
              <Divider
                my={4}
                style={{
                  borderColor: "rgba(255, 255, 255, 0.2)",
                }}
              />
              <Tabs
                isFitted
                variant="soft-rounded"
                width="100%"
                colorScheme="facebook"
              >
                <TabList>
                  <Tab color="rgba(255, 255, 255, 0.5)">Profile</Tab>
                  <Tab color="rgba(255, 255, 255, 0.5)">Feeds</Tab>
                  <Tab color="rgba(255, 255, 255, 0.5)">Matches</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Box position="relative">
                      <Box mt="0.8rem" color="white">
                        <p
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          Email
                        </p>
                        <p
                          style={{
                            fontSize: "1.1rem",
                            borderBottom: "1px solid gray",
                          }}
                        >
                          {data?.me?.email}
                        </p>
                      </Box>
                      <Box mt="0.8rem" color="white">
                        <p
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          BirthDate
                        </p>
                        <p
                          style={{
                            fontSize: "1.1rem",
                            borderBottom: "1px solid gray",
                          }}
                        >
                          {data?.me?.birthDate}
                        </p>
                      </Box>
                      <Box mt="0.8rem" color="white">
                        <p
                          style={{
                            fontSize: "0.8rem",
                            fontWeight: "bold",
                            color: "rgba(255, 255, 255, 0.5)",
                          }}
                        >
                          Gender
                        </p>
                        <p
                          style={{
                            fontSize: "1.1rem",
                            borderBottom: "1px solid gray",
                          }}
                        >
                          {data?.me?.gender}
                        </p>
                      </Box>
                      <FaEdit
                        size={30}
                        style={{
                          position: "absolute",
                          right: 0,
                          top: "-1rem",
                          color: "white",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          router.push("/auth/user-data?edit=true");
                        }}
                      />
                    </Box>

                    {repos.length > 0 && (
                      <Fragment>
                        <p
                          style={{
                            color: "var(--white-color)",
                            fontSize: "1.2rem",
                            margin: "2rem 0 0",
                            display: "flex",
                          }}
                        >
                          <FaGithub size={30} />{" "}
                          <span style={{ marginLeft: "0.5rem" }}>
                            Popular Repos
                          </span>
                        </p>
                        <Wrap mt={4}>
                          {repos.map((repo: any, index) => (
                            <WrapItem key={index} w="100%" mt={2}>
                              <Box
                                bg="white"
                                style={{
                                  padding: "0.5rem",
                                  color: "#222",
                                  borderRadius: "0.5rem",
                                  width: "100%",
                                  position: "relative",
                                }}
                              >
                                <Flex position="absolute" right="10px">
                                  <Flex mx={1} alignItems="center">
                                    <FaStar size={18} />{" "}
                                    <span>{repo.stargazers_count}</span>
                                  </Flex>
                                  <Flex mx={1} alignItems="center">
                                    <FaCodeBranch size={18} />{" "}
                                    <span>{repo.forks_count}</span>
                                  </Flex>
                                </Flex>
                                <Link href={repo.html_url}>
                                  <a
                                    style={{
                                      color: "var(--background-secondary)",
                                      fontSize: "1.1rem",
                                      fontWeight: 600,
                                    }}
                                  >
                                    {repo.name}
                                  </a>
                                </Link>
                                <Text noOfLines={1}>{repo.description}</Text>
                              </Box>
                            </WrapItem>
                          ))}
                        </Wrap>
                      </Fragment>
                    )}
                    <Flex mt={8} justifyContent="flex-end">
                      <Button colorScheme="facebook">Logout</Button>
                      <Button colorScheme="red">Delete Account</Button>
                    </Flex>
                  </TabPanel>
                  <TabPanel>
                    <p>Feeds</p>
                  </TabPanel>
                  <TabPanel>
                    <p>Matches</p>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default ProfileSideBar;
