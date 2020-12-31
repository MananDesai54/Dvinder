import {
  Arg,
  Ctx,
  Mutation,
  Query,
  Resolver,
  UseMiddleware,
} from "type-graphql";
import {
  FeedUpdateData,
  FeedData,
  MyContext,
  FeedResponse,
} from "../config/types";
import { Feed } from "../entities/Feed";
import { isAuth } from "../middleware/isAuth";
import { generateErrorResponse } from "../utils/generateErrorResponse";

@Resolver()
export class FeedResolver {
  @Query(() => [Feed], { nullable: true })
  @UseMiddleware(isAuth)
  async feeds(): Promise<Feed[] | null> {
    try {
      const feeds = await Feed.find({});
      return feeds;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  @Query(() => Feed, { nullable: true })
  @UseMiddleware(isAuth)
  async feed(@Arg("id") id: number): Promise<Feed | null> {
    try {
      const feed = await Feed.findOne(id);
      if (!feed) {
        console.log("Feed not found");
        return null;
      }
      return feed;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  @Mutation(() => FeedResponse)
  @UseMiddleware(isAuth)
  async createFeed(
    @Ctx() { req }: MyContext,
    @Arg("feedData") feedData: FeedData
  ): Promise<FeedResponse> {
    try {
      const feed = await Feed.create({
        ...feedData,
        creatorId: req.session.userId,
      }).save();

      return {
        feed,
      };
    } catch (error) {
      console.log(error.message);
      return {
        errors: [generateErrorResponse("Server Error", error.message)],
      };
    }
  }

  @Mutation(() => FeedResponse)
  @UseMiddleware(isAuth)
  async updateFeed(
    @Arg("feedData") feedData: FeedUpdateData
  ): Promise<FeedResponse> {
    try {
      let feed = await Feed.findOne(feedData.imageUrl);
      if (!feed) {
        console.log("Feed not found");
        return {
          errors: [generateErrorResponse("Auth", "Not Authorized")],
        };
      }

      const updateData: FeedUpdateData = {};

      if (feedData.title) {
        feed.title = updateData.title = feedData.title;
      }
      if (feedData.imageUrl) {
        feed.imageUrl = updateData.imageUrl = feedData.imageUrl;
      }

      await Feed.update({ id: feedData.id }, updateData);

      return {
        feed,
      };
    } catch (error) {
      console.log(error.message);
      return {
        errors: [generateErrorResponse("Server Error", error.message)],
      };
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async deleteFeed(@Arg("id") id: number): Promise<boolean> {
    try {
      const feed = await Feed.delete(id);
      if (!feed) {
        return false;
      }
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }
}
