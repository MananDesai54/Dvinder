import { Box, Flex, Text } from "@chakra-ui/react";
import React, { FC, useRef } from "react";

interface ProjectIdeaDisplayProps {
  title: string;
  projectIdea: string;
}

const colors = [
  "#17191A",
  "#F8B600",
  "#A5B2BC",
  "#E3D8C1",
  "#FF5F56",
  "#27C93F",
];

const ProjectIdeaDisplay: FC<ProjectIdeaDisplayProps> = ({
  title,
  projectIdea,
}) => {
  const color = useRef(colors[Math.floor(Math.random() * colors.length)]);

  return (
    <Flex
      justifyContent="center"
      alignItems="center"
      p={4}
      style={{
        background: color.current,
      }}
      h="100%"
      w="100%"
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
          Project Idea - {title}
        </Text>
        <Text color="var(--white-color)" textOverflow="ellipsis">
          {"   - "}
          {projectIdea}
        </Text>
      </Box>
    </Flex>
  );
};

export default ProjectIdeaDisplay;
