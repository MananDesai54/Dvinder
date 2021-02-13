import {
  Avatar,
  Box,
  Button,
  Flex,
  Heading,
  Image,
  Stack,
} from "@chakra-ui/react";
import React, { Fragment, useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreateFeed from "../components/CreateFeed";
import Layout from "../components/Layout";
import ProfileSideBar from "../components/ProfileSideBar";
import UpdootSection from "../components/UpdootSection";
import { useFeedsQuery, useMeQuery } from "../generated/apollo-graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { isServer } from "../utils";
import { withApolloClient } from "../utils/withApollo";
const Editor = React.lazy(() => import("../components/CodeEditor"));

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
  const { data, error, loading, fetchMore, variables } = useFeedsQuery({
    variables: {
      limit: 15,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
    skip: !isAuth,
  });

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
        "Loading..."
      ) : (
        <Stack spacing={8} m={16}>
          {data!.feeds?.feeds?.map(
            (feed) =>
              feed && (
                <Flex
                  key={feed.id}
                  shadow="md"
                  borderWidth="1px"
                  p={4}
                  color="white"
                >
                  <UpdootSection feed={feed} />
                  <Box>
                    <Heading>{feed.title}</Heading> by {feed.creator.username}
                    {feed.imageUrl && (
                      <Image src={feed.imageUrl} alt={feed.title} />
                    )}
                    {feed.code && !isServer() && (
                      <React.Suspense fallback={<Fragment></Fragment>}>
                        <Editor
                          language={(feed.language as string) || ""}
                          theme={(feed.theme as string) || ""}
                          value={feed.code || ""}
                          readonly
                        />
                      </React.Suspense>
                    )}
                  </Box>
                </Flex>
              )
          )}
        </Stack>
      )}
      {data && data.feeds?.hasMore ? (
        <Button
          onClick={() =>
            fetchMore({
              variables: {
                limit: variables?.limit,
                cursor: data.feeds
                  ? data.feeds.feeds[data.feeds.feeds.length - 1].createdAt
                  : null,
              },
            })
          }
          isLoading={loading}
          colorScheme="teal"
          my={4}
          mx={16}
        >
          Load More
        </Button>
      ) : (
        ""
      )}
    </Layout>
  );
};

export default withApolloClient({ ssr: true })(Index);
