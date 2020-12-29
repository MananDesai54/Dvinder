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
import { v4 as generateId } from "uuid";
import { FORGET_PASSWORD_PREFIX } from "../constants";
import { generateErrorResponse } from "../utils/generateErrorResponse";
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
          errors.push(
            generateErrorResponse(
              "email",
              "Email is already taken choose different one"
            )
          );
        }
        if (isUsernameExists) {
          errors.push(
            generateErrorResponse(
              "username",
              "Username is already taken choose different one"
            )
          );
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
        errors: [generateErrorResponse("Server Error", error.message)],
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
        isEmail
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail.toLowerCase() }
      );
      if (!user) {
        return {
          errors: [
            generateErrorResponse(
              "email",
              `Account doesn't exist with this ${
                isEmail ? "email" : "username"
              }.`
            ),
          ],
          success: false,
        };
      }
      const isMatch = await argon2.verify(user.password, password);
      if (!isMatch) {
        return {
          errors: [generateErrorResponse("password", "Invalid password.")],
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

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg("email") email: string,
    @Ctx() { em, redis }: MyContext
  ): Promise<boolean> {
    try {
      const user = await em.findOne(User, { email });
      if (!user) {
        console.log("User doesn't exist with this email.");
        return true;
      }

      const token = generateId();
      await redis.set(
        `${FORGET_PASSWORD_PREFIX}${token}`,
        user.id,
        "ex",
        1000 * 60 * 60 * 24 * 3
      );

      sendMail(
        email,
        `
        <a href="http://127.0.0.1:3000/change-password/${token}">Reset Password</a>
      `
      );

      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  @Mutation(() => UserResponse, { nullable: true })
  async changePassword(
    @Ctx() { em, req, redis }: MyContext,
    @Arg("newPassword") newPassword: string,
    @Arg("token") token: string
  ): Promise<UserResponse | null> {
    try {
      if (!validator.isLength(newPassword, { min: 8, max: 32 })) {
        return {
          errors: [
            generateErrorResponse(
              "newPassword",
              "Length must be between 8-32."
            ),
          ],
        };
      }

      const userId = await redis.get(`${FORGET_PASSWORD_PREFIX}${token}`);
      if (!userId) {
        console.log("Invalid token");
        return {
          errors: [
            generateErrorResponse(
              "token",
              "Reset link token is expired try again."
            ),
          ],
        };
      }
      const user = await em.findOne(User, { id: +userId });
      if (!user) {
        return {
          errors: [generateErrorResponse("token", "User no longer exists")],
        };
      }

      const hashedPassword = await argon2.hash(newPassword);
      user.password = hashedPassword;
      await em.persistAndFlush(user);

      //log user back in
      req.session.userId = user.id;
      await redis.del(`${FORGET_PASSWORD_PREFIX}${token}`);

      return {
        user,
        success: true,
      };
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
