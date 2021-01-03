import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import {
  FeedUpdateData,
  FeedData,
  MyContext,
  FeedResponse,
} from "../config/types";
import { Feed } from "../entities/Feed";
import { isAuth } from "../middleware/isAuth";
import { generateErrorResponse } from "../utils/generateErrorResponse";

@Resolver(Feed)
export class FeedResolver {
  @FieldResolver(() => String)
  imageUrlSlice(@Root() root: Feed) {
    return root.imageUrl.slice(0, 50);
  }

  @Query(() => [Feed], { nullable: true })
  // @UseMiddleware(isAuth)
  async feeds(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<Feed[] | null> {
    const realLimit = Math.min(50, limit);
    try {
      const qb = getConnection()
        .getRepository(Feed)
        .createQueryBuilder("f")
        .orderBy('"createdAt"', "DESC")
        .take(realLimit);
      if (cursor) {
        qb.where('"createdAt" < :cursor', {
          cursor: new Date(parseInt(cursor)),
        });
      }

      return qb.getMany();
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
