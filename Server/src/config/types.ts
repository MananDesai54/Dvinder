import { Connection, EntityManager, IDatabaseDriver } from "@mikro-orm/core";
import { Field, InputType, ObjectType } from "type-graphql";

export type MyContext = {
  em: EntityManager<any> & EntityManager<IDatabaseDriver<Connection>>;
};

@InputType()
export class UserData {
  @Field()
  email!: string;

  @Field()
  password!: string;

  @Field()
  username!: string;
}

@ObjectType()
export class ErrorResponse {
  @Field(() => String)
  message!: string;

  @Field()
  success!: boolean;

  @Field()
  statusCode!: number;
}
