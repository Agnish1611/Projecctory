import { IoIosArrowDown } from "react-icons/io";
import { FiSun } from "react-icons/fi";
import { LuAlarmClock } from "react-icons/lu";
import { BsArrowUpRightCircle } from "react-icons/bs";
import { BiSolidCopy } from "react-icons/bi";
import { IoCheckmarkDoneSharp } from "react-icons/io5";

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { useState } from "react";

const meetings = [
    {
        description: 'Introductory Meet',
        project: 'Projecctory',
        access: 'Admin',
        link: 'meet.google.com/ful-shqq-cmt',
        status: 'In progress',
        time: '02:00-03:00'
    },
    {
        description: 'System Design Meet',
        project: 'Projecctory',
        access: 'Admin',
        link: 'meet.google.com/adf-cksd-mcf',
        status: 'Upcoming',
        time: '09:00-10:00'
    },
    {
        description: 'Idea Selection Meet',
        project: 'Hackathon Project',
        access: 'Invited',
        link: 'meet.google.com/hka-cbus-ejb',
        status: 'Upcoming',
        time: '12:00-13:00'
    },
    {
        description: 'System Design Meet',
        project: 'Hackathon Project',
        access: 'Invited',
        link: 'meet.google.com/ksb-cuve-oue',
        status: 'Upcoming',
        time: '16:00-17:00'
    },
    {
        description: 'Task Assignment Meet',
        project: 'Hackathon Project',
        access: 'Invited',
        link: 'meet.google.com/cku-skub-ebu',
        status: 'Upcoming',
        time: '21:00-22:00'
    },
]

const colors = ['bg-cyan-200', 'bg-purple-400', 'bg-pink-400'];

const Meeting = ({meeting, color}) => {
    const [copied, setCopied] = useState(false);
    return (
        <div className={`w-full h-fit min-h-[150px] ${color} rounded-3xl my-5 p-5`}>
            <div className="flex justify-between items-center">
                <div className="flex flex-col">
                    <div className="flex text-xs font-semibold text-zinc-600 items-center mb-2 gap-2"><LuAlarmClock className="h-4 w-4" /> Time: {meeting.time}</div>
                    <div className="text-sm font-bold">{meeting.description}</div> 
                </div>
                <a target="_blank" href={'https://'+meeting.link}><BsArrowUpRightCircle className="h-8 w-8 hover:scale-110 cursor-pointer transition" /></a>
            </div>
            <div className="my-3 flex justify-between">
                <div className="text-xs font-semibold text-zinc-600">Project: <span className="text-zinc-800">{meeting.project}</span></div>
                <div className="text-xs font-semibold text-zinc-600">Access: <span className="text-zinc-800">{meeting.access}</span></div>
            </div>
            <div className="bg-zinc-900 w-full text-xs py-2 px-3 items-center group rounded-full font-bold flex justify-between text-zinc-300 cursor-pointer" onClick={() => {
                    navigator.clipboard.writeText(meeting.link);
                    setCopied(true);
                }}>
                {meeting.link} 
                {!copied ? 
                <BiSolidCopy className="h-3 w-3 group-hover:scale-125 transition text-zinc-300" /> :
                <IoCheckmarkDoneSharp className="h-3 w-3 text-zinc-300" />}
            </div>
            <div className="text-xs mt-3 font-semibold flex gap-2 items-center text-zinc-600">
                Status: 
                <span className="border-zinc-900 border text-zinc-900 px-3 py-1 rounded-full">{meeting.status}</span>
            </div>
        </div>
    )
}

const Meetings = () => {
    const today = new Date();

    const [date, setDate] = useState<Date>()
    let day = today.toDateString().substring(8, 10);
    let month = today.toDateString().substring(4, 7);
    let year = today.toDateString().substring(11);

    if (date) {
        day = date.toDateString().substring(8, 10);
        month = date.toDateString().substring(4, 7);
        year = date.toDateString().substring(11);
    }

    return (
        <div>
            <div className="flex justify-end">
                <Popover>
                    <PopoverTrigger asChild>
                        <Button className="flex items-center gap-2 text-xs font-bold text-zinc-300"><FiSun className="h-3 w-3" />{day} {month}, {year} <IoIosArrowDown className="h-4 w-4" /></Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                        mode="single"
                        selected={date}
                        onSelect={setDate}
                        disabled={(date) =>
                            date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() +1))
                        }
                        initialFocus
                        />
                    </PopoverContent>
                </Popover>
            </div>
            <div className="text-3xl font-bold text-zinc-100 my-3 px-5">Meetings ({meetings.length})</div>
            <div className="overflow-y-scroll max-h-[550px] h-fit no-scrollbar">
                {!meetings.length ? <div>No meetings today</div> : 
                    meetings.map((meeting, i) => {
                        return (<Meeting key={i} meeting={meeting} color={colors[i%3]} />)
                    })
                }
            </div>
        </div>
    )
}

export default Meetings