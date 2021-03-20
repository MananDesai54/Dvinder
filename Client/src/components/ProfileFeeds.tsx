import React, { FC, Fragment } from "react";
import ProjectIdeaDisplay from "./ProjectIdeaDisplay";
import { FeedDataForProfile } from "../generated/apollo-graphql";
import { isServer } from "../utils";
import { Box, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
const Editor = React.lazy(() => import("./CodeEditor"));

interface ProfileFeedsProps {
  feeds: ({
    __typename?: "FeedDataForProfile" | undefined;
  } & Pick<
    FeedDataForProfile,
    "code" | "title" | "imageUrl" | "projectIdea" | "theme" | "language"
  >)[];
  profileUrl: string;
  isLiked: boolean;
  isTouched: boolean;
}

const ProfileFeeds: FC<ProfileFeedsProps> = ({
  feeds,
  profileUrl,
  isLiked,
  isTouched,
}) => {
  return (
    <Box w="100%" h="100%" position="relative">
      <Box
        px={2}
        py={1}
        borderRadius="10px"
        fontSize="1.5rem"
        fontWeight="bold"
        position="absolute"
        top="1rem"
        left="1rem"
        border="2px solid red"
      >
        <Text
          style={{
            color: "red",
          }}
        >
          {isLiked ? "Like" : "Nope"}
        </Text>
      </Box>
      {feeds.map((feed, index) => {
        if (feed.code) {
          return isServer() ? (
            <Fragment></Fragment>
          ) : (
            <React.Suspense key={index} fallback={<Fragment></Fragment>}>
              <Editor
                language={feed.language as string}
                theme={feed.theme as string}
                value={feed.code}
                readonly
              />
            </React.Suspense>
          );
        } else if (feed.imageUrl) {
          return <Image key={index} src={feed.imageUrl} alt={feed.title} />;
        } else {
          return (
            <ProjectIdeaDisplay
              key={index}
              projectIdea={feed.projectIdea as string}
              title={feed.title}
            />
          );
        }
      })}
    </Box>
  );
};

export default ProfileFeeds;
