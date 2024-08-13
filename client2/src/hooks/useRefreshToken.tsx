import axios from "@/api/axiosConfig";
import { userAtom } from "@/store/user";
import { useSetRecoilState } from "recoil";

const useRefreshToken = () => {
    const setUser = useSetRecoilState(userAtom);

    const refresh = async () => {
        console.log('refreshed');
        const response = await axios.get('/users/refresh', {
            withCredentials: true
        });
        setUser(prev => {
            console.log(JSON.stringify(prev));
            console.log(response.data.accessToken);
            return { ...prev, accessToken: response.data.accessToken };
        });
        return response.data.accessToken;
    }
  return refresh;
}

export default useRefreshToken;