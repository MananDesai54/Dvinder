import { Box, Button, Flex, Text, Wrap, WrapItem } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import React, { FC, Fragment } from "react";
import { FaCodeBranch, FaGithub, FaStar } from "react-icons/fa";
import {
  MeQuery,
  MeDocument,
  useLogoutMutation,
  useDeleteUserMutation,
} from "../generated/apollo-graphql";
import UserDetail from "./UserDetail";

interface UserProfileProps {
  data: MeQuery | undefined;
  repos: any[];
}

const UserProfile: FC<UserProfileProps> = ({ data, repos }) => {
  const router = useRouter();
  const [logout] = useLogoutMutation();
  const [deleteUser, { error }] = useDeleteUserMutation();

  return (
    <Fragment>
      <Box position="relative">
        <UserDetail value={data?.me?.email} title="Email" />
        <UserDetail value={data?.me?.birthDate} title="BirthDate" />
        <UserDetail value={data?.me?.gender} title="Gender" />
        <Button
          my={4}
          colorScheme="facebook"
          onClick={() => {
            router.push("/auth/user-data?edit=true");
          }}
        >
          Edit Profile
        </Button>
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
            <span style={{ marginLeft: "0.5rem" }}>Popular Repos</span>
          </p>
          <Wrap mt={4}>
            {repos.map((repo: any, index: number) => (
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
                      <FaStar size={18} /> <span>{repo.stargazers_count}</span>
                    </Flex>
                    <Flex mx={1} alignItems="center">
                      <FaCodeBranch size={18} /> <span>{repo.forks_count}</span>
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
        <Button
          mx={4}
          colorScheme="facebook"
          onClick={async () => {
            await logout({
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: null,
                  },
                });
              },
            });
          }}
        >
          Logout
        </Button>
        <Button
          onClick={async () => {
            await deleteUser({
              variables: { id: data?.me?.id as number },
              update: (cache, { data }) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: null,
                  },
                });
              },
            });
          }}
          colorScheme="red"
        >
          Delete Account
        </Button>
      </Flex>
    </Fragment>
  );
};

export default UserProfile;
