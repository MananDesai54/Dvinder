import { createClient, dedupExchange, fetchExchange, Exchange } from "urql";
import { betterUpdateQuery } from ".";
import { cacheExchange } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
  ChangePasswordMutation,
} from "../generated/graphql";
import { pipe, tap } from "wonka";
import Router from "next/router";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error?.message.includes("Not Authenticated")) {
          Router.replace("/auth/login");
        }
      }
    })
  );
};

export const createClientUrql = () =>
  createClient({
    url: "http://127.0.0.1:5000/graphql",
    fetchOptions: {
      credentials: "include",
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        updates: {
          Mutation: {
            login: (_result, args, cache, info) => {
              betterUpdateQuery<LoginMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.login.errors) {
                    return query;
                  } else {
                    return {
                      me: result.login.user,
                    };
                  }
                }
              );
            },
            registerUser: (_result, args, cache, info) => {
              betterUpdateQuery<RegisterMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (result.registerUser.errors) {
                    return query;
                  } else {
                    return {
                      me: result.registerUser.user,
                    };
                  }
                }
              );
            },
            logout: (_result, args, cache, info) => {
              betterUpdateQuery<LogoutMutation, MeQuery>(
                cache,
                { query: MeDocument },
                _result,
                (result, query) => {
                  if (!result.logout) {
                    return query;
                  } else {
                    return {
                      me: null,
                    };
                  }
                }
              );
            },
            // changePassword: (_result, args, cache, info) => {
            //   betterUpdateQuery<ChangePasswordMutation, MeQuery>(
            //     cache,
            //     { query: MeDocument },
            //     _result,
            //     (result, query) => {
            //       if (!result.changePassword) {
            //         return query;
            //       } else {
            //         return {
            //           me: null,
            //         };
            //       }
            //     }
            //   );
            // },
          },
        },
      }),
      errorExchange,
      fetchExchange,
    ],
  });
