import { selectorFamily } from "recoil";
import { taskSelector } from "./task-selector";

export const completedSelector = selectorFamily({
    key: 'completedSelector',
    get: (param) => ({get}) => {
      const task = get(taskSelector(param));
      return task.completed;
    }
});