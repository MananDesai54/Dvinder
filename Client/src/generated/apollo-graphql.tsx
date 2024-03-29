import { gql } from '@apollo/client';
import * as Apollo from '@apollo/client';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export type Query = {
  __typename?: 'Query';
  me?: Maybe<User>;
  users?: Maybe<Array<User>>;
  dvinderProfile?: Maybe<DvinderProfileArray>;
  matches?: Maybe<Array<MatchesResult>>;
  feeds?: Maybe<FeedPagination>;
  userFeeds: Array<Feed>;
  otherUserFeeds: Array<Feed>;
  feed?: Maybe<Feed>;
};


export type QueryDvinderProfileArgs = {
  distance?: Maybe<Scalars['Int']>;
  limit: Scalars['Int'];
};


export type QueryFeedsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
};


export type QueryOtherUserFeedsArgs = {
  userId: Scalars['Float'];
};


export type QueryFeedArgs = {
  id: Scalars['Float'];
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  username: Scalars['String'];
  email: Scalars['String'];
  feeds: Array<Feed>;
  reactions: Array<Reaction>;
  profileUrl: Scalars['String'];
  githubId?: Maybe<Scalars['String']>;
  bio?: Maybe<Scalars['String']>;
  flair?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  showMe?: Maybe<Scalars['String']>;
  lookingFor?: Maybe<Scalars['String']>;
  minAge?: Maybe<Scalars['Int']>;
  maxAge?: Maybe<Scalars['Int']>;
  birthDate?: Maybe<Scalars['String']>;
  latitude?: Maybe<Scalars['Float']>;
  longitude?: Maybe<Scalars['Float']>;
  address?: Maybe<Scalars['String']>;
  numSwipes: Scalars['Int'];
  numSwipesToday: Scalars['Int'];
  numLikes: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Feed = {
  __typename?: 'Feed';
  id: Scalars['Int'];
  creator: User;
  voteStatus?: Maybe<Scalars['Int']>;
  creatorId: Scalars['Int'];
  title: Scalars['String'];
  type: Scalars['String'];
  points: Scalars['Int'];
  imageUrl?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  theme?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  projectIdea?: Maybe<Scalars['String']>;
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  imageUrlSlice: Scalars['String'];
};

export type Reaction = {
  __typename?: 'Reaction';
  id: Scalars['Int'];
  type: Scalars['String'];
  userId: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type DvinderProfileArray = {
  __typename?: 'DvinderProfileArray';
  profiles: Array<DvinderProfile>;
  hasMore: Scalars['Boolean'];
};

export type DvinderProfile = {
  __typename?: 'DvinderProfile';
  userId: Scalars['Int'];
  username: Scalars['String'];
  profileUrl: Scalars['String'];
  bio: Scalars['String'];
  githubUsername: Scalars['String'];
  birthDate: Scalars['String'];
  flair: Scalars['String'];
  distance: Scalars['Float'];
  feeds: Array<FeedDataForProfile>;
};

export type FeedDataForProfile = {
  __typename?: 'FeedDataForProfile';
  title: Scalars['String'];
  imageUrl?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  theme?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  projectIdea?: Maybe<Scalars['String']>;
};

export type MatchesResult = {
  __typename?: 'MatchesResult';
  user: User;
  match: Match;
};

export type Match = {
  __typename?: 'Match';
  id: Scalars['Int'];
  userId1: Scalars['Int'];
  userId2: Scalars['Int'];
  read1: Scalars['Boolean'];
  read2: Scalars['Boolean'];
  unmatched: Scalars['Boolean'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type FeedPagination = {
  __typename?: 'FeedPagination';
  feeds: Array<Feed>;
  hasMore: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerUser: UserResponse;
  registerWithGithub: UserResponse;
  login: UserResponse;
  loginWithGithub: UserResponse;
  addMoreDetail: UserResponse;
  addOrUpdatePassword: ErrorSuccessResponse;
  logout: Scalars['Boolean'];
  forgetPassword: Scalars['Boolean'];
  changePassword?: Maybe<UserResponse>;
  updateUser?: Maybe<User>;
  deleteUser: Scalars['Boolean'];
  placeSearchAutoCorrect: PlaceSearchResult;
  viewProfile: ViewResult;
  createFeed: FeedResponse;
  updateFeed: FeedResponse;
  deleteFeed: Scalars['Boolean'];
  vote: Scalars['Boolean'];
  messages?: Maybe<Array<Message>>;
};


export type MutationRegisterUserArgs = {
  userData: UserData;
};


export type MutationRegisterWithGithubArgs = {
  code: Scalars['String'];
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
};


export type MutationLoginWithGithubArgs = {
  code: Scalars['String'];
};


export type MutationAddMoreDetailArgs = {
  moreData: MoreUserData;
};


export type MutationAddOrUpdatePasswordArgs = {
  oldPassword?: Maybe<Scalars['String']>;
  password: Scalars['String'];
};


export type MutationForgetPasswordArgs = {
  email: Scalars['String'];
};


export type MutationChangePasswordArgs = {
  token: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationUpdateUserArgs = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Float'];
};


export type MutationPlaceSearchAutoCorrectArgs = {
  keyword: Scalars['String'];
};


export type MutationViewProfileArgs = {
  liked: Scalars['Boolean'];
  targetUserId: Scalars['Int'];
};


export type MutationCreateFeedArgs = {
  file?: Maybe<Scalars['Upload']>;
  feedData: FeedData;
};


export type MutationUpdateFeedArgs = {
  feedData: FeedUpdateData;
};


export type MutationDeleteFeedArgs = {
  id: Scalars['Float'];
};


export type MutationVoteArgs = {
  value: Scalars['Int'];
  feedId: Scalars['Int'];
};


export type MutationMessagesArgs = {
  matchId: Scalars['Int'];
};

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<ErrorResponse>>;
  user?: Maybe<User>;
  success: Scalars['Boolean'];
  message?: Maybe<Scalars['String']>;
};

export type ErrorResponse = {
  __typename?: 'ErrorResponse';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserData = {
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
};

export type MoreUserData = {
  bio?: Maybe<Scalars['String']>;
  flair?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  showMe?: Maybe<Scalars['String']>;
  minAge?: Maybe<Scalars['Int']>;
  maxAge?: Maybe<Scalars['Int']>;
  birthDate?: Maybe<Scalars['String']>;
  lookingFor?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
};

export type ErrorSuccessResponse = {
  __typename?: 'ErrorSuccessResponse';
  success: Scalars['Boolean'];
  message: Scalars['String'];
  user?: Maybe<User>;
};

export type PlaceSearchResult = {
  __typename?: 'PlaceSearchResult';
  status: Scalars['String'];
  predictions: Array<Scalars['String']>;
};

export type ViewResult = {
  __typename?: 'ViewResult';
  success: Scalars['Boolean'];
  isMatch?: Maybe<Scalars['Boolean']>;
  matchedUser?: Maybe<User>;
};

export type FeedResponse = {
  __typename?: 'FeedResponse';
  errors?: Maybe<Array<ErrorResponse>>;
  feed?: Maybe<Feed>;
  feeds?: Maybe<Array<Feed>>;
};


export type FeedData = {
  title: Scalars['String'];
  type: Scalars['String'];
  code?: Maybe<Scalars['String']>;
  theme?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  projectIdea?: Maybe<Scalars['String']>;
};

export type FeedUpdateData = {
  title?: Maybe<Scalars['String']>;
  imageUrl?: Maybe<Scalars['String']>;
  code?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
  projectIdea?: Maybe<Scalars['String']>;
};

export type Message = {
  __typename?: 'Message';
  id: Scalars['Int'];
  matchId: Scalars['Int'];
  senderId: Scalars['Int'];
  recipientId: Scalars['Int'];
  text: Scalars['String'];
  createdAt: Scalars['String'];
};

export type RegularErrorFragment = (
  { __typename?: 'ErrorResponse' }
  & Pick<ErrorResponse, 'field' | 'message'>
);

export type RegularFeedFragment = (
  { __typename?: 'Feed' }
  & Pick<Feed, 'creatorId' | 'title' | 'imageUrl' | 'code' | 'theme' | 'language' | 'projectIdea' | 'points' | 'id' | 'createdAt' | 'updatedAt' | 'voteStatus'>
  & { creator: (
    { __typename?: 'User' }
    & Pick<User, 'username' | 'id'>
  ) }
);

export type RegularFeedResponseFragment = (
  { __typename?: 'FeedResponse' }
  & { feed?: Maybe<(
    { __typename?: 'Feed' }
    & RegularFeedFragment
  )>, errors?: Maybe<Array<(
    { __typename?: 'ErrorResponse' }
    & RegularErrorFragment
  )>> }
);

export type RegularUserFragment = (
  { __typename?: 'User' }
  & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt' | 'profileUrl' | 'bio' | 'flair' | 'gender' | 'showMe' | 'minAge' | 'maxAge' | 'githubId' | 'birthDate' | 'lookingFor' | 'address' | 'latitude' | 'longitude'>
);

export type RegularUserResponseFragment = (
  { __typename?: 'UserResponse' }
  & { user?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )>, errors?: Maybe<Array<(
    { __typename?: 'ErrorResponse' }
    & RegularErrorFragment
  )>> }
);

export type AddMoreDetailMutationVariables = Exact<{
  bio?: Maybe<Scalars['String']>;
  flair?: Maybe<Scalars['String']>;
  gender?: Maybe<Scalars['String']>;
  maxAge?: Maybe<Scalars['Int']>;
  minAge?: Maybe<Scalars['Int']>;
  showMe?: Maybe<Scalars['String']>;
  birthDate?: Maybe<Scalars['String']>;
  lookingFor?: Maybe<Scalars['String']>;
  address?: Maybe<Scalars['String']>;
}>;


export type AddMoreDetailMutation = (
  { __typename?: 'Mutation' }
  & { addMoreDetail: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'success' | 'message'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )>, errors?: Maybe<Array<(
      { __typename?: 'ErrorResponse' }
      & RegularErrorFragment
    )>> }
  ) }
);

