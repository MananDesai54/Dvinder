import {
  Avatar,
  Box,
  Drawer,
  DrawerBody,
  DrawerCloseButton,
  DrawerContent,
  DrawerHeader,
  DrawerOverlay,
  Flex,
} from "@chakra-ui/react";
import { useRouter } from "next/router";
import React, { FC, useEffect, useState } from "react";
import { FaJs } from "react-icons/fa";
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
    <Drawer isOpen={open} onClose={onClose} placement="left">
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
              <Box>
                <p
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  {data?.me?.email}
                </p>
                <p
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  Male
                </p>
                <Flex
                  style={{
                    color: "var(--text-primary)",
                  }}
                >
                  <span>JavaScript</span>
                  <FaJs />
                </Flex>
              </Box>
              {feeds &&
                feeds.userFeeds.map(
                  (feed) => feed && <p key={feed.id}>{feed.title}</p>
                )}
              {repos.length > 0 &&
                repos.map((repo: any, index) => <p key={index}>{repo.name}</p>)}
            </Flex>
          </DrawerBody>
        </DrawerContent>
      </DrawerOverlay>
    </Drawer>
  );
};

export default ProfileSideBar;
