import { Arg, Ctx, Mutation, Query, Resolver } from "type-graphql";
import {
  ErrorResponse,
  MyContext,
  UserData,
  UserResponse,
  ValidationField,
} from "../config/types";
import { User } from "../entities/User";
import argon2 from "argon2";
import validator from "validator";
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
      const errors: ErrorResponse[] = [];
      const validations: ValidationField[] = [
        new ValidationField(
          validator.isEmail(userData.email),
          "Please enter valid email. i.e: abc@xyz.com",
          "email"
        ),
        new ValidationField(
          validator.isLength(userData.password, { min: 8, max: 32 }),
          "Length must be between 8-32.",
          "password"
        ),
        new ValidationField(
          validator.isLength(userData.username!, { min: 3 }),
          "Length must be greater than 2",
          "username"
        ),
      ];

      for (const validation of validations) {
        if (!validation.success) {
          errors.push(validation);
        }
      }

      if (errors.length > 0) {
        return {
          errors,
          success: false,
        };
      }

      const isEmailExist = await em.findOne(User, { email: userData.email });
      if (isEmailExist) {
        console.log("Already exist");
        return {
          errors: [
            {
              field: "email",
              message: "Email is already taken choose different one",
            },
          ],
          success: false,
        };
      }
      const hashedPassword = await argon2.hash(userData.password);

      const user = em.create(User, {
        username: userData.username,
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
    @Arg("authData") authData: UserData
  ): Promise<UserResponse> {
    try {
      const user = await em.findOne(User, { email: authData.email });
      if (!user) {
        return {
          errors: [
            {
              field: "email",
              message: "Account doesn't exist with this email.",
            },
          ],
          success: false,
        };
      }
      const isMatch = await argon2.verify(user.password, authData.password);
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
}
