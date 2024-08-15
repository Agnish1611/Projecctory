import { IoIosArrowDown } from "react-icons/io";
import { BsPlusCircleFill } from "react-icons/bs";
import { LuAlarmClock } from "react-icons/lu";
import { VscSettings } from "react-icons/vsc";
import { IoSearchOutline } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

import {
    Dialog,
    DialogContent,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
  
import { useEffect, useState } from "react";
import axios from "@/api/axiosConfig";
import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userAtom } from "@/store/user";
import { renderTasksAtom } from "@/store/renderTasks";
import AddTaskForm from "./AddTaskForm";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { useNavigate } from "react-router-dom";
import { Skeleton } from "./ui/skeleton";

const tasksUrl = '/tasks/';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const priorites = ['normal', 'important', 'urgent'];
const colors = ['bg-green-400', 'bg-yellow-300', 'bg-red-400'];

const Task = ({task}) => {
    const [isCompleted, setIsCompleted] = useState(task.completed == "true");
    const axiosPrivate = useAxiosPrivate();

    const [renderTasks, setRenderTasks] = useRecoilState(renderTasksAtom);

    async function handleCheckbox (url) {
        try {
          await axiosPrivate.patch(url,
            { completed: !isCompleted },
            { headers: { 'Content-Type': 'application/json' }}
          );
          setRenderTasks(renderTasks+1);
        } catch (error) {
          console.log(error);
        }
    }

    return (
        <div className={`w-full flex flex-col h-fit min-h-[150px] ${!isCompleted ? colors[priorites.indexOf(task?.priority)] : `bg-zinc-400`} rounded-3xl p-5 my-5`}>
            <div className="checkbox-wrapper-24 relative top-[-3px] left-[140px]">
                <input type="checkbox" id="check-24" name="check" checked={isCompleted} readOnly />
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
                    {task.labels.map((label, i) => {
                        return (
                            <div key={i} className="px-2 mx-1 text-xs w-fit border border-zinc-600 rounded-full">{label}</div>
                        )
                    })}
                </div>
            }
        </div>
    )
}

const Day = ({date, priority, label}) => {
    const day = date.substring(8, 10);
    const week = date.substring(0, 3);
    const monthNo = months.indexOf(date.substring(4, 7))+1;
    const month = monthNo < 10 ? '0'+monthNo : ''+monthNo;
    const year = date.substring(11);
    const dateString = day+'-'+month+'-'+year;

    const [tasksLoading, setTasksLoading] = useState(true);

    const axiosPrivate = useAxiosPrivate();

    const navigate = useNavigate();

    const [tasks, setTasks] = useState([]);
    const renderTasks = useRecoilValue(renderTasksAtom);

    useEffect(() => {
        const priorityQuery = priority == '' ? '' : '&priority='+priority ;
        const labelQuery = label == '' ? '' : '&label='+label;
        axiosPrivate.get(tasksUrl+'?date='+dateString+priorityQuery+labelQuery)
            .then(res => new Promise(resolve => {
                    setTimeout(() => {
                        resolve(res);
                        setTasks(res.data?.data);
                        setTasksLoading(false);
                    }, 500);
                })
            )
            .catch((err) => {
                console.log(err);
            })
    }, [priority, label, renderTasks]);
    
    return (
        <div className="min-w-[200px] pt-10 mx-5">
            <div className={`text-center text-5xl overflow-y-hidden font-bold ${(date == new Date().toDateString()) ? `text-zinc-900` : `text-zinc-400`}`}>{day}<span className="text-sm">/ {week}</span></div>
            <div className={`max-h-[310px] mt-5 h-fit overflow-y-scroll overflow-x-hidden no-scrollbar text-sm font-bold`}>
                {(date == new Date().toDateString()) && <div className="h-[2px] mx-auto w-10 bg-zinc-900"></div>}
                {tasksLoading 
                    ? <Skeleton className="h-[150px] w-full" />
                    : !tasks.length 
                        ? <div className="w-full p-5 text-center">No tasks this day</div>  
                        : tasks.map((task, i) => {
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

    const [priority, setPriority] = useState('');
    const [label, setLabel] = useState('');
    const [labelValue, setLabelValue] = useState('');
    
    return (
        <div>
            <div className="flex justify-between">
                  <div className="text-2xl font-semibold text-zinc-950 flex items-center gap-2">
                      {day} {month},
                      <span className="text-zinc-400"> {year}</span>
                  </div>
                  <div>
                    <Dialog>
                        <DialogTrigger asChild>
                            <Button className="bg-zinc-900 flex gap-3 cursor-pointer group pr-1 pl-5 rounded-3xl">Add Task <BsPlusCircleFill className="h-7 w-7 text-white group-hover:scale-110 transition" /></Button>
                        </DialogTrigger>
                        <DialogContent className="bg-zinc-900 border-none text-zinc-100 w-[400px]">
                            <DialogTitle className="font-quicksand">Create a Task</DialogTitle>
                            <AddTaskForm />
                        </DialogContent>
                    </Dialog>
                  </div>
                  <div className="flex gap-2 items-center cursor-pointer">
                      <span className="text-xs font-semibold text-zinc-500">Show: </span>
                      <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                              <Button variant="outline" className="flex gap-2 rounded-3xl border-foreground border-2 font-semibold">{weeks} week{weeks != "1" && 's'}<IoIosArrowDown /></Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent className="w-56" defaultValue='1'>
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
                    return (<Day key={i} date={day} label={labelValue} priority={priority} />)
                })}
            </div>
            <div className="px-10 w-[60rem] h-10 rounded-full glass-bg absolute bottom-[224px] font-semibold text-xs left-[215px] text-white flex justify-around items-center">
                <div className="pr-10 flex gap-2 items-center text-sm border-r border-accent"><VscSettings className="h-5 w-5" /> Filters</div>
                <div className="flex gap-4 items-center px-10 border-r border-accent">
                    <span className="font-regular text-zinc-400">Priority:</span>
                    {
                        colors.map((color, i) => {
                            return (
                                <TooltipProvider key={i}>
                                    <Tooltip>
                                        <TooltipTrigger asChild >
                                            <div className={`h-3 w-3 rounded-full ${color} cursor-pointer transition ${priority == priorites[i] && `scale-150`}`} onClick={() => {setPriority(priorites[i])}}></div>
                                        </TooltipTrigger>
                                        <TooltipContent>
                                            <p>{priorites[i]}</p>
                                        </TooltipContent>
                                    </Tooltip>
                                </TooltipProvider>
                            )
                        })
                    }
                </div>
                <div className="px-10 flex gap-5 items-center">
                    <span className="font-regular text-zinc-400">Label:</span>
                    <input className="py-1 px-3 w-fit rounded-full bg-transparent border border-accent" placeholder="Search label" value={label} onChange={(e) => setLabel(e.target.value)} />
                    <IoSearchOutline className="h-5 w-5" onClick={() => {setLabelValue(label)}}  />
                </div>
                <div className="px-10 border-l border-accent">
                    <Button className="text-xs py-1 px-3 h-fit rounded-full" variant='ghost' onClick={() => {
                        setLabelValue('');
                        setLabel('');
                        setPriority('');
                    }}><GrPowerReset className="h-3 w-3 mr-2" /> Reset</Button>
                </div>
            </div>
        </div>
    )
}

export default TaskCalendar;