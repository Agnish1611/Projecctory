import { IoIosArrowDown } from "react-icons/io";
import { BsPlusCircleFill } from "react-icons/bs";
import { LuAlarmClock } from "react-icons/lu";
import { VscSettings } from "react-icons/vsc";
import { IoSearchOutline } from "react-icons/io5";
import { GrPowerReset } from "react-icons/gr";
import { CalendarIcon } from "@radix-ui/react-icons";

import { Input } from "@/components/ui/input";
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

import {
  Form,
  FormControl,
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

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { Calendar } from "@/components/ui/calendar";
import { useToast } from "./ui/use-toast";
  
import { useEffect, useState } from "react";
import axios from "@/api/axiosConfig";
import { useRecoilValue } from "recoil";
import { userAtom } from "@/store/user";
import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

const tasksUrl = '/tasks/';
const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const priorites = ['normal', 'important', 'urgent'];
const colors = ['bg-green-400', 'bg-yellow-300', 'bg-red-400'];

const formSchema = z.object({
    description: z.string().max(300, 'Description can be max 300 characters'),
    priority: z.string(),
    labels: z.string().regex(/^[a-zA-Z ]*$/, 'Can contain only alphabets').optional(),
    date: z.date().optional(),
    startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/).optional(),
    rec_type: z.enum(['0', '1', '2', '3', '4', '5', '6', '7']).optional(),
    rec_end: z.date().optional()
});

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

    const user = useRecoilValue(userAtom);

    const [tasks, setTasks] = useState([]);

    useEffect(() => {
        const priorityQuery = priority == '' ? '' : '&priority='+priority ;
        const labelQuery = label == '' ? '' : '&label='+label;
        axios.get(tasksUrl+'?user='+user.id+'&date='+dateString+priorityQuery+labelQuery)
            .then((res) => {
                setTasks(res.data?.data);
            })
            .catch((err) => {
                console.log(err);
            })
    }, [priority, label]);
    
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

function AddTaskForm() {
    const { toast } = useToast();
    const user = useRecoilValue(userAtom);

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema)
    });

    interface recurringObj {
        type: string,
        endDate: string
    }

    interface reqObj {
        user: string,
        description: string,
        priority: string,
        date?: string,
        labels?: string[],
        time?: string,
        recurring?: recurringObj
    }
   
    function onSubmit(values: z.infer<typeof formSchema>) {
      let reqObj: reqObj = {
        user: user.id,
        description: values.description,
        priority: values.priority,
      }

      if (values.date) {
        const day = values.date.getDate();
        const month = values.date.getMonth()+1;
        const year = values.date.getFullYear();
        const dateString = (day>9 ? day+'' : '0'+day) + '-' + (month>9 ? month+'' : '0'+month) + '-' + year;
        reqObj = { ...reqObj, date: dateString };
      }

      if (values.labels) reqObj = { ...reqObj, labels: values.labels.trim().split(/\s+/) }

      if ((values.startTime && !values.endTime) || (!values.startTime && values.endTime)) {
        toast({
            variant: 'destructive',
            title: "Failed to create the task",
            description: 'Both start and end time need to be specified if you want to add time to your task'
        });
        return;
      }
      else if (values.startTime && values.endTime) reqObj = { ...reqObj, time: values.startTime+'-'+values.endTime }

      if ((values.rec_type && !values.rec_end) || (!values.rec_type && values.rec_end)) {
        toast({
            variant: 'destructive',
            title: "Failed to create the task",
            description: 'Both recurring type and end date need to be specified to make your task recurring'
        });
        return;
      }
      else if (values.rec_type && values.rec_end) {
        const day = values.rec_end.getDate();
        const month = values.rec_end.getMonth()+1;
        const year = values.rec_end.getFullYear();
        const dateString = (day>9 ? day+'' : '0'+day) + '-' + (month>9 ? month+'' : '0'+month) + '-' + year;
        const recObj: recurringObj = {
            type: values.rec_type,
            endDate: dateString
        }
        reqObj = { ...reqObj, recurring: recObj }
      }

      try {
        const res = axios.post(tasksUrl, reqObj, {
            headers: {'Content-Type': 'application/json'}
        });
        toast({
            variant: 'successful',
            title: "Successfully created the tasks"
        });
        console.log(res);
      } catch (error) {
        toast({
            variant: 'destructive',
            title: "Failed to create the task"
        });
        console.log(error);
      }
    }

    return (
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 font-quicksand">
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
                    <FormLabel>Labels (separete by spaces)</FormLabel>
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
                    <FormLabel className="mb-2">Date</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-[160px] pl-3 text-left font-normal bg-transparent",
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
                        <SelectValue placeholder='normal' />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent defaultValue='normal'>
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
            <div className="flex flex-col">
                <div className="font-semibold text-sm mb-3">Time (optional)</div>
                <div className="flex justify-between items-center gap-5">
                <FormField
                    control={form.control}
                    name="startTime"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="09:00" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                -
                <FormField
                    control={form.control}
                    name="endTime"
                    render={({ field }) => (
                        <FormItem>
                        <FormControl>
                            <Input placeholder="10:30" {...field} />
                        </FormControl>
                        <FormMessage />
                        </FormItem>
                    )}
                />
                </div>
            </div>
            <div className='p-3 border rounded-lg flex flex-col'>
            <div className="text-xs text-zinc-500 mb-1">Your task will repeat after the specified number of days</div>
            <div className="flex gap-5 items-center justify-between">
            <FormField
                control={form.control}
                name="rec_type"
                render={({ field }) => (
                <FormItem className='col-span-2 mb-2'>
                    <FormLabel>Repeat after</FormLabel>
                    <Select onValueChange={field.onChange}>
                    <FormControl>
                        <SelectTrigger>
                        <SelectValue />
                        </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                        <SelectItem value="0">Everyday</SelectItem>
                        <SelectItem value="1">Every 1 day</SelectItem>
                        <SelectItem value="2">Every 2 days</SelectItem>
                        <SelectItem value="3">Every 3 days</SelectItem>
                        <SelectItem value="4">Every 4 days</SelectItem>
                        <SelectItem value="5">Every 5 days</SelectItem>
                        <SelectItem value="6">Every 6 days</SelectItem>
                        <SelectItem value="7">Every 7 days</SelectItem>
                    </SelectContent>
                    </Select>
                    <FormMessage />
                </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="rec_end"
                render={({ field }) => (
                <FormItem className="flex flex-col">
                    <FormLabel>End Date</FormLabel>
                    <Popover>
                    <PopoverTrigger asChild>
                        <FormControl>
                        <Button
                            variant={"outline"}
                            className={cn(
                            "w-[160px] pl-3 text-left font-normal bg-transparent",
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
            </div>
            <Button variant='secondary' type="submit">Submit</Button>
          </form>
        </Form>
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
                                <TooltipProvider>
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