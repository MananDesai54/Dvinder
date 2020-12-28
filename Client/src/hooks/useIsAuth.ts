import { useMeQuery } from "../generated/graphql";

export const useIsAuth = () => {
  const [{ data }] = useMeQuery();

  return data?.me;
};
