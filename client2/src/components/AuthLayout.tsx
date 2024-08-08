import { userAtom } from "@/store/user";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

function AuthLayout() {
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        (user.accessToken?.length) && navigate('/dash');
    }, []);

    return (
        <div className="bg-zinc-900 text-white flex justify-center items-center w-screen h-screen">
            <Outlet />
        </div>
    )
}

export default AuthLayout;