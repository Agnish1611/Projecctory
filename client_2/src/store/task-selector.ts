import { selectorFamily } from "recoil";
import { tasksTodayAtom } from "./tasksToday-atom";

export const taskSelector = selectorFamily({
    key: 'taskSelector',
    get: (param) => ({get}) => {
      const tasks = get(tasksTodayAtom);
      const task = tasks.find((value) => {
        return (value._id == param);
      });
      return task;
    }
});