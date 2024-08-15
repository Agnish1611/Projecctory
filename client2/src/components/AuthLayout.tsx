import { Outlet } from "react-router-dom";

function AuthLayout() {
    return (
        <div className="bg-zinc-900 text-white flex justify-center items-center w-screen h-screen">
            <Outlet />
        </div>
    )
}

export default AuthLayout;