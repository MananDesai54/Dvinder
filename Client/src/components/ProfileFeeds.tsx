import React, { FC, Fragment } from "react";
import ProjectIdeaDisplay from "./ProjectIdeaDisplay";
import { FeedDataForProfile } from "../generated/apollo-graphql";
import { isServer } from "../utils";
import { Box, Flex, Text } from "@chakra-ui/layout";
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
    <Flex w="100%" h="100%" position="relative">
      {feeds.length === 0 && (
        <Image
          src={profileUrl}
          alt="profilePhoto"
          position="absolute"
          top="50%"
          left="50%"
          transform="translate(-50%, -50%)"
          draggable={false}
        />
      )}
      <Flex
        position="absolute"
        top="1rem"
        left="1rem"
        right="1rem"
        zIndex={10000}
      >
        {feeds.length === 0 ? (
          <Box height="5px" flex={1} borderRadius="10px" bg="white" />
        ) : (
          Array(feeds.length)
            .fill(0)
            .map((_, index: number) => (
              <Box
                ml={1}
                key={index}
                height="5px"
                flex={1}
                borderRadius="10px"
                bg="white"
              />
            ))
        )}
      </Flex>
      {isTouched && (
        <Box
          px={2}
          py={1}
          borderRadius="10px"
          fontSize="1.5rem"
          fontWeight="bold"
          position="absolute"
          top="2rem"
          left="2rem"
          border={`2px solid ${
            isLiked ? "var(--color-success)" : "var(--color-danger)"
          }`}
          transform="rotate(-20deg)"
        >
          <Text
            style={{
              color: isLiked ? "var(--color-success)" : "var(--color-danger)",
            }}
          >
            {isLiked ? "Like" : "Nope"}
          </Text>
        </Box>
      )}
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
    </Flex>
  );
};

export default ProfileFeeds;
