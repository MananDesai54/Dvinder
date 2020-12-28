import Navbar from "../components/Navbar";
// import { withUrqlClient } from "next-urql";
// import { createUrqlClient } from "../utils/createUrqlClient";
import { useUsersQuery } from "../generated/graphql";

/**
 * How SSR works
 * me request -> to browser(client)
 * client request -> next.js server
 * next.js request -> graphQL server
 * next.js build HTML
 * send it back to client
 * the first page we render will be SSR other all will be client side
 */

const Index = () => {
  const [{ data, fetching }] = useUsersQuery();

  return (
    <>
      <Navbar></Navbar>
      {!data
        ? "Loading..."
        : data.users?.map((user) => <div key={user.id}>{user.username}</div>)}
    </>
  );
};

export default Index;
// export default withUrqlClient(createUrqlClient, { ssr: false })(Index);
