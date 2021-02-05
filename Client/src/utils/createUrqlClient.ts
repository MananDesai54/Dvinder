import {
  dedupExchange,
  fetchExchange,
  Exchange,
  stringifyVariables,
} from "urql";
import { betterUpdateQuery, isServer } from ".";
import { cacheExchange, Resolver } from "@urql/exchange-graphcache";
import {
  LoginMutation,
  MeQuery,
  MeDocument,
  RegisterMutation,
  LogoutMutation,
  VoteMutationVariables,
} from "../generated/graphql";
import { pipe, tap } from "wonka";
import Router from "next/router";
import gql from "graphql-tag";
import { invalidateCache } from "./invalidateCache";

const errorExchange: Exchange = ({ forward }) => (ops$) => {
  return pipe(
    forward(ops$),
    tap(({ error }) => {
      if (error) {
        if (error?.message.includes("Not Authenticated") && !isServer()) {
          console.log(error.message);
          Router.replace("/auth/login");
          // Router.reload();
        }
      }
    })
  );
};

export const cursorPagination = (): Resolver => {
  return (_parent, fieldArgs, cache, info) => {
    const { parentKey: entityKey, fieldName } = info;

    const allFields = cache.inspectFields(entityKey);
    const fieldInfos = allFields.filter((info) => info.fieldName === fieldName);
    const size = fieldInfos.length;
    if (size === 0) {
      return undefined;
    }

    const isInCache = cache.resolve(
      cache.resolveFieldByKey(
        entityKey,
        `${fieldName}(${stringifyVariables(fieldArgs)})`
      ) as string,
      "feeds"
    );
    info.partial = !isInCache;

    const results: string[] = [];
    let hasMore = true;
    fieldInfos.forEach((fi) => {
      const key = cache.resolveFieldByKey(entityKey, fi.fieldKey) as string;
      const data = cache.resolve(key, "feeds") as string[];
      // hasMore = hasMore && cache.resolve(key, "hasMore") as boolean;
      const _hasMore = hasMore && (cache.resolve(key, "hasMore") as boolean);
      if (!_hasMore) {
        hasMore = _hasMore;
      }
      data && results.push(...data);
    });
    return {
      __typename: "FeedPagination",
      hasMore,
      feeds: results,
    };

    // const visited = new Set();
    // let result: NullArray<string> = [];
    // let prevOffset: number | null = null;

    // for (let i = 0; i < size; i++) {
    //   const { fieldKey, arguments: args } = fieldInfos[i];
    //   if (args === null || !compareArgs(fieldArgs, args)) {
    //     continue;
    //   }

    //   const links = cache.resolve(entityKey, fieldKey) as string[];
    //   const currentOffset = args[cursorArgument];

    //   if (
    //     links === null ||
    //     links.length === 0 ||
    //     typeof currentOffset !== 'number'
    //   ) {
    //     continue;
    //   }

    //   const tempResult: NullArray<string> = [];

    //   for (let j = 0; j < links.length; j++) {
    //     const link = links[j];
    //     if (visited.has(link)) continue;
    //     tempResult.push(link);
    //     visited.add(link);
    //   }

    //   if (
    //     (!prevOffset || currentOffset > prevOffset) ===
    //     (mergeMode === 'after')
    //   ) {
    //     result = [...result, ...tempResult];
    //   } else {
    //     result = [...tempResult, ...result];
    //   }

    //   prevOffset = currentOffset;
    // }

    // const hasCurrentPage = cache.resolve(entityKey, fieldName, fieldArgs);
    // if (hasCurrentPage) {
    //   return result;
    // } else if (!(info as any).store.schema) {
    //   return undefined;
    // } else {
    //   info.partial = true;
    //   return result;
    // }
  };
};

export const createUrqlClient = (ssrExchange: any, ctx: any) => {
  let cookie = "";
  if (isServer()) {
    // console.log(ctx.req.headers.cookie);
    cookie = ctx?.req?.headers?.cookie;
    // return;
  }

  return {
    url: "http://127.0.0.1:5000/graphql",
    fetchOptions: {
      credentials: "include" as const,
      headers: cookie
        ? {
            cookie,
          }
        : undefined,
    },
    exchanges: [
      dedupExchange,
      cacheExchange({
        keys: {
          FeedPagination: () => null,
        },
        resolvers: {
          Query: {
            feeds: cursorPagination(),
          },
        },
        updates: {
          Mutation: {
            login: (_result, args, cache, info) => {
              invalidateCache(cache);
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
              invalidateCache(cache);
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
            createFeed: (_result, args, cache, info) => {
              invalidateCache(cache);
            },
            vote: (_result, args, cache, info) => {
              const { feedId, value } = args as VoteMutationVariables;
              const data = cache.readFragment(
                gql`
                  fragment _ on Feed {
                    id
                    points
                    voteStatus
                  }
                `,
                { id: feedId }
              );
              if (data) {
                if (((data as any).voteStatus as number) === value) {
                  return;
                }
                const updatePoints = ((data as any).voteStatus as number)
                  ? 2 * value
                  : value;
                const newPoints =
                  ((data as any).points as number) + updatePoints;
                cache.writeFragment(
                  gql`
                    fragment __ on Feed {
                      points
                      voteStatus
                    }
                  `,
                  { id: feedId, points: newPoints, voteStatus: value }
                );
              }
            },
          },
        },
      }),
      errorExchange,
      ssrExchange,
      fetchExchange,
    ],
  };
};
