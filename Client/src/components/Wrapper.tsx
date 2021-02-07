import { Box } from "@chakra-ui/react";
import { CSSProperties, FC } from "react";

interface WrapperProps {
  variant?: "small" | "regular";
  width?: number;
}

const Wrapper: FC<WrapperProps> = ({ children, variant, width }) => {
  return (
    <Box
      mt={8}
      mx="auto"
      maxW={width ? width : variant === "regular" ? 800 : 400}
      w="100%"
    >
      {children}
    </Box>
  );
};

export default Wrapper;
