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
const Editor = React.lazy(() => import("./CodeEditor"));

interface FeedDisplayProps {
  feed: Feed;
  isFeedsPage?: boolean;
}

const colors = [
  "#17191A",
  "#F8B600",
  "#A5B2BC",
  "#E3D8C1",
  "#FF5F56",
  "#27C93F",
];

const FeedDisplay: FC<FeedDisplayProps> = ({ feed, isFeedsPage }) => {
  const [show, setShow] = useState(false);
  const color = useRef(colors[Math.floor(Math.random() * colors.length)]);

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
            background: color.current,
          }}
          position="relative"
        >
          <Box
            w="100%"
            minHeight="80%"
            style={{
              background: "#2A2734",
              borderRadius: "5px",
              padding: "0.5rem",
              boxShadow: "0 10px 10px rgba(0, 0, 0, 0.3)",
              overflow: "hidden",
            }}
          >
            <Flex>
              <Box
                w="10px"
                h="10px"
                borderRadius="10px"
                backgroundColor="#ff5f56"
              />
              <Box
                w="10px"
                h="10px"
                mx={1}
                borderRadius="10px"
                backgroundColor="#F8B600"
              />
              <Box
                w="10px"
                h="10px"
                borderRadius="10px"
                backgroundColor="#27C93F"
              />
            </Flex>
            <Text
              fontSize="1.2rem"
              fontWeight="bold"
              textOverflow="ellipsis"
              color="var(--white-color)"
              borderBottom="1px solid var(--white-color)"
              my={2}
              noOfLines={1}
            >
              Project Idea - {feed.title}
            </Text>
            <Text color="var(--white-color)" textOverflow="ellipsis">
              {"   - "}
              {feed.projectIdea}
            </Text>
          </Box>
        </Flex>
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
