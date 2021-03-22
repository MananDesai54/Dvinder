import { FetchResult, MutationFunctionOptions } from "@apollo/client";
import { Exact, ViewProfileMutation } from "../generated/apollo-graphql";

export const reactToProfile = async (
  viewProfile: (
    options?:
      | MutationFunctionOptions<
          ViewProfileMutation,
          Exact<{
            liked: boolean;
            targetUserId: number;
          }>
        >
      | undefined
  ) => Promise<
    FetchResult<ViewProfileMutation, Record<string, any>, Record<string, any>>
  >,
  targetUserId: number,
  liked: boolean
) => {
  try {
    const response = await viewProfile({
      variables: {
        liked: liked,
        targetUserId: targetUserId,
      },
    });
    if (!response.data?.viewProfile.success) {
      console.log("Not able to react to profile");
    } else {
      console.log("reacted to profile", targetUserId, liked);
      console.log(response.data?.viewProfile);
    }
  } catch (error) {
    console.log(error.message);
  }
};