export type AddOrUpdatePasswordMutationVariables = Exact<{
  password: Scalars['String'];
  oldPassword?: Maybe<Scalars['String']>;
}>;


export type AddOrUpdatePasswordMutation = (
  { __typename?: 'Mutation' }
  & { addOrUpdatePassword: (
    { __typename?: 'ErrorSuccessResponse' }
    & Pick<ErrorSuccessResponse, 'success' | 'message'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & RegularUserFragment
    )> }
  ) }
);

export type ChangePasswordMutationVariables = Exact<{
  token: Scalars['String'];
  newPassword: Scalars['String'];
}>;


export type ChangePasswordMutation = (
  { __typename?: 'Mutation' }
  & { changePassword?: Maybe<(
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  )> }
);

export type CreateFeedMutationVariables = Exact<{
  title: Scalars['String'];
  type: Scalars['String'];
  code?: Maybe<Scalars['String']>;
  theme?: Maybe<Scalars['String']>;
  language?: Maybe<Scalars['String']>;
  projectIdea?: Maybe<Scalars['String']>;
  file?: Maybe<Scalars['Upload']>;
}>;


export type CreateFeedMutation = (
  { __typename?: 'Mutation' }
  & { createFeed: (
    { __typename?: 'FeedResponse' }
    & { feed?: Maybe<(
      { __typename?: 'Feed' }
      & Pick<Feed, 'creatorId' | 'title' | 'imageUrl' | 'id' | 'createdAt' | 'updatedAt' | 'type' | 'code' | 'theme' | 'language' | 'projectIdea'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'ErrorResponse' }
      & Pick<ErrorResponse, 'field' | 'message'>
    )>> }
  ) }
);

