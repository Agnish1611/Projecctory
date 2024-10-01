import { userAtom } from "@/store/user";
import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useRecoilValue } from "recoil";

function AuthLayout() {
    const user = useRecoilValue(userAtom);
    const navigate = useNavigate();

    useEffect(() => {
        if (user.accessToken) {
            navigate('/dash');
        }
    });
    return (
        <>
            <Outlet />
        </>
    )
}

export default AuthLayout;