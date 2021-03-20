import {
  Avatar,
  Box,
  Button,
  Flex,
  Image,
  Spinner,
  Text,
} from "@chakra-ui/react";
import React, { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreateFeed from "../components/CreateFeed";
import Layout from "../components/Layout";
import ProfileFeeds from "../components/ProfileFeeds";
import ProfileSideBar from "../components/ProfileSideBar";
import {
  useDvinderProfileQuery,
  useMeQuery,
} from "../generated/apollo-graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { getAge } from "../utils/getUserAge";
import { withApolloClient } from "../utils/withApollo";
import Draggable from "react-draggable";

/**
 * How SSR works
 * me request -> to browser(client)
 * client request -> next.js server
 * next.js request -> graphQL server
 * next.js build HTML
 * send it back to client
 * the first page we render will be SSR other all will be client side
 *
 * so in srr browser send cookie to next server and
 * and in normal or not ssr browser send cookie to direct graphQL server
 * so in ssr cookie is not being send from next server to graphQL server so we need to explicitly pass it using ctx in withApollo
 */

const Index = () => {
  const [createFeed, setCreateFeed] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { data: user } = useMeQuery();
  const isAuth = useIsAuth();
  // => fetch feeds code in comments.txt
  const { data, error, loading, fetchMore, variables } = useDvinderProfileQuery(
    {
      variables: {
        limit: 10,
        distance: 1500,
      },
      notifyOnNetworkStatusChange: true,
      skip: !isAuth,
    }
  );
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });
  const [position, setPosition] = useState<{ x: number; y: number }[]>(
    Array(data?.dvinderProfile?.profiles.length).fill({ x: 0, y: 0 })
  );
  const [profiles, setProfiles] = useState(
    data?.dvinderProfile?.profiles || []
  );

  if (!loading && !data) {
    return <p>{error?.message}</p>;
  }

  return (
    <Layout>
      <CreateFeed
        open={createFeed}
        onClose={() => {
          setCreateFeed(false);
        }}
      />
      <ProfileSideBar
        open={showProfile}
        onClose={() => {
          setShowProfile(false);
        }}
      />
      <Button
        style={{
          background: "var(--background-secondary)",
          color: "var(--text-primary)",
        }}
        position="fixed"
        top="1rem"
        right="4rem"
        onClick={() => setCreateFeed(true)}
        zIndex={10000}
      >
        <FaPlus
          size={14}
          color="white"
          style={{
            marginRight: "0.5rem",
          }}
        />{" "}
        Add Feed
      </Button>
      {user?.me && (
        <Flex
          onClick={() => setShowProfile(true)}
          zIndex={1001}
          cursor="pointer"
          position="fixed"
          top="1rem"
          left="4rem"
          alignItems="center"
        >
          <Avatar name={user.me.username} src={user.me.profileUrl} />
          <Box ml="0.5rem" fontSize="1.2rem" color="white" fontWeight="bold">
            {user.me.username}
          </Box>
        </Flex>
      )}
      {!data && loading ? (
        <Spinner color="white" size="md" />
      ) : (
        <Flex
          position="relative"
          h="100vh"
          justifyContent="center"
          alignItems="center"
          w="100%"
          overflow="hidden"
        >
          {profiles.map(
            (profile, index) =>
              profile && (
                <Draggable
                  key={index}
                  position={position[index]}
                  onStop={(e: any) => {
                    const diffX = e.clientX - dragStart.x;
                    const diffY = e.clientY - dragStart.y;
                    if (diffX < -100) {
                      setPosition((prev) =>
                        prev.map((item, _index) => {
                          if (_index === index) {
                            return {
                              x: item.x + diffX,
                              y: item.y + diffY,
                            };
                          }
                          return item;
                        })
                      );
                      console.log("Nope");
                      setProfiles(
                        profiles.filter((_, _index) => index !== _index)
                      );
                    } else if (diffX > 100) {
                      setPosition((prev) =>
                        prev.map((item, _index) => {
                          if (_index === index) {
                            return {
                              x: item.x + diffX,
                              y: item.y + diffY,
                            };
                          }
                          return item;
                        })
                      );
                      console.log("Like");
                      setProfiles(
                        profiles.filter((_, _index) => index !== _index)
                      );
                    } else {
                      console.log("Don't react");
                    }
                  }}
                  onStart={(e: any) =>
                    setDragStart({ x: e.clientX, y: e.clientY })
                  }
                >
                  <Flex
                    color="white"
                    bg="var(--background-secondary)"
                    position="absolute"
                    borderRadius="5px"
                    style={{
                      width: "95%",
                      maxWidth: "400px",
                      height: "90vh",
                      maxHeight: "600px",
                    }}
                    flexDirection="column"
                    cursor="grab"
                  >
                    <Box
                      flex="1"
                      borderTopLeftRadius="5px"
                      borderTopRightRadius="5px"
                      overflow="hidden"
                    >
                      <ProfileFeeds
                        feeds={profile.feeds}
                        profileUrl={profile.profileUrl}
                      />
                    </Box>
                    <Flex
                      bg="#000"
                      borderBottomLeftRadius="5px"
                      borderBottomRightRadius="5px"
                      p="1rem"
                    >
                      <Image
                        src={profile.profileUrl}
                        alt={profile.username}
                        h="50px"
                        w="50px"
                        borderRadius="50px"
                      />
                      <Box
                        flex={1}
                        noOfLines={1}
                        color="var(--text-primary)"
                        ml="0.5rem"
                      >
                        <Flex alignItems="center">
                          <Text fontSize="1.2rem" fontWeight="bold">
                            {profile.username}
                          </Text>
                          {","}
                          <Text mx="0.3rem">{getAge(profile.birthDate)}</Text>
                          <Image
                            src={`https://img.icons8.com/color/24/000000/${profile.flair}`}
                            alt={profile.flair || "Image"}
                          />
                        </Flex>
                        <Text fontSize="0.9rem">{profile.bio}</Text>
                      </Box>
                    </Flex>
                  </Flex>
                </Draggable>
              )
          )}
        </Flex>
      )}
    </Layout>
  );
};

export default withApolloClient({ ssr: true })(Index);
