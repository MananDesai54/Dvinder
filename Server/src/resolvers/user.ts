import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {
  ErrorResponse,
  MyContext,
  UserData,
  UserResponse,
  // ValidationField,
} from "../config/types";
import { User } from "../entities/User";
import argon2 from "argon2";
import validator from "validator";
import { sendMail } from "../utils/sendMail";
import { validateRegister } from "../utils/validationRegister";
// import { EntityManager } from '@mikro-orm/postgresql';

@Resolver()
export class UserResolver {
  @Query(() => User, { nullable: true })
  async me(@Ctx() { em, req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    try {
      const user = await em.findOne(User, { id: req.session.userId });
      return user;
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Ctx() { em, req }: MyContext,
    @Arg("userData") userData: UserData
  ): Promise<UserResponse> {
    try {
      const errors: ErrorResponse[] = validateRegister(userData);

      if (errors.length > 0) {
        return {
          errors,
          success: false,
        };
      }

      const isEmailExist = await em.findOne(User, { email: userData.email });
      const isUsernameExists = await em.findOne(User, {
        username: userData.username?.toLowerCase(),
      });

      if (isEmailExist || isUsernameExists) {
        console.log("Already exist");
        const errors: ErrorResponse[] = [];
        if (isEmailExist) {
          errors.push({
            field: "email",
            message: "Email is already taken choose different one",
          });
        }
        if (isUsernameExists) {
          errors.push({
            field: "username",
            message: "Username is already taken choose different one",
          });
        }
        return {
          errors,
          success: false,
        };
      }
      const hashedPassword = await argon2.hash(userData.password);

      const user = em.create(User, {
        username: userData.username?.toLowerCase(),
        password: hashedPassword,
        email: userData.email,
      });

      await em.persistAndFlush(user);
      // or queryBuilder
      // const [user] = await (em as EntityManager).createQueryBuilder(User).getKnexQuery().insert({
      //   username: userData.username,
      //   password: hashedPassword,
      //   email: userData.email,
      //   created_at: new Date(),
      //   updated_at: new Date(),
      // });

      /**
       * store userId in session
       * this will be keep stored in cookie
       * so we can keep then login
       */
      req.session.userId = user.id;

      return {
        user,
        success: true,
      };
    } catch (error) {
      console.log(error.message);
      return {
        errors: [
          {
            field: "Server error",
            message: error.message,
          },
        ],
        success: false,
      };
    }
  }

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { em, req }: MyContext,
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    try {
      const isEmail = validator.isEmail(usernameOrEmail);
      const user = await em.findOne(
        User,
        isEmail ? { email: usernameOrEmail } : { username: usernameOrEmail }
      );
      if (!user) {
        return {
          errors: [
            {
              field: "email",
              message: `Account doesn't exist with this ${
                isEmail ? "email" : "username"
              }.`,
            },
          ],
          success: false,
        };
      }
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return {
          errors: [
            {
              field: "password",
              message: "Invalid password.",
            },
          ],
          success: false,
        };
      }

      req.session.userId = user.id;

      return {
        user,
        success: true,
      };
    } catch (error) {
      console.log(error.message);
      return {
        errors: [
          {
            field: "Server error",
            message: "Something went wrong",
          },
        ],
        success: false,
      };
    }
  }

  @Mutation(() => Boolean)
  logout(@Ctx() { req, res }: MyContext): Promise<Boolean> {
    return new Promise((resolve) =>
      req.session.destroy((error) => {
        if (error) {
          console.log(error);
          return resolve(false);
        }
        res.clearCookie(process.env.COOKIE_NAME);
        return resolve(true);
      })
    );
  }

  @Query(() => [User], { nullable: true })
  async users(@Ctx() { em }: MyContext): Promise<User[] | null> {
    try {
      return em.find(User, {});
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => Boolean, { nullable: true })
  async forgotPassword(
    @Arg("email") email: string,
    @Ctx() { em, req }: MyContext
  ): Promise<boolean | null> {
    try {
      const user = await em.findOne(User, { email });
      if (!user) {
        console.log("User doesn't exist with this email.");
        return false;
      }
      console.log(req.body);
      sendMail(email, "");
      return true;
    } catch (error) {
      console.log(error.message);
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
