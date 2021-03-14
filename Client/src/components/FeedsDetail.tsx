import { Box } from "@chakra-ui/react";
import { FC, Fragment } from "react";
import { Feed, useUserFeedsQuery } from "../generated/apollo-graphql";
import FeedDisplay from "./FeedDisplay";

interface FeedsDetailProps {}

const FeedsDetail: FC<FeedsDetailProps> = ({}) => {
  const { data } = useUserFeedsQuery();

  return (
    <Fragment>
      {data?.userFeeds &&
        data?.userFeeds.map((feed) => (
          <Box key={feed.id}>
            <FeedDisplay feed={feed as Feed} />
          </Box>
        ))}
    </Fragment>
  );
};

export default FeedsDetail;
