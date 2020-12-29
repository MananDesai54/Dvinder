import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Request, Response } from "express";
import { Session, SessionData } from "express-session";
import { Redis } from "ioredis";
import { Field, InputType, ObjectType } from "type-graphql";
import { User } from "../entities/User";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
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

@InputType()
export class UserData {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field(() => String, { nullable: true })
  username?: string;
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
}