export type DeleteUserMutationVariables = Exact<{
  id: Scalars['Float'];
}>;


export type DeleteUserMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'deleteUser'>
);

export type ForgetPasswordMutationVariables = Exact<{
  email: Scalars['String'];
}>;


export type ForgetPasswordMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'forgetPassword'>
);

export type LoginMutationVariables = Exact<{
  usernameOrEmail: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type LoginWithGithubMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type LoginWithGithubMutation = (
  { __typename?: 'Mutation' }
  & { loginWithGithub: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'success'>
    & RegularUserResponseFragment
  ) }
);

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
);

export type MessagesMutationVariables = Exact<{
  matchId: Scalars['Int'];
}>;


export type MessagesMutation = (
  { __typename?: 'Mutation' }
  & { messages?: Maybe<Array<(
    { __typename?: 'Message' }
    & Pick<Message, 'text' | 'matchId' | 'senderId' | 'recipientId' | 'createdAt'>
  )>> }
);

export type PlaceSearchAutoCorrectMutationVariables = Exact<{
  keyword: Scalars['String'];
}>;


export type PlaceSearchAutoCorrectMutation = (
  { __typename?: 'Mutation' }
  & { placeSearchAutoCorrect: (
    { __typename?: 'PlaceSearchResult' }
    & Pick<PlaceSearchResult, 'status' | 'predictions'>
  ) }
);

export type RegisterMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
  username: Scalars['String'];
}>;


export type RegisterMutation = (
  { __typename?: 'Mutation' }
  & { registerUser: (
    { __typename?: 'UserResponse' }
    & RegularUserResponseFragment
  ) }
);

export type RegisterWithGithubMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type RegisterWithGithubMutation = (
  { __typename?: 'Mutation' }
  & { registerWithGithub: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'message'>
    & RegularUserResponseFragment
  ) }
);

export type ViewProfileMutationVariables = Exact<{
  liked: Scalars['Boolean'];
  targetUserId: Scalars['Int'];
}>;


export type ViewProfileMutation = (
  { __typename?: 'Mutation' }
  & { viewProfile: (
    { __typename?: 'ViewResult' }
    & Pick<ViewResult, 'success' | 'isMatch'>
    & { matchedUser?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username'>
    )> }
  ) }
);

export type VoteMutationVariables = Exact<{
  value: Scalars['Int'];
  feedId: Scalars['Int'];
}>;


export type VoteMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'vote'>
);

export type DvinderProfileQueryVariables = Exact<{
  limit: Scalars['Int'];
  distance?: Maybe<Scalars['Int']>;
}>;


export type DvinderProfileQuery = (
  { __typename?: 'Query' }
  & { dvinderProfile?: Maybe<(
    { __typename?: 'DvinderProfileArray' }
    & Pick<DvinderProfileArray, 'hasMore'>
    & { profiles: Array<(
      { __typename?: 'DvinderProfile' }
      & Pick<DvinderProfile, 'userId' | 'username' | 'profileUrl' | 'bio' | 'githubUsername' | 'birthDate' | 'flair' | 'distance'>
      & { feeds: Array<(
        { __typename?: 'FeedDataForProfile' }
        & Pick<FeedDataForProfile, 'title' | 'imageUrl' | 'code' | 'projectIdea' | 'theme' | 'language'>
      )> }
    )> }
  )> }
);

export type FeedsQueryVariables = Exact<{
  limit: Scalars['Int'];
  cursor?: Maybe<Scalars['String']>;
}>;


export type FeedsQuery = (
  { __typename?: 'Query' }
  & { feeds?: Maybe<(
    { __typename?: 'FeedPagination' }
    & Pick<FeedPagination, 'hasMore'>
    & { feeds: Array<(
      { __typename?: 'Feed' }
      & RegularFeedFragment
    )> }
  )> }
);

export type MatchesQueryVariables = Exact<{ [key: string]: never; }>;


export type MatchesQuery = (
  { __typename?: 'Query' }
  & { matches?: Maybe<Array<(
    { __typename?: 'MatchesResult' }
    & { user: (
      { __typename?: 'User' }
      & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt' | 'profileUrl' | 'bio' | 'flair' | 'gender' | 'showMe' | 'minAge' | 'maxAge' | 'githubId' | 'birthDate' | 'lookingFor' | 'address' | 'latitude' | 'longitude'>
    ), match: (
      { __typename?: 'Match' }
      & Pick<Match, 'id' | 'userId1' | 'userId2' | 'read1' | 'read2' | 'unmatched' | 'createdAt'>
    ) }
  )>> }
);

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
  )> }
);

export type UserFeedsQueryVariables = Exact<{ [key: string]: never; }>;


export type UserFeedsQuery = (
  { __typename?: 'Query' }
  & { userFeeds: Array<(
    { __typename?: 'Feed' }
    & RegularFeedFragment
  )> }
);

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = (
  { __typename?: 'Query' }
  & { users?: Maybe<Array<(
    { __typename?: 'User' }
    & RegularUserFragment
  )>> }
);

export const RegularFeedFragmentDoc = gql`
    fragment RegularFeed on Feed {
  creatorId
  title
  imageUrl
  code
  theme
  language
  projectIdea
  points
  id
  createdAt
  updatedAt
  voteStatus
  creator {
    username
    id
  }
}
    `;
export const RegularErrorFragmentDoc = gql`
    fragment RegularError on ErrorResponse {
  field
  message
}
    `;
