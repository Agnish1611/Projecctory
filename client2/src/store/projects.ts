import { atom, selector } from "recoil";
import { userAtom } from "./user";
import axios from "@/api/axiosConfig";

const getProjectsUrl = '/projects/';

export const projectsAtom = atom({
    key: 'projectsAtom',
    default: selector({
        key: 'projectsSelector',
        get: async ({get}) => {
            const user = get(userAtom);
            try {
                const response = await axios.get(getProjectsUrl+user.id);
                return response.data?.data;
            } catch (error) {
                console.log(error);
                return [];
            }
        }
    })
})