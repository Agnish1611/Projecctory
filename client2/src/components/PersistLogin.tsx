import useRefreshToken from "@/hooks/useRefreshToken";
import { userAtom } from "@/store/user";
import { useEffect, useState } from "react"
import { Outlet } from "react-router-dom";
import { useRecoilValue } from "recoil";
import { FallingLines } from 'react-loader-spinner'

const PersistLogin = () => {
    const [isLoading, setIsLoading] = useState(true);
    const refresh = useRefreshToken();
    const user = useRecoilValue(userAtom);

    function later(delay) {
        return new Promise(function(resolve) {
            setTimeout(resolve, delay);
        });
    }
      

    useEffect(() => {
        const verifyRefreshToken = async () => {
            try {
                await refresh();
            } catch (error) {
                console.error(error);
            } finally {
                await later(1000);
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
                ? <div className="h-screen w-full flex justify-center items-center bg-zinc-950">
                    <FallingLines
                        color="#4fa94d"
                        width="100"
                        visible={true}
                    />
                  </div>
                : <Outlet />
            }
        </>
    )
}

export default PersistLogin;