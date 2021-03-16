import { Box } from "@chakra-ui/layout";
import { FC, Fragment } from "react";

interface PlaceSuggestionProps {
  places: string[];
  onClick: ((address: string) => void) | ((address: string) => Function);
}

const PlaceSuggestion: FC<PlaceSuggestionProps> = ({ places, onClick }) => {
  return (
    <Fragment>
      {places.map((place, index) => (
        <Box
          mb={1}
          p={1}
          key={index}
          cursor="pointer"
          onClick={() => onClick(place)}
        >
          {place}
        </Box>
      ))}
    </Fragment>
  );
};

export default PlaceSuggestion;
