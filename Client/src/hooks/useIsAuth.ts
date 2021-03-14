import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/apollo-graphql";
import { isServer } from "../utils";

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (router.pathname.includes("register")) {
      return;
    }
    if (!data?.me && !loading && !isServer()) {
      console.log("I 'm here");
      router.replace(`/auth/login?next=${router.pathname}`);
    }
  }, [data, router, loading]);
  return data?.me;
};
