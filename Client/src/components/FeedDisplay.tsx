import { Image } from "@chakra-ui/react";
import React, { FC, Fragment } from "react";
import { Feed } from "../generated/apollo-graphql";
import { isServer } from "../utils";
const Editor = React.lazy(() => import("./CodeEditor"));

interface FeedDisplayProps {
  feed: Feed;
}

const FeedDisplay: FC<FeedDisplayProps> = ({ feed }) => {
  return (
    <Fragment>
      {feed.imageUrl && <Image src={feed.imageUrl} alt={feed.title} />}
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
      {feed.projectIdea && <p>{feed.projectIdea}</p>}
    </Fragment>
  );
};

export default FeedDisplay;
