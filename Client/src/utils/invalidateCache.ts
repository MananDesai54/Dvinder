import { Cache } from "@urql/exchange-graphcache";

/**
 * this function is used to invalidate or update all the feeds when we do some activity like authenticate or create feed.
 */
export const invalidateCache = (cache: Cache) => {
  const allFields = cache.inspectFields("Query");
  const fieldInfos = allFields.filter((info) => info.fieldName === "feeds");
  fieldInfos.forEach((fi) => {
    cache.invalidate("Query", "feeds", fi.arguments || {});
  });
};
