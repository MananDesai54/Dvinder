import { FileUpload, GraphQLUpload } from "graphql-upload";
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
  FeedPagination,
} from "../config/types";
import { Feed } from "../entities/Feed";
import { Updoot } from "../entities/Updoot";
import { User } from "../entities/User";
import { isAuth } from "../middleware/isAuth";
import { generateErrorResponse } from "../utils/generateErrorResponse";
import { S3 } from "../utils/awsSetup";
import { v4 as generateId } from "uuid";
// import tf from '@tensorflow/tfjs-node';
// import nsfw from 'nsfwjs';

@Resolver(Feed)
export class FeedResolver {
  @FieldResolver(() => String)
  imageUrlSlice(@Root() root: Feed) {
    return root.imageUrl?.slice(0, 50);
  }

  @FieldResolver(() => User)
  creator(@Root() feed: Feed, @Ctx() { userLoader }: MyContext) {
    return userLoader.load(feed.creatorId);
  }

  @FieldResolver(() => Int, { nullable: true })
  async voteStatus(
    @Root() feed: Feed,
    @Ctx() { updootLoader, req }: MyContext
  ) {
    const updoot = await updootLoader.load({
      feedId: feed.id,
      userId: req.session.userId as number,
    });
    return updoot ? updoot.value : null;
  }

  @Query(() => FeedPagination, { nullable: true })
  @UseMiddleware(isAuth)
  async feeds(
    @Arg("limit", () => Int) limit: number,
    @Arg("cursor", () => String, { nullable: true }) cursor: string | null
  ): Promise<FeedPagination | null> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    try {
      const replacements: any[] = [realLimitPlusOne];
      if (cursor) {
        replacements.push(new Date(parseInt(cursor)));
      }
      const feeds = await getConnection().query(
        `
        select f.*
        from feed f 
        ${cursor ? `where f."createdAt" < $2` : ""}
        order by f."createdAt" DESC
        limit $1
      `,
        replacements
      );

      return {
        feeds: feeds.slice(0, realLimit),
        hasMore: feeds.length === realLimitPlusOne,
      };
      // const feeds = await getConnection().query(
      //   `
      //   select f.*, json_build_object(
      //       'id', u.id,
      //       'username', u.username,
      //       'email', u.email,
      //       'createdAt', u."createdAt",
      //       'updatedAt', u."updatedAt"
      //     ) creator,
      //   (select value from updoot where "userId" = $2 and "feedId" = f.id) "voteStatus"
      //   from feed f INNER JOIN public.user u on u.id = f."creatorId"
      //   ${cursor ? `where f."createdAt" < $3` : ""}
      //   order by f."createdAt" DESC
      //   limit $1
      //   `,
      //   replacements
      //   );
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  @Query(() => [Feed])
  @UseMiddleware(isAuth)
  async userFeeds(@Ctx() { req }: MyContext): Promise<Feed[]> {
    try {
      const feeds = await Feed.find({
        where: { creatorId: req.session.userId },
      });
      return feeds;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }

  @Query(() => [Feed])
  @UseMiddleware(isAuth)
  async otherUserFeeds(@Arg("userId") userId: number): Promise<Feed[]> {
    try {
      const feeds = await Feed.find({
        where: { creatorId: userId },
      });
      return feeds;
    } catch (error) {
      console.log(error.message);
      return [];
    }
  }

  @Query(() => Feed, { nullable: true })
  @UseMiddleware(isAuth)
  async feed(@Arg("id") id: number): Promise<Feed | null> {
    try {
      // const feed = await Feed.findOne(id, { relations: ["creator"] });
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
    @Arg("feedData") feedData: FeedData,
    @Arg("file", () => GraphQLUpload, { nullable: true }) file: FileUpload
  ): Promise<FeedResponse | undefined> {
    try {
      if (!feedData.title) {
        return {
          errors: [
            generateErrorResponse("title", "Please provide valid title"),
          ],
        };
      }
      if (!feedData.code && !feedData.projectIdea && !file) {
        return {
          errors: [
            generateErrorResponse(
              "title",
              "Please provide code, image or project idea"
            ),
          ],
        };
      }

      const feed = await Feed.create({
        creatorId: req.session.userId,
        title: feedData.title,
        type: feedData.type,
      });

      if (file) {
        const { filename, mimetype, encoding, createReadStream } = await file;
        const stream = createReadStream();
        const data = await S3.upload({
          Bucket: process.env.AWS_BUCKET_NAME,
          Key: `${generateId()}:${filename}`,
          Body: stream,
          ContentType: mimetype,
          ContentEncoding: encoding,
        }).promise();
        if (data.Location) {
          feed.imageUrl = data.Location;
        } else {
          return {
            errors: [generateErrorResponse("title", "failed to upload image")],
          };
        }
      }

      if (feedData.code) {
        feed.code = feedData.code;
        feed.theme = feedData.theme;
        feed.language = feedData.language;
      }
      if (feedData.projectIdea) feed.projectIdea = feedData.projectIdea;

      await feed.save();

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
      if (feedData.code) {
        feed.code = updateData.code = feedData.code;
      }
      if (feedData.projectIdea) {
        feed.projectIdea = updateData.projectIdea = feedData.projectIdea;
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

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async vote(
    @Arg("feedId", () => Int) feedId: number,
    @Arg("value", () => Int) value: number,
    @Ctx() { req }: MyContext
  ) {
    try {
      const { userId } = req.session;
      const isUpdoot = value !== -1;
      const realValue = isUpdoot ? 1 : -1;

      const updoot = await Updoot.findOne({ where: { userId, feedId } });

      if (updoot && realValue !== updoot.value) {
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
            update updoot
            set value = $1
            where "feedId" = $2 and "userId" = $3
          `,
            [realValue, feedId, userId]
          );
          await tm.query(
            `
            update feed
            set points = points + $1
            where id = $2
          `,
            [2 * realValue, feedId]
          );
          return true;
        });
      } else if (!updoot) {
        await getConnection().transaction(async (tm) => {
          await tm.query(
            `
            insert into updoot ("userId", "feedId", value)
            values($1, $2, $3)
          `,
            [userId, feedId, realValue]
          );
          await tm.query(
            `
            update feed
            set points = points + $1
            where id = $2
          `,
            [realValue, feedId]
          );
        });
        return true;
      }
      return true;

      ///transaction syntax
      // await getConnection().query(
      //   `
      //   START TRANSACTION;

      //   insert into updoot ("userId", "feedId", value)
      //   values(${userId}, ${feedId}, ${realValue});

      //   update feed
      //   set points = points + ${realValue}
      //   where id = ${feedId};

      //   COMMIT;
      // `
      // );

      // await Updoot.insert({
      //   userId,
      //   feedId,
      //   value: realValue,
      // });
      // await getConnection().query(
      //   `
      //   update feed
      //   set points = points + $1
      //   where id = $2
      // `,
      //   [realValue, feedId]
      // );
    } catch (error) {
      return false;
    }
  }
}
