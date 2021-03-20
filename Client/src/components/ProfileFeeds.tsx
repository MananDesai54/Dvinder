import React, { FC, Fragment, useEffect, useState } from "react";
import ProjectIdeaDisplay from "./ProjectIdeaDisplay";
import { FeedDataForProfile } from "../generated/apollo-graphql";
import { isServer } from "../utils";
import { Box } from "@chakra-ui/layout";
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
}

const ProfileFeeds: FC<ProfileFeedsProps> = ({ feeds, profileUrl }) => {
  return (
    <Box w="100%" h="100%">
      <ProjectIdeaDisplay
        projectIdea={feeds[0].projectIdea as string}
        title={feeds[0].title}
      />
    </Box>
  );
};

export default ProfileFeeds;
