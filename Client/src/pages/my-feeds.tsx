import { Box, Divider, Flex, Grid, Text } from "@chakra-ui/layout";
import React, { FC, Fragment } from "react";
import {
  useUserFeedsQuery,
  Feed,
  useMeQuery,
} from "../generated/apollo-graphql";
import { withApolloClient } from "../utils/withApollo";
import FeedDisplay from "../components/FeedDisplay";
import { Image } from "@chakra-ui/image";
import { useIsAuth } from "../hooks/useIsAuth";
import { Button } from "@chakra-ui/button";
import { useRouter } from "next/router";
import { useMediaQuery } from "@chakra-ui/media-query";

interface MyFeedsProps {}

const MyFeeds: FC<MyFeedsProps> = ({}) => {
  const isAuth = useIsAuth();
  const { data } = useUserFeedsQuery({
    skip: !isAuth,
  });
  const { data: user } = useMeQuery();
  const router = useRouter();
  const [isLessThan700] = useMediaQuery("(max-width: 700px)");

  return (
    <Fragment>
      <Button
        position="fixed"
        top="10px"
        right="10px"
        colorScheme="facebook"
        onClick={() => router.push("/auth/user-data?edit=true")}
      >
        Edit Profile
      </Button>
      <Button
        position="fixed"
        top="10px"
        left="10px"
        colorScheme="facebook"
        onClick={() => router.back()}
      >
        Back
      </Button>
      <Flex flexDirection="column" alignItems="center" mb={1}>
        <Image
          src={user?.me?.profileUrl}
          borderRadius="100vw"
          w="200px"
          h="200px"
          m={4}
          mt={8}
        />
        <Flex>
          <Text color="var(--white-color)" fontSize="1.2rem">
            {user?.me?.username.toUpperCase()}
          </Text>
          <Image
            src={`https://img.icons8.com/color/24/000000/${user?.me?.flair}`}
            alt={user?.me?.flair || "Image"}
          />
        </Flex>
        <Text fontSize="1.2rem" color="var(--white-color)">
          {user?.me?.bio}
        </Text>
      </Flex>
      <Divider
        orientation="horizontal"
        my={isLessThan700 ? 0 : 4}
        mx="2%"
        w="96%"
      />
      {data?.userFeeds && (
        <Grid
          gridTemplateColumns={
            isLessThan700 ? "1fr 1fr" : "repeat(auto-fill, minmax(300px, 1fr))"
          }
        >
          {data?.userFeeds.map((feed) => (
            <Box
              key={feed.id}
              m={isLessThan700 ? 2 : 4}
              height={isLessThan700 ? "20vh" : "35vh"}
              borderRadius={"1rem"}
              overflow="hidden"
            >
              <FeedDisplay feed={feed as Feed} />
            </Box>
          ))}
        </Grid>
      )}
    </Fragment>
  );
};

export default withApolloClient({ ssr: false })(MyFeeds);
