import { selectorFamily } from "recoil";
import { tasksAtom } from "./tasks-atom";

export const taskSelector = selectorFamily({
    key: 'taskSelector',
    get: (param) => ({get}) => {
      const tasks = get(tasksAtom);
      const task = tasks.find((value) => {
        return (value._id == param);
      });
      return task;
    }
});