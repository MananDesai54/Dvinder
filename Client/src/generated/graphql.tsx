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
};

export type User = {
  __typename?: 'User';
  id: Scalars['Int'];
  createdAt: Scalars['String'];
  updatedAt: Scalars['String'];
  username: Scalars['String'];
  email: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  registerUser: UserResponse;
  login: UserResponse;
  updateUser?: Maybe<User>;
  deleteUser: Scalars['Boolean'];
};


export type MutationRegisterUserArgs = {
  userData: UserData;
};


export type MutationLoginArgs = {
  authData: UserData;
};


export type MutationUpdateUserArgs = {
  username?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  id: Scalars['Float'];
};


export type MutationDeleteUserArgs = {
  id: Scalars['Float'];
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

export type LoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type LoginMutation = (
  { __typename?: 'Mutation' }
  & { login: (
    { __typename?: 'UserResponse' }
    & Pick<UserResponse, 'success'>
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'id' | 'email' | 'username'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'ErrorResponse' }
      & Pick<ErrorResponse, 'field' | 'message'>
    )>> }
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
    & { user?: Maybe<(
      { __typename?: 'User' }
      & Pick<User, 'username' | 'id' | 'email'>
    )>, errors?: Maybe<Array<(
      { __typename?: 'ErrorResponse' }
      & Pick<ErrorResponse, 'message' | 'field'>
    )>> }
  ) }
);


export const LoginDocument = gql`
    mutation Login($email: String!, $password: String!) {
  login(authData: {password: $password, email: $email}) {
    user {
      id
      email
      username
    }
    errors {
      field
      message
    }
    success
  }
}
    `;

export function useLoginMutation() {
  return Urql.useMutation<LoginMutation, LoginMutationVariables>(LoginDocument);
};
export const RegisterDocument = gql`
    mutation Register($email: String!, $password: String!, $username: String!) {
  registerUser(
    userData: {email: $email, password: $password, username: $username}
  ) {
    user {
      username
      id
      email
    }
    errors {
      message
      field
    }
  }
}
    `;

export function useRegisterMutation() {
  return Urql.useMutation<RegisterMutation, RegisterMutationVariables>(RegisterDocument);
};