import React, { useState, useEffect } from 'react';

import { useNavigate } from 'react-router-dom';

import axios from '@/api/axios-config';

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';

import { useRecoilValue, useRecoilState } from 'recoil';
import { userAtom } from '@/store/user-atom';
import { tasksAtom } from '@/store/tasks-atom';
import { taskSelector } from '@/store/task-selector';
import { completedSelector } from '@/store/completed-selector';


const getTaskUrl = '/task/';
const completeTaskUrl = '/task/complete/'
const priorityArray = ["ignorant", "normal", "important", "urgent"];
const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];

function SingleTask({taskId}) {
  const navigate  = useNavigate();

  const task = useRecoilValue(taskSelector(taskId));
  console.log(task);

  const [isCompleted, setIsCompleted] = useState(task.completed == 'true');


  async function handleCheckbox (url) {
    console.log('inside');
    await axios.patch(url+'?value='+!isCompleted);
      
  }

  if (!task._id) return (<div>Loading ....</div>);
  else {
    return (
            <Card className=' w-[300px] m-10'>
              <div className="checkbox-wrapper-24 m-3">
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
              <CardFooter>
                {(task.date)? (
                  <p className='text-sm text-muted-foreground'><span className='font-semibold'>Due Date:</span> {task.date.split('T')[0]}</p>
                ) : (<></>)}
              </CardFooter>
            </Card>
    )
  }
}

function Tasks() {
  const user = useRecoilValue(userAtom);
  const [tasksValue, setTasksValue] = useRecoilState(tasksAtom);


    useEffect(() => {
      axios.get(getTaskUrl+user.id)
        .then((res) => {
          return setTasksValue(res.data.data)}
        )
        .catch((err) => {
          console.log(err);
          return [];
        });
    },[]);


  if (tasksValue.length == 0) { return (<div className='p-5 m-5 text-sm font-semibold text-muted-foreground'>No tasks today</div>)}
  else {
    return (
      <>
      {tasksValue.map((taskValue, i) => {
        return (<SingleTask key={i} taskId={taskValue._id}/>)
      })}
      </>
    )
  }
}

function Today() {

  return (
    <section className='h-min w-[80rem] relative left-[15rem]'>
        <div className='text-primary text-4xl font-semibold mt-10 p-10 pl-20 border-b mx-10'>Today</div>
        <div className='m-10 p-5'>
          <div className='text-xl font-semibold m-5'>My Tasks</div>
          <div className='border rounded-lg flex flex-wrap'>
            <Tasks />
          </div>
        </div>
    </section>
  )
}

export default Today;