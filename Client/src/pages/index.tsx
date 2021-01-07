import { ChevronUpIcon, ChevronDownIcon } from "@chakra-ui/icons";
import {
  Box,
  Button,
  Flex,
  Heading,
  IconButton,
  Stack,
  Text,
} from "@chakra-ui/react";
import { useState } from "react";
import Navbar from "../components/Navbar";
import UpdootSection from "../components/UpdootSection";
import { useFeedsQuery } from "../generated/graphql";
import { useIsAuth } from "../hooks/useIsAuth";
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
 */

const Index = () => {
  useIsAuth();
  const [variables, setVariables] = useState({
    limit: 2,
    cursor: null as null | string,
  });
  const [{ data, fetching }] = useFeedsQuery({
    variables,
  });

  if (!fetching && !data) {
    return <p>Something went wrong</p>;
  }

  return (
    <>
      <Navbar></Navbar>
      {!data && fetching ? (
        "Loading..."
      ) : (
        <Stack spacing={8} mx={16} my={8}>
          {data!.feeds?.feeds?.map((feed) => (
            <Flex key={feed.id} shadow="md" borderWidth="1px" p={4}>
              <UpdootSection feed={feed} />
              <Box>
                <Heading>{feed.title}</Heading> by {feed.creator.username}
                <Text>{feed.imageUrlSlice}</Text>
              </Box>
            </Flex>
          ))}
        </Stack>
      )}
      {data && data.feeds?.hasMore ? (
        <Button
          onClick={() =>
            setVariables({
              limit: variables.limit,
              cursor: data.feeds
                ? data.feeds.feeds[data.feeds.feeds.length - 1].createdAt
                : null,
            })
          }
          isLoading={fetching}
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

export default Index;
// export default withUrqlClient(createUrqlClient, { ssr: false })(Index);
