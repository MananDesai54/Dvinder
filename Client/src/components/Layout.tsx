import React, { FC, Fragment } from "react";
import Navbar from "./Navbar";

const Layout: FC = (props) => {
  return (
    <Fragment>
      <Navbar />
      {props.children}
    </Fragment>
  );
};

export default Layout;