export const RegularFeedResponseFragmentDoc = gql`
    fragment RegularFeedResponse on FeedResponse {
  feed {
    ...RegularFeed
  }
  errors {
    ...RegularError
  }
}
    ${RegularFeedFragmentDoc}
${RegularErrorFragmentDoc}`;
export const RegularUserFragmentDoc = gql`
    fragment RegularUser on User {
  id
  username
  email
  createdAt
  updatedAt
  profileUrl
  bio
  flair
  gender
  showMe
  minAge
  maxAge
  githubId
  birthDate
  lookingFor
  address
  latitude
  longitude
}
    `;
export const RegularUserResponseFragmentDoc = gql`
    fragment RegularUserResponse on UserResponse {
  user {
    ...RegularUser
  }
  errors {
    ...RegularError
  }
}
    ${RegularUserFragmentDoc}
${RegularErrorFragmentDoc}`;
export const AddMoreDetailDocument = gql`
    mutation AddMoreDetail($bio: String, $flair: String, $gender: String, $maxAge: Int, $minAge: Int, $showMe: String, $birthDate: String, $lookingFor: String, $address: String) {
  addMoreDetail(
    moreData: {bio: $bio, flair: $flair, gender: $gender, maxAge: $maxAge, minAge: $minAge, showMe: $showMe, birthDate: $birthDate, lookingFor: $lookingFor, address: $address}
  ) {
    success
    message
    user {
      ...RegularUser
    }
    errors {
      ...RegularError
    }
  }
}
    ${RegularUserFragmentDoc}
${RegularErrorFragmentDoc}`;
export type AddMoreDetailMutationFn = Apollo.MutationFunction<AddMoreDetailMutation, AddMoreDetailMutationVariables>;

/**
 * __useAddMoreDetailMutation__
 *
 * To run a mutation, you first call `useAddMoreDetailMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddMoreDetailMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addMoreDetailMutation, { data, loading, error }] = useAddMoreDetailMutation({
 *   variables: {
 *      bio: // value for 'bio'
 *      flair: // value for 'flair'
 *      gender: // value for 'gender'
 *      maxAge: // value for 'maxAge'
 *      minAge: // value for 'minAge'
 *      showMe: // value for 'showMe'
 *      birthDate: // value for 'birthDate'
 *      lookingFor: // value for 'lookingFor'
 *      address: // value for 'address'
 *   },
 * });
 */
export function useAddMoreDetailMutation(baseOptions?: Apollo.MutationHookOptions<AddMoreDetailMutation, AddMoreDetailMutationVariables>) {
        return Apollo.useMutation<AddMoreDetailMutation, AddMoreDetailMutationVariables>(AddMoreDetailDocument, baseOptions);
      }
export type AddMoreDetailMutationHookResult = ReturnType<typeof useAddMoreDetailMutation>;
export type AddMoreDetailMutationResult = Apollo.MutationResult<AddMoreDetailMutation>;
export type AddMoreDetailMutationOptions = Apollo.BaseMutationOptions<AddMoreDetailMutation, AddMoreDetailMutationVariables>;
export const AddOrUpdatePasswordDocument = gql`
    mutation AddOrUpdatePassword($password: String!, $oldPassword: String) {
  addOrUpdatePassword(password: $password, oldPassword: $oldPassword) {
    success
    message
    user {
      ...RegularUser
    }
  }
}
    ${RegularUserFragmentDoc}`;
export type AddOrUpdatePasswordMutationFn = Apollo.MutationFunction<AddOrUpdatePasswordMutation, AddOrUpdatePasswordMutationVariables>;

/**
 * __useAddOrUpdatePasswordMutation__
 *
 * To run a mutation, you first call `useAddOrUpdatePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useAddOrUpdatePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [addOrUpdatePasswordMutation, { data, loading, error }] = useAddOrUpdatePasswordMutation({
 *   variables: {
 *      password: // value for 'password'
 *      oldPassword: // value for 'oldPassword'
 *   },
 * });
 */
export function useAddOrUpdatePasswordMutation(baseOptions?: Apollo.MutationHookOptions<AddOrUpdatePasswordMutation, AddOrUpdatePasswordMutationVariables>) {
        return Apollo.useMutation<AddOrUpdatePasswordMutation, AddOrUpdatePasswordMutationVariables>(AddOrUpdatePasswordDocument, baseOptions);
      }
export type AddOrUpdatePasswordMutationHookResult = ReturnType<typeof useAddOrUpdatePasswordMutation>;
export type AddOrUpdatePasswordMutationResult = Apollo.MutationResult<AddOrUpdatePasswordMutation>;
export type AddOrUpdatePasswordMutationOptions = Apollo.BaseMutationOptions<AddOrUpdatePasswordMutation, AddOrUpdatePasswordMutationVariables>;
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type ChangePasswordMutationFn = Apollo.MutationFunction<ChangePasswordMutation, ChangePasswordMutationVariables>;

/**
 * __useChangePasswordMutation__
 *
 * To run a mutation, you first call `useChangePasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useChangePasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [changePasswordMutation, { data, loading, error }] = useChangePasswordMutation({
 *   variables: {
 *      token: // value for 'token'
 *      newPassword: // value for 'newPassword'
 *   },
 * });
 */
export function useChangePasswordMutation(baseOptions?: Apollo.MutationHookOptions<ChangePasswordMutation, ChangePasswordMutationVariables>) {
        return Apollo.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument, baseOptions);
      }
