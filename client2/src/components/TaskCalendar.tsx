import { IoIosArrowDown } from "react-icons/io";
import { BsPlusCircleFill } from "react-icons/bs";
import { LuAlarmClock } from "react-icons/lu";

import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useEffect, useState } from "react";
import axios from "@/api/axiosConfig";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/store/user";

const tasksUrl = '/tasks/';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const priorites = ['normal', 'important', 'urgent'];
const colors = ['bg-green-400', 'bg-yellow-300', 'bg-red-400'];

const Task = ({task}) => {
    const [isCompleted, setIsCompleted] = useState(task.completed == "true");

    async function handleCheckbox (url) {
        try {
          await axios.patch(url,
            { completed: !isCompleted },
            { headers: { 'Content-Type': 'application/json' }}
          );
        } catch (error) {
          console.log(error);
        }
    }

    return (
        <div className={`w-full flex flex-col h-fit min-h-[150px] ${!isCompleted ? colors[priorites.indexOf(task?.priority)] : `bg-zinc-400`} rounded-3xl p-5 my-5`}>
            <div className="checkbox-wrapper-24 relative top-[-3px] left-[140px]">
                <input type="checkbox" id="check-24" name="check" checked={isCompleted} />
                <label htmlFor="check-24" onClick={() => {
                    setIsCompleted(!isCompleted);
                    handleCheckbox(tasksUrl+task._id);
                }}>
                <span></span>
                </label>
            </div>
            {task?.time && <div className="flex text-xs font-semibold text-zinc-600 items-center mb-2 gap-2"><LuAlarmClock className="h-4 w-4" /> Time: {task?.time}</div>}
            <div className={`${isCompleted && `line-through`}`}>{task?.description}</div>
            {task?.labels.length && 
                <div className="flex flex-wrap my-2">
                    {task.labels.map((label) => {
                        return (
                            <div className="px-2 mx-1 text-xs w-fit border border-zinc-600 rounded-full">{label}</div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

const Day = ({date}) => {
    const day = date.substring(8, 10);
    const week = date.substring(0, 3);
    const monthNo = months.indexOf(date.substring(4, 7))+1;
    const month = monthNo < 10 ? '0'+monthNo : ''+monthNo;
    const year = date.substring(11);
    const dateString = day+'-'+month+'-'+year;

    const user = useRecoilValue(userAtom);

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        axios.get(tasksUrl+'?user='+user.id+'&date='+dateString)
            .then((res) => {
                setTasks(res.data?.data);
                console.log(res.data?.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, []);
    
    return (
        <div className="min-w-[200px] pt-10 mx-5">
            <div className={`text-center text-5xl overflow-y-hidden font-bold ${(date == new Date().toDateString()) ? `text-zinc-900` : `text-zinc-400`}`}>{day}<span className="text-sm">/ {week}</span></div>
            <div className={`max-h-[310px] mt-5 h-fit overflow-y-scroll overflow-x-hidden no-scrollbar text-sm font-bold`}>
                {(date == new Date().toDateString()) && <div className="h-[2px] mx-auto w-10 bg-zinc-900"></div>}
                {!tasks.length ? <div className="w-full p-5 text-center">No tasks this day</div> : 
                    tasks.map((task, i) => {
                        return (
                            <Task key={i} task={task} />
                        )
                    })
                }
            </div>
        </div>
    )
}

const TaskCalendar = () => {
    const today = new Date();
    const day = today.toDateString().substring(8, 10);
    const month = today.toDateString().substring(4, 7);
    const year = today.toDateString().substring(11);

    const [weeks, setWeeks] = useState("1");

    let days: string[] = [today.toDateString()];
    for (let i=1; i<Number(weeks)*7; i++) {
        let date = today;
        date.setDate(date.getDate() + 1);
        days.push(date.toDateString());
    }
    
    return (
        <div>
            <div className="flex justify-between">
                  <div className="text-2xl font-semibold text-zinc-950 flex items-center gap-2">
                      {day} {month},
                      <span className="text-zinc-400"> {year}</span>
                  </div>
                  <div>
                      <Button className="bg-zinc-900 flex gap-3 cursor-pointer group pr-1 pl-5 rounded-3xl">Add Task <BsPlusCircleFill className="h-7 w-7 text-white group-hover:scale-110 transition" /></Button>
                  </div>
                  <div className="flex gap-2 items-center cursor-pointer">
                      <span className="text-xs font-semibold text-zinc-500">Show: </span>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="flex gap-2 rounded-3xl border-foreground border-2 font-semibold">{weeks} week{weeks != "1" && 's'}<IoIosArrowDown /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56">
                              <DropdownMenuRadioGroup value={weeks} onValueChange={setWeeks}>
                                  <DropdownMenuRadioItem value="1" className="font-semibold cursor-pointer">1 week</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="2" className="font-semibold cursor-pointer">2 weeks</DropdownMenuRadioItem>
                                  <DropdownMenuRadioItem value="3" className="font-semibold cursor-pointer">3 weeks</DropdownMenuRadioItem>
                              </DropdownMenuRadioGroup>
                          </DropdownMenuContent>
                      </DropdownMenu>
                  </div>
              </div>
            <div className="flex overflow-scroll no-scrollbar h-[90%]">
                {days.map((day, i) => {
                    return (<Day key={i} date={day} />)
                })}
            </div>
        </div>
    )
}

export default TaskCalendar;