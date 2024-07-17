import { atom, selector } from "recoil";
import axios from "@/api/axios-config";
import { userAtom } from "./user-atom";

const getTasksUrl = '/task/upcoming/';

export const tasksUpcomingAtom = atom({
    key: 'tasksUpcomingAtom',
    default: selector({
        key: 'tasksUpcomingAtomSelector',
        get: async ({get}) => {
            const user = get(userAtom);
            try {
                const res = await axios.get(getTasksUrl+user.id);
                console.log(res.data.data);
                return res.data.data;
            } catch (error) {
                console.log(error);
                return {}
            }
        }
    })
});