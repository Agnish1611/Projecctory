import React, { useState, useEffect } from 'react';

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
import { userAtom } from '@/atoms/user-atom';
import { tasksAtom } from '@/atoms/tasks-atom';
import { Skeleton } from "@/components/ui/skeleton"

function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-[125px] w-[250px] rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-4 w-[250px]" />
        <Skeleton className="h-4 w-[200px]" />
      </div>
    </div>
  )
}


const getTaskUrl = '/task/';
const priorityArray = ["ignorant", "normal", "important", "urgent"];
const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];

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
        return (<Card key={i} className=' w-[300px] m-10'>
              <CardHeader>
                <CardTitle className='flex flex-wrap gap-2'>
                <span className={!taskValue.completed?'text-xs font-bold bg-muted-foreground px-3 py-1 rounded-full' : 'text-xs font-bold px-3 py-1 rounded-full '+colors[taskValue.priority]}>{priorityArray[taskValue.priority]}</span>
                  {taskValue.labels.map((label, i) => {
                    return (<span key={i} className={!taskValue.completed?'text-xs font-bold bg-muted-foreground px-3 py-1 rounded-full' : 'text-xs font-bold px-3 py-1 rounded-full border'}>#{label}</span>)
                  })}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className={!taskValue.completed?'font-semibold text-md text-muted-foreground line-through' : 'font-semibold text-md'}>{taskValue.description}</p>
              </CardContent>
              <CardFooter>
                {(taskValue.date)? (
                  <p className='text-sm text-muted-foreground'><span className='font-semibold'>Due Date:</span> {taskValue.date.split('T')[0]}</p>
                ) : (<></>)}
              </CardFooter>
            </Card>)
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