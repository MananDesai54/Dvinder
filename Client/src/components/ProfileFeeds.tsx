import React, { FC, Fragment, useState } from "react";
import ProjectIdeaDisplay from "./ProjectIdeaDisplay";
import { FeedDataForProfile } from "../generated/apollo-graphql";
import { isServer } from "../utils";
import { Box, Flex, Text } from "@chakra-ui/layout";
import { Image } from "@chakra-ui/image";
import { ScaleFade } from "@chakra-ui/transition";
import { IconButton } from "@chakra-ui/button";
import { FaBackward, FaForward } from "react-icons/fa";
const Editor = React.lazy(() => import("./CodeEditor"));

interface ProfileFeedsProps {
  feeds: ({
    __typename?: "FeedDataForProfile" | undefined;
  } & Pick<
    FeedDataForProfile,
    "code" | "title" | "imageUrl" | "projectIdea" | "theme" | "language"
  >)[];
  profileUrl: string;
  isLiked?: boolean;
  isTouched?: boolean;
}

const ProfileFeeds: FC<ProfileFeedsProps> = ({
  feeds,
  profileUrl,
  isLiked,
  isTouched,
}) => {
  const [activeFeed, setActiveFeed] = useState(0);
  return (
    <Flex w="100%" h="100%" position="relative">
      {feeds.length > 1 && (
        <Fragment>
          <IconButton
            aria-label="button-previous"
            icon={<FaBackward />}
            style={{
              position: "absolute",
              top: "50%",
              left: "1rem",
              zIndex: 100000,
              display: activeFeed === 0 ? "none" : "flex",
              background: "var(--background-secondary)",
            }}
            onClick={() => setActiveFeed((prev) => prev - 1)}
          />
          <IconButton
            aria-label="button-next"
            icon={<FaForward />}
            style={{
              position: "absolute",
              top: "50%",
              right: "1rem",
              zIndex: 100000,
              display: activeFeed === feeds.length - 1 ? "none" : "flex",
              background: "var(--background-secondary)",
            }}
            onClick={() => setActiveFeed((prev) => prev + 1)}
          />
        </Fragment>
      )}
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
                mx={1}
                key={index}
                height="5px"
                flex={1}
                borderRadius="10px"
                bg={index === activeFeed ? "white" : "#666"}
                boxShadow="0px 0px 40px rgba(0, 0, 0, 1)"
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
            <Fragment key={index}></Fragment>
          ) : (
            <ScaleFade
              in={index === activeFeed}
              style={{
                display: index === activeFeed ? "flex" : "none",
                width: "100%",
                alignItems: "center",
              }}
            >
              <React.Suspense key={index} fallback={<Fragment></Fragment>}>
                <Editor
                  language={feed.language as string}
                  theme={feed.theme as string}
                  value={feed.code}
                  readonly
                  notLineNumbers
                  autoFocus
                />
              </React.Suspense>
            </ScaleFade>
          );
        } else if (feed.imageUrl) {
          return (
            <ScaleFade
              in={index === activeFeed}
              style={{
                display: index === activeFeed ? "block" : "none",
                width: "100%",
                height: "100%",
              }}
            >
              <Image
                key={index}
                src={feed.imageUrl}
                alt={feed.title}
                w="100%"
                h="100%"
                objectFit="cover"
                boxShadow="inset 0 0 40px 40px rgba(0, 0, 0, 0.5)"
              />
            </ScaleFade>
          );
        } else {
          return (
            <ScaleFade
              in={index === activeFeed}
              style={{
                display: index === activeFeed ? "block" : "none",
                width: "100%",
              }}
            >
              <ProjectIdeaDisplay
                key={index}
                projectIdea={feed.projectIdea as string}
                title={feed.title}
              />
            </ScaleFade>
          );
        }
      })}
    </Flex>
  );
};

export default ProfileFeeds;
