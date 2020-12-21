import { Arg, Args, Ctx, Int, Mutation, Query, Resolver } from "type-graphql";
import { MyContext, UserData } from "../config/types";
import { User } from "../entities/User";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() context: MyContext): Promise<User[]> {
    return context.em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  user(
    @Ctx() context: MyContext,
    @Arg("id", () => Int) id: number
  ): Promise<User | null> {
    return context.em.findOne(User, { id });
  }

  @Mutation(() => User)
  registerUser(
    @Ctx() context: MyContext,
    @Arg("userData", () => User) userData: UserData
  ) {
    return "hh";
  }
}
