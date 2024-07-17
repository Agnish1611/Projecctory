import React, { useState, useEffect, Suspense } from 'react';

import axios from '@/api/axios-config';

import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/components/ui/use-toast";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar"

import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

import { IoAddCircle, IoSearch  } from "react-icons/io5";
import { CalendarIcon } from "@radix-ui/react-icons";
import { LuSettings2 } from "react-icons/lu";

import { useRecoilValue, useRecoilState, useRecoilStateLoadable } from 'recoil';
import { userAtom } from '@/store/user-atom';
import { tasksAtom } from '@/store/tasks-atom';
import { taskSelector } from '@/store/task-selector';
import { Button } from '@/components/ui/button';

import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { tasksTodayAtom } from '@/store/tasksToday-atom';

const labelsRegex = /^[a-zA-Z ]*$/;
 
const formSchema = z.object({
  description: z.string().max(300, 'Description can be max 300 characters'),
  priority: z.string(),
  labels: z.string().regex(labelsRegex, 'Can contain only alphabets').optional(),
  date: z.date().optional(),
  recurring: z.object({
    type: z.string().optional(),
    start: z.date().optional(),
    end: z.date().optional()
  }),
});

const getTaskUrl = '/task/';
const completeTaskUrl = '/task/complete/';
const createTaskUrl = '/task/';
const priorityArray = ["ignorant", "normal", "important", "urgent"];
const colors = ['bg-green-500', 'bg-yellow-500', 'bg-orange-500', 'bg-red-500'];

function SingleTask({taskId}) {
  const task = useRecoilValue(taskSelector(taskId));
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
            </Card>
    )
  }
}

function Tasks() {
  const user = useRecoilValue(userAtom);
  const [tasksValue, setTasksValue] = useRecoilState(tasksTodayAtom);

    // useEffect(() => {
    //   axios.get(getTaskUrl+user.id)
    //     .then((res) => {
    //       return setTasksValue(res.data.data)}
    //     )
    //     .catch((err) => {
    //       console.log(err);
    //       return [];
    //     });
    // },[]);


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

function CreateTaskForm() {
  const user = useRecoilValue(userAtom);
  const {toast} = useToast();
  const [tasks, setTasks] = useRecoilState(tasksTodayAtom);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
  });

  function add_days(dt, n) {
    return new Date(dt.setDate(dt.getDate() + n)); 
  }

  async function onSubmit(values: z.infer<typeof formSchema>) {
    interface objSchema {
      description: string,
      labels: string[],
      date: string,
      priority: number,
      recurring?: boolean,
      recurringType?: string,
      startDate?: string,
      endDate?: string
    }
    let reqObj: objSchema = {
      description: values.description,
      labels: values.labels.trim().split(/\s+/),
      date: add_days(values.date, 1).toISOString().split("T")[0],
      priority: priorityArray.indexOf(values.priority)
    }
    if (values.recurring.type) {
      if (!values.recurring.start || !values.recurring.end) {
        toast({
          variant: 'destructive',
          title: "Failed to create the task",
          description: 'Both recurring start and end date need to be specified along with type'
        });
        return;
      }
      reqObj = 
      {
        ...reqObj, 
        recurringType: values.recurring.type,
        startDate: values.recurring.start.toISOString(),
        endDate: values.recurring.start.toISOString()
      };
    }
    try {
      const response = await axios.post(createTaskUrl+user.id, JSON.stringify(reqObj),
        {
          headers: { 'Content-Type': 'application/json' },
        }
      );
      toast({
        variant: 'successful',
        title: "Successfully created a task",
        description: 'You can now close the dialog'
      });
      if (reqObj.date == new Date(new Date().getTime() + 330*60000).toISOString().split('T')[0]) setTasks([...tasks, response.data.data]);
      console.log(response.data.data.date);
    } catch (error) {
      toast({
        variant: 'destructive',
        title: "Failed to create the task"
      });
      console.log(error);
    }
  }

  return (<Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-2">
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Description</FormLabel>
              <FormControl>
                <Input placeholder="This is a new task" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="labels"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Labels {'(separete by spaces)'}</FormLabel>
              <FormControl>
                <Input placeholder="assignment selfstudy" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className='flex items-center justify-between h-[70px]'>
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Date</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[160px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date(new Date().setDate(new Date().getDate() - 1)) || date > new Date(new Date().setFullYear(new Date().getFullYear() + 1))
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="priority"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Priority</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger className='w-[120px]'>
                      <SelectValue placeholder="ignorant" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="ignorant">ignorant</SelectItem>
                    <SelectItem value="normal">normal</SelectItem>
                    <SelectItem value="important">important</SelectItem>
                    <SelectItem value="urgent">urgent</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className='p-3 border rounded-lg grid grid-cols-2'>
          <FormField
            control={form.control}
            name="recurring.type"
            render={({ field }) => (
              <FormItem className='col-span-2 mb-5'>
                <FormLabel>Recurring type</FormLabel>
                <Select onValueChange={field.onChange}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a recurring type for your task" />
                    </SelectTrigger>
                  </FormControl>
                  <FormDescription>Your task will repeat accoring to the specified type</FormDescription>
                  <SelectContent>
                    <SelectItem value="Daily">Everyday</SelectItem>
                    <SelectItem value="Monday">Every Monday</SelectItem>
                    <SelectItem value="Tuesday">Every Tuesday</SelectItem>
                    <SelectItem value="Wednesday">Every Wednesday</SelectItem>
                    <SelectItem value="Thursday">Every Thursday</SelectItem>
                    <SelectItem value="Friday">Every Friday</SelectItem>
                    <SelectItem value="Saturday">Every Saturday</SelectItem>
                    <SelectItem value="Sunday">Every Sunday</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recurring.start"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Start</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[160px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date(new Date().getFullYear() + 5, new Date().getMonth(), new Date().getDay())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="recurring.end"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>End</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-[160px] pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Pick a date</span>
                        )}
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date < new Date() || date > new Date(new Date().getFullYear() + 5, new Date().getMonth(), new Date().getDay())
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
          <Button type="submit" className='mt-3'>Create task</Button>
      </form>
    </Form>)
}