export type ChangePasswordMutationHookResult = ReturnType<typeof useChangePasswordMutation>;
export type ChangePasswordMutationResult = Apollo.MutationResult<ChangePasswordMutation>;
export type ChangePasswordMutationOptions = Apollo.BaseMutationOptions<ChangePasswordMutation, ChangePasswordMutationVariables>;
export const CreateFeedDocument = gql`
    mutation CreateFeed($title: String!, $type: String!, $code: String, $theme: String, $language: String, $projectIdea: String, $file: Upload) {
  createFeed(
    feedData: {title: $title, type: $type, code: $code, theme: $theme, language: $language, projectIdea: $projectIdea}
    file: $file
  ) {
    feed {
      creatorId
      title
      imageUrl
      id
      createdAt
      updatedAt
      type
      code
      theme
      language
      projectIdea
    }
    errors {
      field
      message
    }
  }
}
    `;
export type CreateFeedMutationFn = Apollo.MutationFunction<CreateFeedMutation, CreateFeedMutationVariables>;

/**
 * __useCreateFeedMutation__
 *
 * To run a mutation, you first call `useCreateFeedMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useCreateFeedMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [createFeedMutation, { data, loading, error }] = useCreateFeedMutation({
 *   variables: {
 *      title: // value for 'title'
 *      type: // value for 'type'
 *      code: // value for 'code'
 *      theme: // value for 'theme'
 *      language: // value for 'language'
 *      projectIdea: // value for 'projectIdea'
 *      file: // value for 'file'
 *   },
 * });
 */
export function useCreateFeedMutation(baseOptions?: Apollo.MutationHookOptions<CreateFeedMutation, CreateFeedMutationVariables>) {
        return Apollo.useMutation<CreateFeedMutation, CreateFeedMutationVariables>(CreateFeedDocument, baseOptions);
      }
export type CreateFeedMutationHookResult = ReturnType<typeof useCreateFeedMutation>;
export type CreateFeedMutationResult = Apollo.MutationResult<CreateFeedMutation>;
export type CreateFeedMutationOptions = Apollo.BaseMutationOptions<CreateFeedMutation, CreateFeedMutationVariables>;
export const DeleteUserDocument = gql`
    mutation DeleteUser($id: Float!) {
  deleteUser(id: $id)
}
    `;
export type DeleteUserMutationFn = Apollo.MutationFunction<DeleteUserMutation, DeleteUserMutationVariables>;

/**
 * __useDeleteUserMutation__
 *
 * To run a mutation, you first call `useDeleteUserMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useDeleteUserMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [deleteUserMutation, { data, loading, error }] = useDeleteUserMutation({
 *   variables: {
 *      id: // value for 'id'
 *   },
 * });
 */
export function useDeleteUserMutation(baseOptions?: Apollo.MutationHookOptions<DeleteUserMutation, DeleteUserMutationVariables>) {
        return Apollo.useMutation<DeleteUserMutation, DeleteUserMutationVariables>(DeleteUserDocument, baseOptions);
      }
export type DeleteUserMutationHookResult = ReturnType<typeof useDeleteUserMutation>;
export type DeleteUserMutationResult = Apollo.MutationResult<DeleteUserMutation>;
export type DeleteUserMutationOptions = Apollo.BaseMutationOptions<DeleteUserMutation, DeleteUserMutationVariables>;
export const ForgetPasswordDocument = gql`
    mutation ForgetPassword($email: String!) {
  forgetPassword(email: $email)
}
    `;
export type ForgetPasswordMutationFn = Apollo.MutationFunction<ForgetPasswordMutation, ForgetPasswordMutationVariables>;

/**
 * __useForgetPasswordMutation__
 *
 * To run a mutation, you first call `useForgetPasswordMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useForgetPasswordMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [forgetPasswordMutation, { data, loading, error }] = useForgetPasswordMutation({
 *   variables: {
 *      email: // value for 'email'
 *   },
 * });
 */
export function useForgetPasswordMutation(baseOptions?: Apollo.MutationHookOptions<ForgetPasswordMutation, ForgetPasswordMutationVariables>) {
        return Apollo.useMutation<ForgetPasswordMutation, ForgetPasswordMutationVariables>(ForgetPasswordDocument, baseOptions);
      }
export type ForgetPasswordMutationHookResult = ReturnType<typeof useForgetPasswordMutation>;
export type ForgetPasswordMutationResult = Apollo.MutationResult<ForgetPasswordMutation>;
export type ForgetPasswordMutationOptions = Apollo.BaseMutationOptions<ForgetPasswordMutation, ForgetPasswordMutationVariables>;
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(password: $password, usernameOrEmail: $usernameOrEmail) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginMutationFn = Apollo.MutationFunction<LoginMutation, LoginMutationVariables>;

/**
 * __useLoginMutation__
 *
 * To run a mutation, you first call `useLoginMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginMutation, { data, loading, error }] = useLoginMutation({
 *   variables: {
 *      usernameOrEmail: // value for 'usernameOrEmail'
 *      password: // value for 'password'
 *   },
 * });
 */
export function useLoginMutation(baseOptions?: Apollo.MutationHookOptions<LoginMutation, LoginMutationVariables>) {
        return Apollo.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument, baseOptions);
      }
export type LoginMutationHookResult = ReturnType<typeof useLoginMutation>;
export type LoginMutationResult = Apollo.MutationResult<LoginMutation>;
export type LoginMutationOptions = Apollo.BaseMutationOptions<LoginMutation, LoginMutationVariables>;
export const LoginWithGithubDocument = gql`
    mutation LoginWithGithub($code: String!) {
  loginWithGithub(code: $code) {
    ...RegularUserResponse
    success
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type LoginWithGithubMutationFn = Apollo.MutationFunction<LoginWithGithubMutation, LoginWithGithubMutationVariables>;

/**
 * __useLoginWithGithubMutation__
 *
 * To run a mutation, you first call `useLoginWithGithubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLoginWithGithubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [loginWithGithubMutation, { data, loading, error }] = useLoginWithGithubMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useLoginWithGithubMutation(baseOptions?: Apollo.MutationHookOptions<LoginWithGithubMutation, LoginWithGithubMutationVariables>) {
        return Apollo.useMutation<LoginWithGithubMutation, LoginWithGithubMutationVariables>(LoginWithGithubDocument, baseOptions);
      }
