import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import { Suspense } from "react";

const Layout = () => {
  return (
    <div className="flex">
      <Suspense fallback={'Loading...'}>
        <Navbar />
      </Suspense>
      <Outlet />
    </div>
  )
}

export default Layout;