function CreateDialog() {
  return (
    <Dialog>
              <DialogTrigger asChild>
                <IoAddCircle className='h-8 w-8 hover:scale-125 transition cursor-pointer' /> 
              </DialogTrigger>
              <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                  <DialogTitle>Create a new Task today</DialogTitle>
                </DialogHeader>
                <CreateTaskForm />
              </DialogContent>
            </Dialog>
  )
}

function FilterMenu() {
  const [completed, setCompleted] = useState("");
  const user = useRecoilValue(userAtom);
  const [tasks, setTasks] = useRecoilState(tasksTodayAtom);

  useEffect(() => {
      if (completed == "true") {
          axios.get(getTaskUrl+user.id+'?completed=true&date='+new Date(new Date().getTime() + 330*60000).toISOString().split('T')[0])
            .then((res) => {setTasks(res.data.data)})
            .catch((err) => {console.log(err)});
      } else if (completed == "false") {
        axios.get(getTaskUrl+user.id+'?not_completed=true&date='+new Date(new Date().getTime() + 330*60000).toISOString().split('T')[0])
        .then((res) => {setTasks(res.data.data)})
        .catch((err) => {console.log(err)});
      }
  }, [completed]);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='px-3'><LuSettings2 className='h-6 w-6' /></Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56">
        <DropdownMenuRadioGroup value={completed} onValueChange={setCompleted}>
          <DropdownMenuRadioItem value="true">Completed</DropdownMenuRadioItem>
          <DropdownMenuRadioItem value="false">Not Completed</DropdownMenuRadioItem>
        </DropdownMenuRadioGroup>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

function SearchLabels() {
  const [tasks, setTasks] = useRecoilState(tasksTodayAtom);
  const user = useRecoilValue(userAtom);
  const [label, setLabel] = useState("");

  async function search() {
    try {
      const res = await axios.get(getTaskUrl+user.id+'?label='+label);
      setTasks(res.data.data);
    } catch (error) {
      console.log(error);
    }
  }

  return (<div className='rounded-md flex justify-between items-center'>
    <input className='border w-44 h-10 bg-background rounded-lg text-sm pl-5 pr-10 py-5 font-regular' placeholder='Search label' value={label} onChange={(e) => {setLabel(e.target.value)}} />
    <IoSearch className='relative left-[-35px] cursor-pointer' onClick={search} />
  </div>)
}

function Today() {

  
  const [render, setRender] = useState(false);

  useEffect(() =>{
    setTimeout(() => {
      setRender(true);
    }, 1000);
  }, []);

  return (
    <section className='h-min w-[80rem] relative left-[15rem]'>
        <div className='text-primary text-4xl font-semibold mt-10 p-10 pl-20 border-b mx-10'>Today</div>
        <div className='m-10 p-5'>
          <div className='text-xl font-semibold flex m-5 gap-10'>
            <span>My Tasks</span>
            <CreateDialog />
            <Suspense>
              <FilterMenu />
            </Suspense>
            <Suspense>
              <SearchLabels />
            </Suspense>
          </div>
          <div className='border rounded-lg flex flex-wrap'>
            <Suspense fallback={<SkeletonCard />}>
              {render ? <Tasks /> : <SkeletonCard />}
            </Suspense>
          </div>
        </div>
    </section>
  )
}

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3 m-10">
      <Skeleton className="h-[169px] w-[300px] rounded-xl" />
    </div>
  )
}

export default Today;