export type LoginWithGithubMutationHookResult = ReturnType<typeof useLoginWithGithubMutation>;
export type LoginWithGithubMutationResult = Apollo.MutationResult<LoginWithGithubMutation>;
export type LoginWithGithubMutationOptions = Apollo.BaseMutationOptions<LoginWithGithubMutation, LoginWithGithubMutationVariables>;
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;
export type LogoutMutationFn = Apollo.MutationFunction<LogoutMutation, LogoutMutationVariables>;

/**
 * __useLogoutMutation__
 *
 * To run a mutation, you first call `useLogoutMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useLogoutMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [logoutMutation, { data, loading, error }] = useLogoutMutation({
 *   variables: {
 *   },
 * });
 */
export function useLogoutMutation(baseOptions?: Apollo.MutationHookOptions<LogoutMutation, LogoutMutationVariables>) {
        return Apollo.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument, baseOptions);
      }
export type LogoutMutationHookResult = ReturnType<typeof useLogoutMutation>;
export type LogoutMutationResult = Apollo.MutationResult<LogoutMutation>;
export type LogoutMutationOptions = Apollo.BaseMutationOptions<LogoutMutation, LogoutMutationVariables>;
export const MessagesDocument = gql`
    mutation Messages($matchId: Int!) {
  messages(matchId: $matchId) {
    text
    matchId
    senderId
    recipientId
    createdAt
  }
}
    `;
export type MessagesMutationFn = Apollo.MutationFunction<MessagesMutation, MessagesMutationVariables>;

/**
 * __useMessagesMutation__
 *
 * To run a mutation, you first call `useMessagesMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useMessagesMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [messagesMutation, { data, loading, error }] = useMessagesMutation({
 *   variables: {
 *      matchId: // value for 'matchId'
 *   },
 * });
 */
export function useMessagesMutation(baseOptions?: Apollo.MutationHookOptions<MessagesMutation, MessagesMutationVariables>) {
        return Apollo.useMutation<MessagesMutation, MessagesMutationVariables>(MessagesDocument, baseOptions);
      }
export type MessagesMutationHookResult = ReturnType<typeof useMessagesMutation>;
export type MessagesMutationResult = Apollo.MutationResult<MessagesMutation>;
export type MessagesMutationOptions = Apollo.BaseMutationOptions<MessagesMutation, MessagesMutationVariables>;
export const PlaceSearchAutoCorrectDocument = gql`
    mutation PlaceSearchAutoCorrect($keyword: String!) {
  placeSearchAutoCorrect(keyword: $keyword) {
    status
    predictions
  }
}
    `;
export type PlaceSearchAutoCorrectMutationFn = Apollo.MutationFunction<PlaceSearchAutoCorrectMutation, PlaceSearchAutoCorrectMutationVariables>;

/**
 * __usePlaceSearchAutoCorrectMutation__
 *
 * To run a mutation, you first call `usePlaceSearchAutoCorrectMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `usePlaceSearchAutoCorrectMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [placeSearchAutoCorrectMutation, { data, loading, error }] = usePlaceSearchAutoCorrectMutation({
 *   variables: {
 *      keyword: // value for 'keyword'
 *   },
 * });
 */
export function usePlaceSearchAutoCorrectMutation(baseOptions?: Apollo.MutationHookOptions<PlaceSearchAutoCorrectMutation, PlaceSearchAutoCorrectMutationVariables>) {
        return Apollo.useMutation<PlaceSearchAutoCorrectMutation, PlaceSearchAutoCorrectMutationVariables>(PlaceSearchAutoCorrectDocument, baseOptions);
      }
export type PlaceSearchAutoCorrectMutationHookResult = ReturnType<typeof usePlaceSearchAutoCorrectMutation>;
export type PlaceSearchAutoCorrectMutationResult = Apollo.MutationResult<PlaceSearchAutoCorrectMutation>;
export type PlaceSearchAutoCorrectMutationOptions = Apollo.BaseMutationOptions<PlaceSearchAutoCorrectMutation, PlaceSearchAutoCorrectMutationVariables>;
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $username: String!) {
  registerUser(
    userData: {email: $email, password: $password, username: $username}
  ) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterMutationFn = Apollo.MutationFunction<RegisterMutation, RegisterMutationVariables>;

/**
 * __useRegisterMutation__
 *
 * To run a mutation, you first call `useRegisterMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerMutation, { data, loading, error }] = useRegisterMutation({
 *   variables: {
 *      email: // value for 'email'
 *      password: // value for 'password'
 *      username: // value for 'username'
 *   },
 * });
 */
export function useRegisterMutation(baseOptions?: Apollo.MutationHookOptions<RegisterMutation, RegisterMutationVariables>) {
        return Apollo.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument, baseOptions);
      }
export type RegisterMutationHookResult = ReturnType<typeof useRegisterMutation>;
export type RegisterMutationResult = Apollo.MutationResult<RegisterMutation>;
export type RegisterMutationOptions = Apollo.BaseMutationOptions<RegisterMutation, RegisterMutationVariables>;
export const RegisterWithGithubDocument = gql`
    mutation RegisterWithGithub($code: String!) {
  registerWithGithub(code: $code) {
    ...RegularUserResponse
    message
  }
}
    ${RegularUserResponseFragmentDoc}`;
export type RegisterWithGithubMutationFn = Apollo.MutationFunction<RegisterWithGithubMutation, RegisterWithGithubMutationVariables>;

