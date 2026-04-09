import React from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";

const Root = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">

        <NavBar />
        
        <main className="flex-1 flex flex-col pt-16 overflow-auto">
            {/*toastify container*/}
            <Outlet />
        </main>

        <Footer/>
      </div>
    </>
  );
};

export default Root;