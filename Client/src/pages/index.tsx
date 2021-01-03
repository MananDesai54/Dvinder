import { Box, Button, Heading, Stack, Text } from "@chakra-ui/react";
import Navbar from "../components/Navbar";
// import { withUrqlClient } from "next-urql";
// import { createUrqlClient } from "../utils/createUrqlClient";
import { useFeedsQuery } from "../generated/graphql";

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
  const [{ data, fetching }] = useFeedsQuery({
    variables: {
      limit: 5,
    },
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
          {data!.feeds?.map((feed) => (
            <Box key={feed.id} shadow="md" borderWidth="1px" p={4}>
              <Heading>{feed.title}</Heading>
              <Text>{feed.imageUrlSlice}</Text>
            </Box>
          ))}
        </Stack>
      )}
      {data && (
        <Button isLoading={fetching} colorScheme="teal" my={4} mx={16}>
          Load More
        </Button>
      )}
    </>
  );
};

export default Index;
// export default withUrqlClient(createUrqlClient, { ssr: false })(Index);
