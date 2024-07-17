import { atom, selector } from "recoil";
import axios from "@/api/axios-config";
import { userAtom } from "./user-atom";

const getTasksUrl = '/task/';

export const tasksTodayAtom = atom({
    key: 'tasksTodayAtom',
    default: selector({
        key: 'tasksTodayAtomSelector',
        get: async ({get}) => {
            const user = get(userAtom);
            try {
                const res = await axios.get(getTasksUrl+user.id+'?date='+new Date(new Date().getTime() + 330*60000).toISOString().split('T')[0]);
                console.log(res.data.data);
                return res.data.data;
            } catch (error) {
                console.log(error);
                return {}
            }
        }
    })
});