/**
 * __useRegisterWithGithubMutation__
 *
 * To run a mutation, you first call `useRegisterWithGithubMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useRegisterWithGithubMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [registerWithGithubMutation, { data, loading, error }] = useRegisterWithGithubMutation({
 *   variables: {
 *      code: // value for 'code'
 *   },
 * });
 */
export function useRegisterWithGithubMutation(baseOptions?: Apollo.MutationHookOptions<RegisterWithGithubMutation, RegisterWithGithubMutationVariables>) {
        return Apollo.useMutation<RegisterWithGithubMutation, RegisterWithGithubMutationVariables>(RegisterWithGithubDocument, baseOptions);
      }
export type RegisterWithGithubMutationHookResult = ReturnType<typeof useRegisterWithGithubMutation>;
export type RegisterWithGithubMutationResult = Apollo.MutationResult<RegisterWithGithubMutation>;
export type RegisterWithGithubMutationOptions = Apollo.BaseMutationOptions<RegisterWithGithubMutation, RegisterWithGithubMutationVariables>;
export const ViewProfileDocument = gql`
    mutation ViewProfile($liked: Boolean!, $targetUserId: Int!) {
  viewProfile(liked: $liked, targetUserId: $targetUserId) {
    success
    isMatch
    matchedUser {
      username
    }
  }
}
    `;
export type ViewProfileMutationFn = Apollo.MutationFunction<ViewProfileMutation, ViewProfileMutationVariables>;

/**
 * __useViewProfileMutation__
 *
 * To run a mutation, you first call `useViewProfileMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useViewProfileMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [viewProfileMutation, { data, loading, error }] = useViewProfileMutation({
 *   variables: {
 *      liked: // value for 'liked'
 *      targetUserId: // value for 'targetUserId'
 *   },
 * });
 */
export function useViewProfileMutation(baseOptions?: Apollo.MutationHookOptions<ViewProfileMutation, ViewProfileMutationVariables>) {
        return Apollo.useMutation<ViewProfileMutation, ViewProfileMutationVariables>(ViewProfileDocument, baseOptions);
      }
export type ViewProfileMutationHookResult = ReturnType<typeof useViewProfileMutation>;
export type ViewProfileMutationResult = Apollo.MutationResult<ViewProfileMutation>;
export type ViewProfileMutationOptions = Apollo.BaseMutationOptions<ViewProfileMutation, ViewProfileMutationVariables>;
export const VoteDocument = gql`
    mutation Vote($value: Int!, $feedId: Int!) {
  vote(value: $value, feedId: $feedId)
}
    `;
export type VoteMutationFn = Apollo.MutationFunction<VoteMutation, VoteMutationVariables>;

/**
 * __useVoteMutation__
 *
 * To run a mutation, you first call `useVoteMutation` within a React component and pass it any options that fit your needs.
 * When your component renders, `useVoteMutation` returns a tuple that includes:
 * - A mutate function that you can call at any time to execute the mutation
 * - An object with fields that represent the current status of the mutation's execution
 *
 * @param baseOptions options that will be passed into the mutation, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options-2;
 *
 * @example
 * const [voteMutation, { data, loading, error }] = useVoteMutation({
 *   variables: {
 *      value: // value for 'value'
 *      feedId: // value for 'feedId'
 *   },
 * });
 */
export function useVoteMutation(baseOptions?: Apollo.MutationHookOptions<VoteMutation, VoteMutationVariables>) {
        return Apollo.useMutation<VoteMutation, VoteMutationVariables>(VoteDocument, baseOptions);
      }
export type VoteMutationHookResult = ReturnType<typeof useVoteMutation>;
export type VoteMutationResult = Apollo.MutationResult<VoteMutation>;
export type VoteMutationOptions = Apollo.BaseMutationOptions<VoteMutation, VoteMutationVariables>;
export const DvinderProfileDocument = gql`
    query DvinderProfile($limit: Int!, $distance: Int) {
  dvinderProfile(limit: $limit, distance: $distance) {
    hasMore
    profiles {
      userId
      username
      profileUrl
      bio
      githubUsername
      birthDate
      flair
      distance
      feeds {
        title
        imageUrl
        code
        projectIdea
        theme
        language
      }
    }
  }
}
    `;

/**
 * __useDvinderProfileQuery__
 *
 * To run a query within a React component, call `useDvinderProfileQuery` and pass it any options that fit your needs.
 * When your component renders, `useDvinderProfileQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useDvinderProfileQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      distance: // value for 'distance'
 *   },
 * });
 */
export function useDvinderProfileQuery(baseOptions: Apollo.QueryHookOptions<DvinderProfileQuery, DvinderProfileQueryVariables>) {
        return Apollo.useQuery<DvinderProfileQuery, DvinderProfileQueryVariables>(DvinderProfileDocument, baseOptions);
      }
export function useDvinderProfileLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<DvinderProfileQuery, DvinderProfileQueryVariables>) {
          return Apollo.useLazyQuery<DvinderProfileQuery, DvinderProfileQueryVariables>(DvinderProfileDocument, baseOptions);
        }
export type DvinderProfileQueryHookResult = ReturnType<typeof useDvinderProfileQuery>;
export type DvinderProfileLazyQueryHookResult = ReturnType<typeof useDvinderProfileLazyQuery>;
export type DvinderProfileQueryResult = Apollo.QueryResult<DvinderProfileQuery, DvinderProfileQueryVariables>;
export const FeedsDocument = gql`
    query Feeds($limit: Int!, $cursor: String) {
  feeds(limit: $limit, cursor: $cursor) {
    feeds {
      ...RegularFeed
    }
    hasMore
  }
}
    ${RegularFeedFragmentDoc}`;

/**
 * __useFeedsQuery__
 *
 * To run a query within a React component, call `useFeedsQuery` and pass it any options that fit your needs.
 * When your component renders, `useFeedsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useFeedsQuery({
 *   variables: {
 *      limit: // value for 'limit'
 *      cursor: // value for 'cursor'
 *   },
 * });
 */
