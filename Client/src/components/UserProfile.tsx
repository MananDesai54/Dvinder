import {
  Box,
  Button,
  Flex,
  Text,
  SkeletonText,
  ButtonGroup,
  useMediaQuery,
} from "@chakra-ui/react";
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
  const [isLessThan700] = useMediaQuery("(max-width: 700px)");

  return (
    <Fragment>
      <Box position="relative">
        <UserDetail value={data?.me?.email} title="Email" />
        <UserDetail value={data?.me?.birthDate} title="BirthDate" />
        <UserDetail value={data?.me?.gender} title="Gender" />
        <UserDetail value={data?.me?.showMe} title="Show Me" />
        <UserDetail value={data?.me?.lookingFor} title="Looking For" />
        <UserDetail
          value={data?.me?.minAge + "-" + data?.me?.maxAge}
          title="Age Range"
        />
        <ButtonGroup my={4} flexWrap="wrap">
          <Button
            colorScheme="facebook"
            onClick={() => {
              router.push("/my-feeds");
            }}
          >
            My Feeds
          </Button>
          <Button
            colorScheme="facebook"
            onClick={() => {
              router.push("/auth/user-data?edit=true");
            }}
          >
            Edit Profile
          </Button>
        </ButtonGroup>
      </Box>
      {fetchingRepos ? (
        <Box padding="6" boxShadow="lg" bg="white" borderRadius="0.5rem">
          <SkeletonText noOfLines={2} spacing="4" />
        </Box>
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
                    width: isLessThan700 ? "100%" : "48%",
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
                    <Flex ml={1} alignItems="center">
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
              update: (cache) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: null,
                  },
                });
                cache.evict({ fieldName: "dvinderProfile" });
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
              update: (cache) => {
                cache.writeQuery<MeQuery>({
                  query: MeDocument,
                  data: {
                    __typename: "Query",
                    me: null,
                  },
                });
                cache.evict({ fieldName: "dvinderProfile" });
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
