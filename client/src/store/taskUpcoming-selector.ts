import { selectorFamily } from "recoil";
import { tasksTodayAtom } from "./tasksToday-atom";
import { tasksUpcomingAtom } from "./tasksUpcoming-atom";

export const taskUpcomingSelector = selectorFamily({
    key: 'taskUpcomingSelector',
    get: (param) => ({get}) => {
      const tasks = get(tasksUpcomingAtom);
      console.log(tasks);
      for (let i=0;i<7;i++) {
        let task = tasks[i].find((value) => {
            return (value._id == param)
        });
        if (task) {
            return task;
        }
      }
    }
});