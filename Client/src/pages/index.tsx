import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import { useState } from "react";
import { FaPlus } from "react-icons/fa";
import CreateFeed from "../components/CreateFeed";
import Layout from "../components/Layout";
import UpdootSection from "../components/UpdootSection";
import { useFeedsQuery } from "../generated/apollo-graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { withApolloClient } from "../utils/withApollo";

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
      <FaPlus size={30} color="white" onClick={() => setCreateFeed(true)} />
      {!data && loading ? (
        "Loading..."
      ) : (
        <Stack spacing={8} mx={16} my={8}>
          {data!.feeds?.feeds?.map(
            (feed) =>
              feed && (
                <Flex key={feed.id} shadow="md" borderWidth="1px" p={4}>
                  <UpdootSection feed={feed} />
                  <Box>
                    <Heading>{feed.title}</Heading> by {feed.creator.username}
                    <Text>{feed.code}</Text>
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
