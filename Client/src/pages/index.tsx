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
import DraggableCard from "../components/DraggableCard";

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
        distance: 600,
      },
      notifyOnNetworkStatusChange: true,
      skip: !isAuth,
    }
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
          <DraggableCard userProfiles={data?.dvinderProfile?.profiles || []} />
        </Flex>
      )}
    </Layout>
  );
};

export default withApolloClient({ ssr: true })(Index);
