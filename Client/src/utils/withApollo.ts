import { ApolloClient, HttpLink, InMemoryCache } from "@apollo/client";
import { createUploadLink } from "apollo-upload-client";
import { createWithApollo } from "./createApolloClient";
import { FeedPagination } from "../generated/apollo-graphql";
import { isServer } from ".";
import { NextPageContext } from "next";
// import { withCreateApolloClient } from "./withCreateApolloClient";

const createClient = (ctx: NextPageContext) =>
  new ApolloClient({
    link: createUploadLink({
      uri: process.env.NEXT_PUBLIC_API_URL as string,
      credentials: "include",
      headers: {
        cookie: (isServer() ? ctx?.req?.headers.cookie : undefined) || "",
      },
    }) as any,
    cache: new InMemoryCache({
      typePolicies: {
        Query: {
          fields: {
            feeds: {
              keyArgs: [], // put name or args which is import for filtering like search keyword, here limit and cursor are not required for filtering the data so we will not add this.
              merge(
                existing: FeedPagination | undefined,
                incoming: FeedPagination
              ): FeedPagination {
                return {
                  __typename: "FeedPagination",
                  hasMore: incoming.hasMore,
                  feeds: [...(existing?.feeds || []), ...incoming.feeds],
                };
              },
            },
          },
        },
      },
    }),
  });

export const withApolloClient = createWithApollo(createClient);
