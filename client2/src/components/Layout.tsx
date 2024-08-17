import { Outlet } from "react-router-dom";
import { Suspense } from "react";
import Navbar from "./Navbar";

const Layout = () => {
  return (
    <div className="flex sm:flex-row flex-col h-screen w-screen">
      <Suspense fallback={'Loading...'}>
        <Navbar />
      </Suspense>
      <Outlet />
    </div>
  )
}

export default Layout;