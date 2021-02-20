import { Box } from "@chakra-ui/react";
import { FC } from "react";

interface UserDetailProps {
  title: string;
  value: string | undefined | null;
}

const UserDetail: FC<UserDetailProps> = ({ title, value }) => {
  return (
    <Box mt="0.8rem" color="white">
      <p
        style={{
          fontSize: "1.1rem",
        }}
      >
        {value}
      </p>
      <p
        style={{
          fontSize: "0.8rem",
          color: "rgba(255, 255, 255, 0.5)",
          borderBottom: "1px solid gray",
        }}
      >
        {title}
      </p>
    </Box>
  );
};

export default UserDetail;
