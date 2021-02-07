import { useRouter } from "next/router";
import { useEffect } from "react";
// import { useMeQuery } from "../generated/graphql";
import { useMeQuery } from "../generated/apollo-graphql";
import { isServer } from "../utils";

export const useIsAuth = () => {
  // const [{ data, fetching }] = useMeQuery();
  const { data, loading } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    // if (!data?.me && !fetching) {
    if (router.pathname.includes("register")) {
      return;
    }
    if (!data?.me && !loading && !isServer()) {
      console.log("I 'm here");
      router.replace(`/auth/login?next=${router.pathname}`);
    }
    // }, [data, router, fetching]);
  }, [data, router, loading]);
  return data?.me;
};
