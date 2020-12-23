import { Box } from "@chakra-ui/react";
import { FC } from "react";

interface WrapperProps {
  variant?: "small" | "regular";
}

const Wrapper: FC<WrapperProps> = ({ children, variant }) => {
  return (
    <Box mt={8} mx="auto" maxW={variant === "regular" ? 800 : 400} w="100%">
      {children}
    </Box>
  );
};

export default Wrapper;
