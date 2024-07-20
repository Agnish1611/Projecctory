import { atom, selector } from "recoil";
import axios from "@/api/axios-config";
import Cookies from 'js-cookie';

const auth_url = '/user/authenticate';

export const userAtom = atom({
    key: 'userAtom',
    default: selector({
        key: 'labelsAtomSelector',
        get: async () => {
            try {
                const token = Cookies.get('authToken');
                const res = await axios.get(auth_url, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
                });
                return res.data.data;
            } catch (error) {
                console.log(error);
                return {};
            }
        }
    })
});
