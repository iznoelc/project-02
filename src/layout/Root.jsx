import React from "react";
import { Outlet } from "react-router";
import NavBar from "../components/NavBar";
import Footer from "../components/Footer";
import { ToastContainer, Slide } from "react-toastify";

const Root = () => {
  return (
    <>
      <div className="flex flex-col min-h-screen">

        <NavBar />
        
        <main className="flex-1 flex flex-col pt-16 overflow-auto">
            <ToastContainer
              position="top-center"
              autoClose={3000}
              hideProgressBar={false}
              newestOnTop
              closeOnClick
              rtl={false}
              pauseOnFocusLoss
              draggable
              pauseOnHover
              theme="light"
              transition={Slide}
            />
            <Outlet />
        </main>

        <Footer/>
      </div>
    </>
  );
};

export default Root;