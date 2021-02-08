import { ApolloCache } from "@apollo/client";
import { MeDocument, MeQuery } from "../generated/apollo-graphql";

export const updateUserDataInCache = (cache: ApolloCache<any>, data: any) => {
  cache.writeQuery<MeQuery>({
    query: MeDocument,
    data: {
      __typename: "Query",
      me: data.user,
    },
  });
  cache.evict({ fieldName: "feeds" });
};
