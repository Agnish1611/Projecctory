import { useForm } from "react-hook-form";
import { CalendarIcon } from "@radix-ui/react-icons";

import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "@/store/user";
import { renderTasksAtom } from "@/store/renderTasks";

import axios from "@/api/axiosConfig";

import z from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";

import { useToast } from "./ui/use-toast";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";

import { cn } from "@/lib/utils";
import { format } from "date-fns";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";

const tasksUrl = '/tasks/';

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

function AddTaskForm() {
    const { toast } = useToast();
    const user = useRecoilValue(userAtom);
    const [renderTasks, setRenderTasks] = useRecoilState(renderTasksAtom);
    const axiosPrivate = useAxiosPrivate();

    const form = useForm<z.infer<typeof formSchema>>({
      resolver: zodResolver(formSchema)
    });

    interface recurringObj {
        type: string,
        endDate: string
    }

    interface reqObj {
        description: string,
        priority: string,
        date?: string,
        labels?: string[],
        time?: string,
        recurring?: recurringObj
    }
   
    async function onSubmit(values: z.infer<typeof formSchema>) {
      let reqObj: reqObj = {
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
        const res = await axiosPrivate.post(tasksUrl, reqObj, {
            headers: {'Content-Type': 'application/json'}
        });
        setRenderTasks(renderTasks+1);
        toast({
            variant: 'successful',
            title: "Successfully created the tasks"
        });
        console.log(res);
        return;
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

export default AddTaskForm;