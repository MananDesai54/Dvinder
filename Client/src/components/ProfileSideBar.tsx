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
import { FaCodeBranch, FaGithub, FaStar } from "react-icons/fa";
import {
  useMeQuery,
  useUserFeedsQuery,
  useLogoutMutation,
  MeQuery,
  MeDocument,
} from "../generated/apollo-graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { getAge } from "../utils/getUserAge";
import UserDetail from "./UserDetail";
import UserProfile from "./UserProfile";

interface ProfileSideBarProps {
  open: boolean;
  onClose: () => void;
}

const ProfileSideBar: FC<ProfileSideBarProps> = ({ open, onClose }) => {
  const [repos, setRepos] = useState([]);
  const { data } = useMeQuery();
  const { data: feeds } = useUserFeedsQuery();
  const [logout] = useLogoutMutation();

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
                    <UserProfile data={data} repos={repos} />
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
