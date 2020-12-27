import Navbar from "../components/Navbar";
import { withUrqlClient } from "next-urql";
import { createUrqlClient } from "../utils/createUrqlClient";

const Index = () => <Navbar></Navbar>;

export default withUrqlClient(createUrqlClient)(Index);
