import useRefreshToken from "@/hooks/useRefreshToken";
import { userAtom } from "@/store/user";
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";


const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const user = useRecoilValue(userAtom);

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            } finally {
                setIsLoading(false);
            }
        }

        !user?.accessToken ? verifyRefreshToken() : setIsLoading(false);
    }, []);

    useEffect(() => {
        console.log(`isLoading: ${isLoading}`);
        console.log(`aT: ${user?.accessToken}`);
    }, [isLoading]);

    return (
        <>
            {isLoading 
                ? <p>Loading ...</p>
                : <Outlet />
            }
        </>
    )
}

export default PersistLogin;