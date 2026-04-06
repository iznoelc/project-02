import React from "react";
import Home from "../components/Home";
import Root from "../layout/Root";

const MainRouter = [
  {
    path: "/",
    Component: Root,
    children: [
      { index: true,
        Component: Home,},
    //   { path: "signup", Component: SignUpPage },
    //   { path: "login", Component: LoginPage },
    //   { path: "error", Component: ErrorPage },
    ],
  },
];

export default MainRouter;