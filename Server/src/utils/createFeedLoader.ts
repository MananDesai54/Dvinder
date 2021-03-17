import DataLoader from "dataloader";
import { Feed } from "../entities/Feed";

export const createFeedLoader = () =>
  new DataLoader<number, Feed>(async (feedIds) => {
    const feeds = await Feed.findByIds(feedIds as number[]);
    const feedIdToFeed: Record<number, Feed> = {};
    feeds.forEach((feed) => {
      feedIdToFeed[feed.id] = feed;
    });
    return feedIds.map((feedId) => feedIdToFeed[feedId]);
  });
