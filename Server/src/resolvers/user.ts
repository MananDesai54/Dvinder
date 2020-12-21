import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { MyContext } from "../config/types";
import { User } from "../entities/User";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async login(
    @Ctx() { em }: MyContext,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | null> {
    const user = await em.findOne(User, { email });
    if (!user) {
      return null;
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return null;
    }

    return user;
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

    const salt = await bcrypt.genSalt(12);
    const hash = await bcrypt.hash(user.password, salt);

    user.password = hash;

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
