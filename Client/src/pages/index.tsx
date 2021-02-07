import { Box, Button, Flex, Heading, Stack, Text } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
import UpdootSection from "../components/UpdootSection";
import { useFeedsQuery } from "../generated/apollo-graphql";
import { useIsAuth } from "../hooks/useIsAuth";
import { withApolloClient } from "../utils/withApollo";
// import { useFeedsQuery } from "../generated/graphql";
// import { withUrqlClient } from "next-urql";
// import { createUrqlClient } from "../utils/createUrqlClient";

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
 * so in ssr cookie is not being send from next server to graphQL server so we need to explicitly pass it using ctx in createUrqlClient
 */

const Index = () => {
  const isAuth = useIsAuth();
  // const [variables, setVariables] = useState({
  //   limit: 15,
  //   cursor: null as null | string,
  // });
  // const [{ data, fetching }] = useFeedsQuery({
  //   variables,
  // });
  const { data, error, loading, fetchMore, variables } = useFeedsQuery({
    variables: {
      limit: 15,
      cursor: null as null | string,
    },
    notifyOnNetworkStatusChange: true,
    skip: !isAuth,
  });

  // if (!fetching && !data) {
  if (!loading && !data) {
    return <p>{error?.message}</p>;
  }

  return (
    <>
      <Navbar></Navbar>
      {/* {!data && fetching ? ( */}
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
                    <Text>{feed.imageUrlSlice}</Text>
                  </Box>
                </Flex>
              )
          )}
        </Stack>
      )}
      {data && data.feeds?.hasMore ? (
        <Button
          onClick={() =>
            // setVariables({
            //   limit: variables.limit,
            //   cursor: data.feeds
            //     ? data.feeds.feeds[data.feeds.feeds.length - 1].createdAt
            //     : null,
            // })
            fetchMore({
              variables: {
                limit: variables?.limit,
                cursor: data.feeds
                  ? data.feeds.feeds[data.feeds.feeds.length - 1].createdAt
                  : null,
              },
              // updateQuery: (
              //   previousValues,
              //   { fetchMoreResult }
              // ): FeedsQuery => {
              //   if (!fetchMoreResult) {
              //     return previousValues as FeedsQuery;
              //   }
              //   return {
              //     __typename: "Query",
              //     feeds: {
              //       __typename: "FeedPagination",
              //       hasMore: (fetchMoreResult as FeedsQuery).feeds!.hasMore,
              //       feeds: [
              //         ...((previousValues as FeedsQuery).feeds.feeds || []),
              //         ...((fetchMoreResult as FeedsQuery).feeds.feeds || []),
              //       ],
              //     },
              //   };
              // },
            })
          }
          // isLoading={fetching}
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
    </>
  );
};

export default withApolloClient({ ssr: true })(Index);
// export default withUrqlClient(createUrqlClient, { ssr: true })(Index);
