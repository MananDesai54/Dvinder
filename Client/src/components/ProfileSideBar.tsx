import {
  Avatar,
  Box,
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
  Table,
  TableCaption,
  TabList,
  TabPanel,
  TabPanels,
  Tabs,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { useMeQuery, useUserFeedsQuery } from "../generated/apollo-graphql";
import { useIsAuth } from "../hooks/useIsAuth";

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
              <Avatar
                name={data?.me?.username}
                src={data?.me?.profileUrl}
                size="2xl"
              />
              <Flex
                style={{
                  color: "var(--text-primary)",
                }}
                alignItems="center"
              >
                <span>{data?.me?.username.toUpperCase()}, 20</span>
                <Image
                  src={`https://img.icons8.com/color/24/000000/${data?.me?.flair}`}
                  alt={data?.me?.flair || "Image"}
                />
              </Flex>
              <Divider my={4} />
              <Tabs
                isFitted
                variant="soft-rounded"
                width="100%"
                colorScheme="facebook"
              >
                <TabList>
                  <Tab color="rgba(255, 255, 255, 0.5)">Profile</Tab>
                  <Tab color="rgba(255, 255, 255, 0.5)">Matches</Tab>
                  <Tab color="rgba(255, 255, 255, 0.5)">Messages</Tab>
                </TabList>

                <TabPanels>
                  <TabPanel>
                    <Table
                      variant="simple"
                      colorScheme="linkedin"
                      color="white"
                    >
                      <Thead></Thead>
                      <Tbody>
                        <Tr>
                          <Td>Email</Td>
                          <Td textAlign="right"> {data?.me?.email}</Td>
                        </Tr>
                        <Tr>
                          <Td>Bio</Td>
                          <Td textAlign="right">{data?.me?.bio}</Td>
                        </Tr>
                        <Tr>
                          <Td>BirthDate</Td>
                          <Td textAlign="right">{data?.me?.birthDate}</Td>
                        </Tr>
                        <Tr>
                          <Td>Gender</Td>
                          <Td textAlign="right">{data?.me?.gender}</Td>
                        </Tr>
                      </Tbody>
                    </Table>
                    {feeds &&
                      feeds.userFeeds.map(
                        (feed) => feed && <p key={feed.id}>{feed.title}</p>
                      )}
                    {repos.length > 0 &&
                      repos.map((repo: any, index) => (
                        <p key={index}>{repo.name}</p>
                      ))}
                  </TabPanel>
                  <TabPanel>
                    <p>Matches</p>
                  </TabPanel>
                  <TabPanel>
                    <p>Messages</p>
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
