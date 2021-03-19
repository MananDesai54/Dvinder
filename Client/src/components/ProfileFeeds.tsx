import React, { FC, Fragment, useEffect, useState } from "react";
import ProjectIdeaDisplay from "./ProjectIdeaDisplay";
import { Story } from "react-insta-stories/dist/interfaces";
import { FeedDataForProfile } from "../generated/apollo-graphql";
import { isServer } from "../utils";
const Editor = React.lazy(() => import("./CodeEditor"));

interface ProfileFeedsProps {
  feeds: ({
    __typename?: "FeedDataForProfile" | undefined;
  } & Pick<
    FeedDataForProfile,
    "code" | "title" | "imageUrl" | "projectIdea" | "theme" | "language"
  >)[];
  profileUrl: string;
}

const ProfileFeeds: FC<ProfileFeedsProps> = ({ feeds, profileUrl }) => {
  const [feedsToShow, setFeedsToShow] = useState<Story[]>([
    { url: profileUrl, type: "image" },
  ]);
  useEffect(() => {
    if (feeds) {
      const userFeeds: Story[] = feeds.map((feed) => {
        if (feed.code)
          return {
            content: () =>
              !isServer() ? (
                <React.Suspense fallback={<Fragment></Fragment>}>
                  <Editor
                    language={(feed.language as string) || ""}
                    theme={(feed.theme as string) || ""}
                    value={feed.code || ""}
                    readonly
                  />
                </React.Suspense>
              ) : (
                <p>Loading</p>
              ),
          };
        else if (feed.projectIdea)
          return {
            content: () => (
              <ProjectIdeaDisplay
                title={feed.title}
                projectIdea={(feed.projectIdea as string) || ""}
              />
            ),
          };
        else return { url: feed.imageUrl as string, type: "image" };
      });
      setFeedsToShow(userFeeds);
    }
  }, []);

  return <p>Hello</p>;
};

export default ProfileFeeds;
