import { Box, Button, Flex, Text, Spinner } from "@chakra-ui/react";
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
  fetchingRepos: boolean;
}

const UserProfile: FC<UserProfileProps> = ({ data, repos, fetchingRepos }) => {
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
      {fetchingRepos ? (
        <Flex justifyContent="center">
          <Spinner size="lg" color="white" mx="auto" />
        </Flex>
      ) : (
        repos.length > 0 && (
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
            <Flex mt={4} flexWrap="wrap">
              {repos.map((repo: any, index: number) => (
                <Box
                  bg="white"
                  key={index}
                  mb={2}
                  mx="1%"
                  style={{
                    padding: "0.5rem",
                    color: "#222",
                    borderRadius: "0.5rem",
                    width: "48%",
                    position: "relative",
                  }}
                >
                  <Flex position="absolute" right="10px" top="10px">
                    <Flex alignItems="center">
                      <FaStar size={12} />{" "}
                      <span style={{ fontSize: 12 }}>
                        {repo.stargazers_count}
                      </span>
                    </Flex>
                    <Flex ml={0.5} alignItems="center">
                      <FaCodeBranch size={12} />{" "}
                      <span style={{ fontSize: 12 }}>{repo.forks_count}</span>
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
                      <Text w="80%" noOfLines={1}>
                        {repo.name}
                      </Text>
                    </a>
                  </Link>
                  <Text noOfLines={1}>{repo.description || repo.name}</Text>
                </Box>
              ))}
            </Flex>
          </Fragment>
        )
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
