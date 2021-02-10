import { Button } from "@chakra-ui/react";
import { FC } from "react";

interface SwapButtonProps {
  wantToAdd: string;
  title: string;
  addTitle: string;
  setWantToAdd: () => void | {};
  resetOthers: () => void | {};
}

const SwapButtons: FC<SwapButtonProps> = ({
  wantToAdd,
  setWantToAdd,
  resetOthers,
  title,
  addTitle,
}) => {
  return (
    <Button
      style={{
        background:
          wantToAdd.toLowerCase() === addTitle.toLowerCase()
            ? "var(--background-secondary)"
            : "var(--background-tertiary)",
        color:
          wantToAdd.toLowerCase() === addTitle.toLowerCase()
            ? "white"
            : "black",
      }}
      onClick={() => {
        setWantToAdd();
        resetOthers();
      }}
    >
      {title}
    </Button>
  );
};

export default SwapButtons;
