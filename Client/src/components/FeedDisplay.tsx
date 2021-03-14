import {
  Box,
  Flex,
  IconButton,
  Image,
  SlideFade,
  Text,
} from "@chakra-ui/react";
import React, { FC, Fragment, useState } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import { Feed } from "../generated/apollo-graphql";
import { isServer } from "../utils";
const Editor = React.lazy(() => import("./CodeEditor"));

interface FeedDisplayProps {
  feed: Feed;
}

const FeedDisplay: FC<FeedDisplayProps> = ({ feed }) => {
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
        <Flex
          justifyContent="center"
          alignItems="center"
          p={4}
          height="100%"
          width="100%"
          style={{
            background: "rgb(167,176,217)",
            backgroundImage:
              "linear-gradient(120deg, rgba(76,99,201,1) 0%, rgba(167,176,217,1) 100%)",
          }}
          position="relative"
        >
          <Box
            w="100%"
            style={{
              backgroundImage:
                "linear-gradient(120deg, rgba(255,255, 255, .5) 0%, rgba(255,255, 255, .3) 100%)",
              backdropFilter: "blur(10px)",
              borderRadius: "1rem",
              padding: "0.5rem",
              boxShadow: "0 10px 10px rgba(0, 0, 0, 0.2)",
              overflow: "hidden",
            }}
          >
            <Text
              fontSize="1.2rem"
              fontWeight="bold"
              textAlign="center"
              textOverflow="ellipsis"
            >
              Project Idea
            </Text>
            <Text textAlign="center" textOverflow="ellipsis">
              {feed.projectIdea}
            </Text>
          </Box>
        </Flex>
      )}
      <SlideFade
        in={show}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100%",
          width: "100%",
          background: "rgba(0, 0, 0, 0.8)",
          zIndex: 10000000000,
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
