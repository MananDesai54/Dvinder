import { useRouter } from "next/router";
import { useEffect } from "react";
import { useMeQuery } from "../generated/apollo-graphql";
import { isServer } from "../utils";

export const useIsAuth = () => {
  const { data, loading } = useMeQuery();
  const router = useRouter();
  useEffect(() => {
    if (
      !data?.me &&
      !loading &&
      !isServer() &&
      !router.pathname.includes("register")
    ) {
      console.log("I 'm here");
      router.replace(`/auth/login?next=${router.pathname}`);
    }
  }, [data, router, loading]);
  return data?.me;
};
