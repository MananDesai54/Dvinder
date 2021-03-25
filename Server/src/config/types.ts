import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { Field, InputType, Int, ObjectType } from "type-graphql";
import { Feed } from "../entities/Feed";
import { Match } from "../entities/Match";
import { User } from "../entities/User";
import { createUpdootLoader } from "../utils/createUpdootLoader";
import { createUserLoader } from "../utils/createUserLoader";

/**
 * Types and classes
 */
export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
  redis: Redis;
  userLoader: ReturnType<typeof createUserLoader>;
  updootLoader: ReturnType<typeof createUpdootLoader>;
};

export type NewMessage = {
  matchId: number;
  senderId: number;
  recipientId: number;
  text: string;
};

export class ValidationField {
  constructor(
    public success: boolean,
    public message: string,
    public field: string
  ) {}
}

@ObjectType()
export class Code {
  @Field()
  code!: string;

  @Field()
  theme!: string;

  @Field()
  language!: string;
}

/**
 * Enums
 */

/**
 * GraphQL Input Types
 */
@InputType()
export class UserData {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  username!: string;
}

@InputType()
export class FeedData {
  @Field()
  title!: string;

  @Field()
  type!: "showcase" | "matches";

  @Field(() => String, { nullable: true })
  code?: String;

  @Field(() => String, { nullable: true })
  theme?: String;

  @Field(() => String, { nullable: true })
  language?: String;

  @Field(() => String, { nullable: true })
  projectIdea?: string;
}

@InputType()
export class FeedUpdateData {
  @Field(() => String, { nullable: true })
  title?: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  code?: String;

  @Field()
  id?: number;

  @Field(() => String, { nullable: true })
  projectIdea?: string;
}

@InputType()
export class MoreUserData {
  @Field(() => String, { nullable: true })
  bio?: string;

  @Field(() => String, { nullable: true })
  flair?: string;

  @Field(() => String, { nullable: true })
  gender?: string;

  @Field(() => String, { nullable: true })
  showMe?: string;

  @Field(() => Int, { nullable: true })
  minAge?: number;

  @Field(() => Int, { nullable: true })
  maxAge?: number;

  @Field(() => String, { nullable: true })
  birthDate?: string;

  @Field(() => String, { nullable: true })
  lookingFor?: string;

  @Field(() => String, { nullable: true })
  address?: string;
}

/**
 * GraphQL Object types
 */
@ObjectType()
export class ErrorSuccessResponse {
  @Field()
  success?: boolean;

  @Field()
  message?: string;

  @Field(() => User, { nullable: true })
  user?: User | null;
}

@ObjectType()
export class ErrorResponse {
  @Field()
  field!: string;

  @Field(() => String)
  message!: string;
}

@ObjectType()
export class UserResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];

  @Field(() => User, { nullable: true })
  user?: User;

  @Field()
  success?: boolean;

  @Field(() => String, { nullable: true })
  message?: string;
}

@ObjectType()
export class FeedResponse {
  @Field(() => [ErrorResponse], { nullable: true })
  errors?: ErrorResponse[];

  @Field(() => Feed, { nullable: true })
  feed?: Feed;

  @Field(() => [Feed], { nullable: true })
  feeds?: Feed[];
}

@ObjectType()
export class FeedPagination {
  @Field(() => [Feed])
  feeds!: Feed[];

  @Field(() => Boolean)
  hasMore!: boolean;
}

@ObjectType()
export class PlaceSearchResult {
  @Field()
  status!: string;

  @Field(() => [String])
  predictions!: string[];
}

@ObjectType()
export class FeedDataForProfile {
  @Field(() => String)
  title!: string;

  @Field(() => String, { nullable: true })
  imageUrl?: string;

  @Field(() => String, { nullable: true })
  code?: String;

  @Field(() => String, { nullable: true })
  theme?: String;

  @Field(() => String, { nullable: true })
  language?: String;

  @Field(() => String, { nullable: true })
  projectIdea?: string;
}

@ObjectType()
export class DvinderProfile {
  @Field(() => Int)
  userId!: number;

  @Field()
  username!: string;

  @Field()
  profileUrl!: string;

  @Field()
  bio!: string;

  @Field()
  githubUsername?: string;

  @Field()
  birthDate!: string;

  @Field()
  flair!: string;

  @Field()
  distance!: number;

  @Field(() => [FeedDataForProfile])
  feeds!: FeedDataForProfile[];
}

@ObjectType()
export class DvinderProfileArray {
  @Field(() => [DvinderProfile])
  profiles!: DvinderProfile[];

  @Field(() => Boolean)
  hasMore!: boolean;
}

@ObjectType()
export class ViewResult {
  @Field(() => Boolean)
  success!: boolean;

  @Field(() => Boolean, { nullable: true })
  isMatch?: boolean;

  @Field(() => User, { nullable: true })
  matchedUser?: User;
}

@ObjectType()
export class MatchesResult {
  @Field(() => User)
  user!: User;

  @Field(() => Match)
  match!: Match;
}
