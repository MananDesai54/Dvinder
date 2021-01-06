import gql from 'graphql-tag';
import * as Urql from 'urql';
export type Maybe<T> = T | null;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type Omit<T, K extends keyof T> = Pick<T, Exclude<keyof T, K>>;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
};

export type Query = {
  __typename?: 'Query';
  hello: Scalars['String'];
  me?: Maybe<User>;
  users?: Maybe<Array<User>>;
  feeds?: Maybe<FeedPagination>;
  feed?: Maybe<Feed>;
};


export type QueryFeedsArgs = {
  cursor?: Maybe<Scalars['String']>;
  limit: Scalars['Int'];
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
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
};

export type Feed = {
  __typename?: 'Feed';
  id: Scalars['Int'];
  creator: User;
  creatorId: Scalars['Int'];
  title: Scalars['String'];
  type: Scalars['String'];
  points: Scalars['Int'];
  imageUrl: Scalars['String'];
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

export type FeedPagination = {
  __typename?: 'FeedPagination';
  feeds: Array<Feed>;
  hasMore: Scalars['Boolean'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerUser: UserResponse;
  login: UserResponse;
  logout: Scalars['Boolean'];
  forgetPassword: Scalars['Boolean'];
  changePassword?: Maybe<UserResponse>;
  updateUser?: Maybe<User>;
  deleteUser: Scalars['Boolean'];
  createFeed: FeedResponse;
  updateFeed: FeedResponse;
  deleteFeed: Scalars['Boolean'];
  vote: Scalars['Boolean'];
};


export type MutationRegisterUserArgs = {
  userData: UserData;
};


export type MutationLoginArgs = {
  password: Scalars['String'];
  usernameOrEmail: Scalars['String'];
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


export type MutationCreateFeedArgs = {
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

export type UserResponse = {
  __typename?: 'UserResponse';
  errors?: Maybe<Array<ErrorResponse>>;
  user?: Maybe<User>;
  success: Scalars['Boolean'];
};

export type ErrorResponse = {
  __typename?: 'ErrorResponse';
  field: Scalars['String'];
  message: Scalars['String'];
};

export type UserData = {
  email: Scalars['String'];
  password: Scalars['String'];
  username?: Maybe<Scalars['String']>;
};

export type FeedResponse = {
  __typename?: 'FeedResponse';
  errors?: Maybe<Array<ErrorResponse>>;
  feed?: Maybe<Feed>;
  feeds?: Maybe<Array<Feed>>;
};

export type FeedData = {
  title: Scalars['String'];
  imageUrl: Scalars['String'];
  type: Scalars['String'];
};

export type FeedUpdateData = {
  title: Scalars['String'];
  imageUrl: Scalars['String'];
  id: Scalars['Float'];
};

export type RegularErrorFragment = (
  { __typename?: 'ErrorResponse' }
  & Pick<ErrorResponse, 'field' | 'message'>
);

export type RegularFeedFragment = (
  { __typename?: 'Feed' }
  & Pick<Feed, 'creatorId' | 'title' | 'imageUrlSlice' | 'id' | 'createdAt' | 'updatedAt'>
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
  & Pick<User, 'id' | 'username' | 'email' | 'createdAt' | 'updatedAt'>
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
  imageUrl: Scalars['String'];
  type: Scalars['String'];
}>;


export type CreateFeedMutation = (
  { __typename?: 'Mutation' }
  & { createFeed: (
    { __typename?: 'FeedResponse' }
    & { feed?: Maybe<(
      { __typename?: 'Feed' }
      & Pick<Feed, 'creatorId' | 'title' | 'imageUrl' | 'id' | 'createdAt' | 'updatedAt' | 'type'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'ErrorResponse' }
      & Pick<ErrorResponse, 'field' | 'message'>
    )>> }
  ) }
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

export type LogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type LogoutMutation = (
  { __typename?: 'Mutation' }
  & Pick<Mutation, 'logout'>
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

export type MeQueryVariables = Exact<{ [key: string]: never; }>;


export type MeQuery = (
  { __typename?: 'Query' }
  & { me?: Maybe<(
    { __typename?: 'User' }
    & RegularUserFragment
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
  imageUrlSlice
  id
  createdAt
  updatedAt
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
export const ChangePasswordDocument = gql`
    mutation ChangePassword($token: String!, $newPassword: String!) {
  changePassword(token: $token, newPassword: $newPassword) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useChangePasswordMutation() {
  return Urql.useMutation<ChangePasswordMutation, ChangePasswordMutationVariables>(ChangePasswordDocument);
};
export const CreateFeedDocument = gql`
    mutation CreateFeed($title: String!, $imageUrl: String!, $type: String!) {
  createFeed(feedData: {title: $title, imageUrl: $imageUrl, type: $type}) {
    feed {
      creatorId
      title
      imageUrl
      id
      createdAt
      updatedAt
      type
    }
    errors {
      field
      message
    }
  }
}
    `;

export function useCreateFeedMutation() {
  return Urql.useMutation<CreateFeedMutation, CreateFeedMutationVariables>(CreateFeedDocument);
};
export const ForgetPasswordDocument = gql`
    mutation ForgetPassword($email: String!) {
  forgetPassword(email: $email)
}
    `;

export function useForgetPasswordMutation() {
  return Urql.useMutation<ForgetPasswordMutation, ForgetPasswordMutationVariables>(ForgetPasswordDocument);
};
export const LoginDocument = gql`
    mutation Login($usernameOrEmail: String!, $password: String!) {
  login(password: $password, usernameOrEmail: $usernameOrEmail) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const LogoutDocument = gql`
    mutation Logout {
  logout
}
    `;

export function useLogoutMutation() {
  return Urql.useMutation<LogoutMutation, LogoutMutationVariables>(LogoutDocument);
};
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $username: String!) {
  registerUser(
    userData: {email: $email, password: $password, username: $username}
  ) {
    ...RegularUserResponse
  }
}
    ${RegularUserResponseFragmentDoc}`;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};
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

export function useFeedsQuery(options: Omit<Urql.UseQueryArgs<FeedsQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<FeedsQuery>({ query: FeedsDocument, ...options });
};
export const MeDocument = gql`
    query Me {
  me {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useMeQuery(options: Omit<Urql.UseQueryArgs<MeQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<MeQuery>({ query: MeDocument, ...options });
};
export const UsersDocument = gql`
    query Users {
  users {
    ...RegularUser
  }
}
    ${RegularUserFragmentDoc}`;

export function useUsersQuery(options: Omit<Urql.UseQueryArgs<UsersQueryVariables>, 'query'> = {}) {
  return Urql.useQuery<UsersQuery>({ query: UsersDocument, ...options });
};