import { atom, selector } from "recoil";
import axios from "@/api/axios-config";
import { userAtom } from "./user-atom";

const getTasksUrl = '/task/';

export const tasksAtom = atom({
    key: 'tasksAtom',
    default: selector({
        key: 'tasksAtomSelector',
        get: async ({get}) => {
            const user = get(userAtom);
            try {
                const res = await axios.get(getTasksUrl+user.id);
                return res.data.data;
            } catch (error) {
                console.log(error);
                return {}
            }
        }
    })
});