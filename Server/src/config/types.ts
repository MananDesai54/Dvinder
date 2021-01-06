import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { Field, InputType, ObjectType } from "type-graphql";
import { Feed } from "../entities/Feed";
import { User } from "../entities/User";

/**
 * Types and classes
 */
export type MyContext = {
  req: Request & {
    session: Session & Partial<SessionData> & { userId?: number };
  };
  res: Response;
  redis: Redis;
};

export class ValidationField {
  constructor(
    public success: boolean,
    public message: string,
    public field: string
  ) {}
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

  @Field(() => String, { nullable: true })
  username?: string;
}

@InputType()
export class FeedData {
  @Field()
  title!: string;

  @Field()
  imageUrl!: string;

  @Field()
  type!: "showcase" | "matches";
}

@InputType()
export class FeedUpdateData {
  @Field()
  title?: string;

  @Field()
  imageUrl?: string;

  @Field()
  id?: number;
}

/**
 * GraphQL Object types
 */
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
