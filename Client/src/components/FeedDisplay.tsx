import {
  Box,
  Flex,
  IconButton,
  Image,
  SlideFade,
  Text,
} from "@chakra-ui/react";
import React, { FC, Fragment, useRef, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Feed } from "../generated/apollo-graphql";
import { isServer } from "../utils";
import ProjectIdeaDisplay from "./ProjectIdeaDisplay";
const Editor = React.lazy(() => import("./CodeEditor"));

interface FeedDisplayProps {
  feed: Feed;
  isFeedsPage?: boolean;
}

const FeedDisplay: FC<FeedDisplayProps> = ({ feed, isFeedsPage }) => {
  const [show, setShow] = useState(false);

  return (
    <Box
      h="100%"
      w="100%"
      position="relative"
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
    >
      {feed.imageUrl && (
        <Image src={feed.imageUrl} alt={feed.title} objectFit="cover" />
      )}
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
      {feed.projectIdea && (
        <ProjectIdeaDisplay projectIdea={feed.projectIdea} title={feed.title} />
      )}
      <SlideFade
        in={show && !isFeedsPage}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          background: "rgba(0, 0, 0, 0.8)",
          zIndex: !isFeedsPage ? 100 : -1,
        }}
      >
        <Flex height="100%" justifyContent="space-evenly" alignItems="center">
          <IconButton
            aria-label="delete"
            color="var(--white-color)"
            icon={<FaTrash />}
            w="50px"
            h="50px"
            fontSize="2rem"
          />
          <IconButton
            aria-label="edit"
            color="var(--white-color)"
            icon={<FaEdit />}
            w="50px"
            h="50px"
            fontSize="2rem"
          />
        </Flex>
      </SlideFade>
    </Box>
  );
};

export default FeedDisplay;
