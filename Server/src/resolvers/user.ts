import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import { ErrorResponse, MyContext, UserData } from "../config/types";
import { User } from "../entities/User";
// import jwt from "jsonwebtoken";
import argon2 from "argon2";

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async login(
    @Ctx() { em }: MyContext,
    @Arg("email") email: string,
    @Arg("password") password: string
  ): Promise<User | ErrorResponse | null> {
    try {
      const user = await em.findOne(User, { email });
      if (!user) {
        // return {
        //   message: "Invalid credentials",
        //   success: false,
        //   statusCode: 400,
        // };
        return null;
      }
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        // return {
        //   message: "Invalid Credentials",
        //   success: false,
        //   statusCode: 400,
        // };
        return null;
      }

      return user;
    } catch (error) {
      console.log(error.message);
      // return {
      //   message: "Something went wrong",
      //   success: false,
      //   statusCode: 500,
      // };
      return null;
    }
  }

  @Mutation(() => User, { nullable: true })
  async registerUser(
    @Ctx() { em }: MyContext,
    @Arg("userData") userData: UserData
  ): Promise<User | ErrorResponse | null> {
    try {
      const isEmailExist = await em.findOne(User, { email: userData.email });
      if (isEmailExist) {
        console.log("Already exist");
        // return {
        //   message: "User with email already exist",
        //   success: false,
        //   statusCode: 400,
        // };
        return null;
      }
      const hashedPassword = await argon2.hash(userData.password);

      const user = em.create(User, {
        username: userData.username,
        password: hashedPassword,
        email: userData.email,
      });

      await em.persistAndFlush(user);
      return user;
    } catch (error) {
      console.log(error.message);
      // return {
      //   message: "Something went wrong",
      //   success: false,
      //   statusCode: 500,
      // };
      return null;
    }
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