export function useFeedsQuery(baseOptions: Apollo.QueryHookOptions<FeedsQuery, FeedsQueryVariables>) {
        return Apollo.useQuery<FeedsQuery, FeedsQueryVariables>(FeedsDocument, baseOptions);
      }
export function useFeedsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<FeedsQuery, FeedsQueryVariables>) {
          return Apollo.useLazyQuery<FeedsQuery, FeedsQueryVariables>(FeedsDocument, baseOptions);
        }
export type FeedsQueryHookResult = ReturnType<typeof useFeedsQuery>;
export type FeedsLazyQueryHookResult = ReturnType<typeof useFeedsLazyQuery>;
export type FeedsQueryResult = Apollo.QueryResult<FeedsQuery, FeedsQueryVariables>;
export const MatchesDocument = gql`
    query Matches {
  matches {
    user {
      id
      username
      email
      createdAt
      updatedAt
      profileUrl
      bio
      flair
      gender
      showMe
      minAge
      maxAge
      githubId
      birthDate
      lookingFor
      address
      latitude
      longitude
    }
    match {
      id
      userId1
      userId2
      read1
      read2
      unmatched
      createdAt
    }
  }
}
    `;

/**
 * __useMatchesQuery__
 *
 * To run a query within a React component, call `useMatchesQuery` and pass it any options that fit your needs.
 * When your component renders, `useMatchesQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMatchesQuery({
 *   variables: {
 *   },
 * });
 */
export function useMatchesQuery(baseOptions?: Apollo.QueryHookOptions<MatchesQuery, MatchesQueryVariables>) {
        return Apollo.useQuery<MatchesQuery, MatchesQueryVariables>(MatchesDocument, baseOptions);
      }
export function useMatchesLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MatchesQuery, MatchesQueryVariables>) {
          return Apollo.useLazyQuery<MatchesQuery, MatchesQueryVariables>(MatchesDocument, baseOptions);
        }
export type MatchesQueryHookResult = ReturnType<typeof useMatchesQuery>;
export type MatchesLazyQueryHookResult = ReturnType<typeof useMatchesLazyQuery>;
export type MatchesQueryResult = Apollo.QueryResult<MatchesQuery, MatchesQueryVariables>;
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useMeQuery__
 *
 * To run a query within a React component, call `useMeQuery` and pass it any options that fit your needs.
 * When your component renders, `useMeQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useMeQuery({
 *   variables: {
 *   },
 * });
 */
export function useMeQuery(baseOptions?: Apollo.QueryHookOptions<MeQuery, MeQueryVariables>) {
        return Apollo.useQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
      }
export function useMeLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<MeQuery, MeQueryVariables>) {
          return Apollo.useLazyQuery<MeQuery, MeQueryVariables>(MeDocument, baseOptions);
        }
export type MeQueryHookResult = ReturnType<typeof useMeQuery>;
export type MeLazyQueryHookResult = ReturnType<typeof useMeLazyQuery>;
export type MeQueryResult = Apollo.QueryResult<MeQuery, MeQueryVariables>;
export const UserFeedsDocument = gql`
    query UserFeeds {
  userFeeds {
    ...RegularFeed
  }
}
    ${RegularFeedFragmentDoc}`;

/**
 * __useUserFeedsQuery__
 *
 * To run a query within a React component, call `useUserFeedsQuery` and pass it any options that fit your needs.
 * When your component renders, `useUserFeedsQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUserFeedsQuery({
 *   variables: {
 *   },
 * });
 */
export function useUserFeedsQuery(baseOptions?: Apollo.QueryHookOptions<UserFeedsQuery, UserFeedsQueryVariables>) {
        return Apollo.useQuery<UserFeedsQuery, UserFeedsQueryVariables>(UserFeedsDocument, baseOptions);
      }
export function useUserFeedsLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UserFeedsQuery, UserFeedsQueryVariables>) {
          return Apollo.useLazyQuery<UserFeedsQuery, UserFeedsQueryVariables>(UserFeedsDocument, baseOptions);
        }
export type UserFeedsQueryHookResult = ReturnType<typeof useUserFeedsQuery>;
export type UserFeedsLazyQueryHookResult = ReturnType<typeof useUserFeedsLazyQuery>;
export type UserFeedsQueryResult = Apollo.QueryResult<UserFeedsQuery, UserFeedsQueryVariables>;
export const UsersDocument = gql`
    query Users {
  users {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

/**
 * __useUsersQuery__
 *
 * To run a query within a React component, call `useUsersQuery` and pass it any options that fit your needs.
 * When your component renders, `useUsersQuery` returns an object from Apollo Client that contains loading, error, and data properties
 * you can use to render your UI.
 *
 * @param baseOptions options that will be passed into the query, supported options are listed on: https://www.apollographql.com/docs/react/api/react-hooks/#options;
 *
 * @example
 * const { data, loading, error } = useUsersQuery({
 *   variables: {
 *   },
 * });
 */
export function useUsersQuery(baseOptions?: Apollo.QueryHookOptions<UsersQuery, UsersQueryVariables>) {
        return Apollo.useQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
      }
export function useUsersLazyQuery(baseOptions?: Apollo.LazyQueryHookOptions<UsersQuery, UsersQueryVariables>) {
          return Apollo.useLazyQuery<UsersQuery, UsersQueryVariables>(UsersDocument, baseOptions);
        }
export type UsersQueryHookResult = ReturnType<typeof useUsersQuery>;
export type UsersLazyQueryHookResult = ReturnType<typeof useUsersLazyQuery>;
export type UsersQueryResult = Apollo.QueryResult<UsersQuery, UsersQueryVariables>;