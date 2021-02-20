import { FC, Fragment } from "react";
import { useUserFeedsQuery } from "../generated/apollo-graphql";

interface FeedsDetailProps {}

const FeedsDetail: FC<FeedsDetailProps> = ({}) => {
  const { data } = useUserFeedsQuery();
  console.log(data);

  return (
    <Fragment>
      {data?.userFeeds &&
        data?.userFeeds.map((feed) => <p key={feed.id}>{feed.title}</p>)}
    </Fragment>
  );
};

export default FeedsDetail;
