import axios from '@/api/axios-config';
import { taskSelector } from '@/store/task-selector';
import { tasksUpcomingAtom } from '@/store/tasksUpcoming-atom';
import { userAtom } from '@/store/user-atom';
import React, { Suspense, useEffect, useState } from 'react';
import { useRecoilValue, useRecoilValueLoadable } from 'recoil';

import { IoReturnUpForwardOutline } from "react-icons/io5";

import { Skeleton } from "@/components/ui/skeleton";

import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";

import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"

import { taskUpcomingSelector } from '@/store/taskUpcoming-selector';
import { Button } from '@/components/ui/button';

const completeTaskUrl = '/task/complete/';
const priorityArray = ["ignorant", "normal", "important", "urgent"];
const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];
const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

function SkeletonCard() {
    return (
      <div className="flex flex-col space-y-3 m-10">
        <Skeleton className="h-[169px] w-[300px] rounded-xl" />
      </div>
    )
  }

function SingleTask({taskId}) {
    const task = useRecoilValue(taskUpcomingSelector(taskId));
    console.log(task);
  
    const [isCompleted, setIsCompleted] = useState(task.completed == "true");
  
    useEffect(() => {
      console.log('inside');
      setIsCompleted(task.completed == "true");
    }, [task]);
  
    async function handleCheckbox (url) {
      try {
        await axios.patch(url+'?value='+!isCompleted);
      } catch (error) {
        console.log(error);
      }
    }
  
    if (!task._id) return (<SkeletonCard />);
    else {
      return (
              <Card className=' w-[300px] m-10'>
                <div className="checkbox-wrapper-24 m-3 ml-5">
                  <input type="checkbox" id="check-24" name="check" checked={isCompleted} />
                  <label htmlFor="check-24" onClick={() => {
                      setIsCompleted(!isCompleted);
                      handleCheckbox(completeTaskUrl+taskId);
                    }}>
                    <span></span>
                  </label>
                </div>
                <CardHeader>
                  <CardTitle className='flex flex-wrap gap-2'>
                  <span className={isCompleted?'text-xs font-bold bg-muted-foreground px-3 py-1 rounded-full' : 'text-xs font-bold px-3 py-1 rounded-full '+colors[task.priority]}>{priorityArray[task.priority]}</span>
                    {task.labels.map((label, i) => {
                      return (<span key={i} className={isCompleted?'text-xs font-bold bg-muted-foreground px-3 py-1 rounded-full' : 'text-xs font-bold px-3 py-1 rounded-full border'}>#{label}</span>)
                    })}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className={isCompleted?'font-semibold text-md text-muted-foreground line-through' : 'font-semibold text-md'}>{task.description}</p>
                </CardContent>
                <CardFooter className='flex justify-end flex-row'>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild><Button variant='ghost' className='px-5 m-0 py-1'><IoReturnUpForwardOutline className='h-5 w-5' /></Button></TooltipTrigger>
                    <TooltipContent>
                      <p>Shift to next day</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
                </CardFooter>
              </Card>
      )
    }
  }

function Upcoming() {
    const upcomingTasks = useRecoilValueLoadable(tasksUpcomingAtom);

    const [render, setRender] = useState(false);

    useEffect(() =>{
      setTimeout(() => {
        setRender(true);
      }, 1500);
    }, []);

    let dates = [];
    for (let i=0; i<7; i++) {
        let date = new Date(new Date().getTime() + 330*60000);
        date.setDate(date.getDate() + i);
        dates[i] = date.getDay();
    }

    if (upcomingTasks.state == 'loading') {
        return (<div>Loading ...</div>);
    }
    else if (upcomingTasks.state == 'hasValue') {
        return (
          <section className='left-[15rem] relative'>
            <div className='text-primary w-[3010px] text-4xl font-semibold mt-10 p-10 pl-20 border-b mx-10'>Upcoming</div>
            <div className='h-min w-min flex gap-10 p-10'>
                {upcomingTasks.contents.map((taskValues, i) => {
                    return (
                            <div key={i} className='w-[400px] h-min border rounded-lg flex flex-col items-center'>
                                <div className='w-full py-5 text-lg font-semibold border-b flex justify-center items-center'>{days[dates[i]]}</div>
                                {(taskValues.length == 0) ? <div className='p-5 font-semibold text-sm text-muted-foreground'>No tasks</div> : 
                                    taskValues.map((task, i) => {return (
                                        <Suspense key={i} fallback={<SkeletonCard />}>
                                            {render ? <SingleTask taskId={task._id} /> : <SkeletonCard />}
                                        </Suspense>
                                    )})
                                }
                            </div>
                    )
                })}
            </div>
          </section>
          )
    }
    else {
        return (<div>Error</div>)
    }
}

export default Upcoming