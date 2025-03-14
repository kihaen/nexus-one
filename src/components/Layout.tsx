import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

const Layout = (props : Props) : JSX.Element => (
  <div>
    <Header />
    <div className="layout">{props.children}</div>
    <style jsx>{`
      .layout {
        padding: 0 2rem 4rem 2rem;
        display : flex;
        flex-direction : column;
        justify-content: center;
        align-items : center;
        min-width : 400px;
      }
      @media (max-width : 830px){
        .layout {
          padding: 0 20px 30px 20px;
        }
      }
    `}</style>
  </div>
);

export default Layout;