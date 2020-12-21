import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../config/types";
import { User } from "../entities/User";

@Resolver()
export class UserResolver {
  @Query(() => [User])
  users(@Ctx() { em }: MyContext): Promise<User[]> {
    return em.find(User, {});
  }

  @Query(() => User, { nullable: true })
  user(@Ctx() { em }: MyContext, @Arg("id") id: number): Promise<User | null> {
    return em.findOne(User, { id });
  }

  @Mutation(() => User)
  async registerUser(
    @Ctx() { em }: MyContext,
    @Arg("username") username: string,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User> {
    const user = em.create(User, {
      username,
      password,
      email,
    });
    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => User, { nullable: true })
  async updateUser(
    @Ctx() { em }: MyContext,
    @Arg("id") id: number,
    @Arg("email", () => String, { nullable: true }) email: string,
    @Arg("username", () => String, { nullable: true }) username: string
  ): Promise<User | null> {
    const user = await em.findOne(User, { id });
    if (!user) {
      return null;
    }
    if (email) user.email = email;
    if (username) user.username = username;

    await em.persistAndFlush(user);
    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Ctx() { em }: MyContext,
    @Arg("id") id: number
  ): Promise<boolean> {
    try {
      await em.nativeDelete(User, { id });
      return true;
    } catch (error) {
      return false;
    }
  }
}
