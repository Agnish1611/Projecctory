import { atom , selector} from "recoil";
import axios from "@/api/axios-config";

const auth_url = '/user/authenticate';

export const userAtom = atom({
    key: 'userAtom',
    default: selector({
        key: 'labelsAtomSelector',
        get: async () => {
            try {
                const res = await axios.get(auth_url, { headers: { 'Authorization':localStorage.getItem('SavedToken'), 'Content-Type': 'application/json'  }})
                return res.data.data;
            } catch (error) {
                console.log(error);
                return {}
            }
        }
    })
});