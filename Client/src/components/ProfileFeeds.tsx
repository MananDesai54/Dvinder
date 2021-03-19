import { FC, useEffect, useState } from "react";
import { FeedDataForProfile } from "../../../Server/src/config/types";
import Editor from "./CodeEditor";
import ProjectIdeaDisplay from "./ProjectIdeaDisplay";
import Stories from "react-insta-stories";
import { Story } from "react-insta-stories/dist/interfaces";

interface ProfileFeedsProps {
  feeds: FeedDataForProfile[];
  profileUrl: string;
}

const ProfileFeeds: FC<ProfileFeedsProps> = ({ feeds, profileUrl }) => {
  const [feedsToShow, setFeedsToShow] = useState<Story[]>([
    { url: profileUrl, type: "image" },
  ]);
  useEffect(() => {
    const userFeeds = feeds.map((feed) => {
      if (feed.code)
        return {
          content: () => (
            <Editor
              language={(feed.language as string) || ""}
              theme={(feed.theme as string) || ""}
              value={(feed.code as string) || ""}
              readonly
            />
          ),
        };
      if (feed.projectIdea)
        return {
          content: () => (
            <ProjectIdeaDisplay
              title={feed.title}
              projectIdea={(feed.projectIdea as string) || ""}
            />
          ),
        };
      if (feed.imageUrl) return { url: feed.imageUrl, type: "image" };
    });
    setFeedsToShow(userFeeds as Story[]);
  }, []);

  return (
    <Stories
      stories={feedsToShow}
      defaultInterval={5000}
      keyboardNavigation
      height={"100%" as any}
    />
  );
};

export default ProfileFeeds;
