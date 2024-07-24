import { atom, selector } from "recoil";
import { projectsAtom } from "./projects";

export const currentProjectAtom = atom({
    key: 'currentProjectAtom',
    default: selector({
        key: 'currentProjectSelector',
        get: ({get}) => {
            const projects = get(projectsAtom);
            return projects[0];
        }
    })
})