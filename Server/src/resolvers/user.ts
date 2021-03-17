import argon2 from "argon2";
import fetch from "node-fetch";
import {
  Arg,
  Ctx,
  FieldResolver,
  Int,
  Mutation,
  Query,
  Resolver,
  Root,
  UseMiddleware,
} from "type-graphql";
import { getConnection } from "typeorm";
import { v4 as generateId } from "uuid";
import validator from "validator";
import {
  DvinderProfile,
  DvinderProfileArray,
  ErrorResponse,
  ErrorSuccessResponse,
  MoreUserData,
  MyContext,
  PlaceSearchResult,
  UserData,
  UserResponse,
} from "../config/types";
import { FORGET_PASSWORD_PREFIX } from "../constants";
import { Feed } from "../entities/Feed";
import { User } from "../entities/User";
import { View } from "../entities/View";
import { isAuth } from "../middleware/isAuth";
import { generateErrorResponse } from "../utils/generateErrorResponse";
import { getLatLongFromAddress } from "../utils/geoCodingAPI";
import { getUserGithubData } from "../utils/getUserGithubData";
import { sendMail } from "../utils/sendMail";
import { validateAddDetail } from "../utils/validationAddDetail";
import { validateRegister } from "../utils/validationRegister";

@Resolver(User)
export class UserResolver {
  @FieldResolver(() => String)
  email(@Root() user: User, @Ctx() { req }: MyContext) {
    // this current user and we can share email with them
    if (req.session.userId === user.id) {
      return user.email;
      // this is other user so don't share email
    } else {
      return "";
    }
  }

