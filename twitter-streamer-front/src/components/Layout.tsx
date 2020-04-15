import React, { FC } from "react";

const Layout: FC = ({ children }) => (
  <>
    <header>
      <h1>
        <a href={"/"}>twitter-streamer</a>
      </h1>

      <nav>
        <a href={"/"} target={"_blank"} rel={"noopener noreferrer"}>
          Code
        </a>
      </nav>
    </header>
    <main>{children}</main>
    <footer>
      <h1>twitter-streamer</h1>
    </footer>
  </>
);

export default Layout;