  @Query(() => User, { nullable: true })
  me(@Ctx() { req }: MyContext) {
    if (!req.session.userId) {
      return null;
    }
    try {
      return User.findOne(req.session.userId);
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }

  @Mutation(() => UserResponse)
  async registerUser(
    @Ctx() { req }: MyContext,
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

      const isEmailExist = await User.findOne({
        where: { email: userData.email },
      });
      const isUsernameExists = await User.findOne({
        where: {
          username: userData.username.toLowerCase(),
        },
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

      const user = await User.create({
        username: userData.username?.toLowerCase(),
        password: hashedPassword,
        email: userData.email,
      }).save();

      // using query builder
      // const result = await getConnection().createQueryBuilder().insert().into(User).values({
      //   username: userData.username?.toLowerCase(),
      //   password: hashedPassword,
      //   email: userData.email,
      // }).returning('*').execute()

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
  async registerWithGithub(
    @Ctx() { req }: MyContext,
    @Arg("code") code: string
  ): Promise<UserResponse | undefined> {
    try {
      const userData = await getUserGithubData(code);
      const userExist = await User.findOne({
        where: { githubId: userData.id },
      });
      if (userExist) {
        req.session.userId = userExist.id;

        return {
          success: true,
          user: userExist,
          message: "Done",
        };
      }
      const isEmailExists = await User.findOne({
        where: { email: userData.email },
      });
      if (isEmailExists) {
        return {
          errors: [generateErrorResponse("email", "Email already exists")],
          success: false,
        };
      }
      const isUsernameExists = await User.findOne({
        where: { username: userData.username.toLowerCase() },
      });

      const user = await User.create({
        email: userData.email,
        githubId: userData.id,
        profileUrl: userData.profileUrl,
        username: isUsernameExists
          ? `${userData.username}${userData.id}`.toLowerCase()
          : userData.username.toLowerCase(),
      }).save();

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

  @Mutation(() => UserResponse)
  async login(
    @Ctx() { req }: MyContext,
    @Arg("usernameOrEmail") usernameOrEmail: string,
    @Arg("password") password: string
  ): Promise<UserResponse> {
    try {
      const isEmail = validator.isEmail(usernameOrEmail);
      const user = await User.findOne({
        where: isEmail
          ? { email: usernameOrEmail }
          : { username: usernameOrEmail.toLowerCase() },
      });
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

  @Mutation(() => UserResponse)
  async loginWithGithub(
    @Ctx() { req }: MyContext,
    @Arg("code") code: string
  ): Promise<UserResponse> {
    try {
      const userData = await getUserGithubData(code);
      const user = await User.findOne({ where: { githubId: userData.id } });
      if (!user) {
        return {
          success: false,
          errors: [
            generateErrorResponse(
              "User",
              "You have not registered with Github yet"
            ),
          ],
        };
      }

      req.session.userId = user.id;

      return {
        success: true,
        user,
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
  @UseMiddleware(isAuth)
  async addMoreDetail(
    @Ctx() { req }: MyContext,
    @Arg("moreData") moreData: MoreUserData
  ): Promise<UserResponse> {
    try {
      const errors: ErrorResponse[] = validateAddDetail(moreData);

      if (errors.length > 0) {
        return {
          errors,
          success: false,
        };
      }

      const user = await User.findOne(req.session.userId);
      if (!user) {
        return {
          errors: [
            generateErrorResponse(
              "User",
              "Use not found, Please register/login"
            ),
          ],
        };
      }
      if (moreData.bio) user.bio = moreData.bio;
      if (moreData.flair) user.flair = moreData.flair;
      if (moreData.gender) user.gender = moreData.gender;
      if (moreData.maxAge) user.maxAge = moreData.maxAge;
      if (moreData.minAge) user.minAge = moreData.minAge;
      if (moreData.showMe) user.showMe = moreData.showMe;
      if (moreData.birthDate) user.birthDate = moreData.birthDate;
      if (moreData.lookingFor) user.lookingFor = moreData.lookingFor;
      if (moreData.address) user.address = moreData.address;

      const latLong = await getLatLongFromAddress(moreData.address as string);
      if (latLong) {
        user.latitude = latLong.results[0].geometry.location.lat;
        user.longitude = latLong.results[0].geometry.location.lng;
      }

      await user.save();

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

  @Mutation(() => ErrorSuccessResponse)
  @UseMiddleware(isAuth)
  async addOrUpdatePassword(
    @Ctx() { req }: MyContext,
    @Arg("password") password: string,
    @Arg("oldPassword", { nullable: true }) oldPassword: string
  ): Promise<ErrorSuccessResponse> {
    try {
      const user = await User.findOne(req.session.userId);
      if (!user) {
        return {
          success: false,
          message: "You need to be logged in",
          user: null,
        };
      }
      if (!user.password) {
        const hashedPassword = await argon2.hash(password);
        user.password = hashedPassword;
        await user.save();
        return {
          success: true,
          message: "",
          user,
        };
      }
      const isMatch = await argon2.verify(user.password, oldPassword!);
      if (!isMatch) {
        return {
          success: false,
          message: "Please provide correct old password",
          user: null,
        };
      }
      const hashedPassword = await argon2.hash(password);
      user.password = hashedPassword;
      return {
        success: true,
        message: "",
        user,
      };
    } catch (error) {
      console.log(error.message);
      return {
        success: false,
        message: error.message,
        user: null,
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
  async users(): Promise<User[] | null> {
    try {
      return User.find({});
    } catch (error) {
      console.log(error);
      return null;
    }
  }

  @Mutation(() => Boolean)
  async forgetPassword(
    @Arg("email") email: string,
    @Ctx() { redis }: MyContext
  ): Promise<boolean> {
    try {
      const user = await User.findOne({ where: { email } });
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
    @Ctx() { req, redis }: MyContext,
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
      const user = await User.findOne(+userId);
      if (!user) {
        return {
          errors: [generateErrorResponse("token", "User no longer exists")],
        };
      }

      await User.update(
        { id: +userId },
        { password: await argon2.hash(newPassword) }
      );

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
  @UseMiddleware(isAuth)
  async updateUser(
    @Arg("id") id: number,
    @Arg("email", () => String, { nullable: true }) email: string,
    @Arg("username", () => String, { nullable: true }) username: string
  ): Promise<User | null> {
    const user = await User.findOne(id);
    if (!user) {
      return null;
    }
    if (email) {
      user.email = email;
      await User.update({ id }, { email });
    }
    if (username) {
      user.username = username;
      await User.update({ id }, { username: username.toLowerCase() });
    }

    return user;
  }

  @Mutation(() => Boolean)
  async deleteUser(
    @Arg("id") id: number,
    @Ctx() { res }: MyContext
  ): Promise<boolean> {
    try {
      await User.delete(id);
      res.clearCookie(process.env.COOKIE_NAME);
      return true;
    } catch (error) {
      return false;
    }
  }

  @Mutation(() => PlaceSearchResult)
  async placeSearchAutoCorrect(
    @Arg("keyword") keyword: string
  ): Promise<PlaceSearchResult> {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/place/queryautocomplete/json?&key=${process.env.GOOGLE_API_KEY}&input=${keyword}`
      );
      const data = await response.json();
      return {
        status: data.status,
        predictions: data.predictions.map(
          (prediction: { description: string }) => prediction.description
        ),
      };
    } catch (error) {
      return {
        status: "error",
        predictions: [],
      };
    }
  }

  @Mutation(() => Boolean)
  @UseMiddleware(isAuth)
  async viewProfile(
    @Ctx() { req }: MyContext,
    @Arg("targetUserId") targetUserId: number,
    @Arg("liked") liked: boolean
  ): Promise<Boolean> {
    const { userId } = req.session;
    try {
      await View.create({
        liked,
        targetId: userId,
        viewerId: targetUserId,
      }).save();
      return true;
    } catch (error) {
      console.log(error.message);
      return false;
    }
  }

  @Mutation(() => DvinderProfileArray, { nullable: true })
  @UseMiddleware(isAuth)
  async dvinderProfile(
    @Arg("limit") limit: number,
    @Arg("cursor", () => Int, { nullable: true }) cursor?: number | null
  ): Promise<DvinderProfileArray | null> {
    const realLimit = Math.min(50, limit);
    const realLimitPlusOne = realLimit + 1;
    try {
      const replacements: any[] = [realLimitPlusOne];
      if (cursor) {
        replacements.push(cursor);
      } else {
        replacements.push(50);
      }
      const users: User[] = await getConnection().query(
        `
        select *
        from "user"
        where id < $2
        order by "createdAt" DESC
        limit $1
      `,
        replacements
      );
      let responseArray: DvinderProfile[] = [];

      await Promise.all(
        users.slice(0, realLimit).map(async (user) => {
          const feeds = await Feed.find({ where: { creatorId: user.id } });
          responseArray.push({
            bio: user.bio,
            profileUrl: user.profileUrl,
            username: user.username,
            githubUsername: user.githubId ? user.username : "",
            feeds: feeds.map((feed) => {
              return {
                title: feed.title,
                code: feed.code,
                imageUrl: feed.imageUrl,
                projectIdea: feed.projectIdea,
              };
            }),
          });
        })
      );

      return {
        profiles: responseArray,
        hasMore: users.length === realLimitPlusOne,
      };
    } catch (error) {
      console.log(error.message);
      return null;
    }
  }
}
