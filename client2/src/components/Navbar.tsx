import Icon from '../assets/profile_icons/boy-1.jpg';
import { RiHomeSmile2Line, RiSettingsLine, RiLogoutCircleRLine} from "react-icons/ri"
import { LuInbox, LuClipboardCheck } from "react-icons/lu";
import { GoPeople } from "react-icons/go";
import { AiOutlineLineChart } from "react-icons/ai";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";

import { Link, useLocation } from 'react-router-dom';
import { Suspense, useState } from 'react';

import { useRecoilState, useRecoilValue } from 'recoil';
import { userAtom } from '@/store/user';
import { projectsAtom } from '@/store/projects';
import { currentProjectAtom } from '@/store/currentProject';

let navItems = [
    [
        {
            title: "Overview",
            icon: <RiHomeSmile2Line className='w-6 h-6 mx-3' />,
            count: false,
            link: '/'
        },
        {
            title: "Inbox",
            icon: <LuInbox className='w-6 h-6 mx-3' />,
            count: true,
            link: '/inbox'
        },
        {
            title: "Settings",
            icon: <RiSettingsLine className='w-6 h-6 mx-3' />,
            count: false,
            link: '/settings'
        },
    ],
    [
        {
            title: "Tasks",
            icon: <LuClipboardCheck className='w-6 h-6 mx-3' />,
            count: true,
            link: '/tasks'
        },
        {
            title: "Analytics",
            icon: <AiOutlineLineChart className='w-6 h-6 mx-3' />,
            count: false,
            link: '/analytics'
        },
        {
            title: "Friends",
            icon: <GoPeople className='w-6 h-6 mx-3' />,
            count: true,
            link: '/friends'
        },
    ]
]

const ProjectSection = () => {
    const location = useLocation();

    const projects = useRecoilValue(projectsAtom);
    const [currentProject, setCurrentProject] = useRecoilState(currentProjectAtom);

    if (!projects.length) {
        return (<li className='py-2 pl-7 rounded-lg m-1 font-semibold text-muted-foreground'>No projects</li>);
    } else {
        return (
            <>
                {projects.map((project, i) => {
                    return (
                        <Link to='/project'>
                            <li key={i} className={`py-2 pl-7 rounded-lg cursor-pointer m-1 font-semibold ${ currentProject._id==project._id && location.pathname=='/project'  ? `bg-zinc-800` : `hover:bg-accent-foreground`}`} onClick={() => {setCurrentProject(project)}}>{project.name}</li>
                        </Link>
                    )
                })}
            </>
        )
    }
}

const Navbar = () => {
    const location = useLocation();
    
    const user = useRecoilValue(userAtom);
    const [projectsActive, setProjectsActive] = useState(location.pathname == '/project');

    return (
        <section className='h-screen w-[15rem] bg-zinc-950 text-white font-quicksand'>
            <div className='flex gap-5 py-5 px-6 items-center'>
                <img src={Icon} className='h-8 w-8 rounded-full' />
                <div className='w-full flex justify-between items-center'>
                    <div className='text-sm font-semibold flex gap-1 flex-col'>
                        <div>{user.username}</div>
                        <div className='text-xs font-regular text-muted-foreground'>{user.uniqueId}</div>
                    </div>
                    <RiLogoutCircleRLine className='h-5 w-5 cursor-pointer hover:scale-125 transition' />
                </div>
            </div>
            <div>
                {navItems.map((navSection, i) => {
                    return (
                        <ul key={i} className='border-b border-muted-foreground mx-5 py-5'>
                            {navSection.map((navItem, index) => {
                                return (
                                    <Link key={index} to={navItem.link}>
                                        <li className={`flex py-2 rounded-lg cursor-pointer m-1 ${ location.pathname == navItem.link ? `bg-zinc-800` : `hover:bg-accent-foreground`}`}>
                                            {navItem.icon}
                                            <div className='flex flex-row items-center justify-between w-full'>
                                                <div className='font-semibold'>{navItem.title}</div>
                                                {navItem.count && <div className='bg-white text-zinc-950 text-sm font-bold text-center rounded-full w-5 h-5 mr-2'>3</div>}
                                            </div>
                                        </li>
                                    </Link>
                                )
                            })}
                        </ul>
                    )
                })}
                <div className='mx-5 py-2 mt-5 flex rounded-lg m-1 hover:bg-accent-foreground cursor-pointer' onClick={() => {setProjectsActive(!projectsActive)}}>
                    <LiaProjectDiagramSolid className='h-6 w-6 mx-3' />
                    <div className='flex w-full justify-between items-center'>
                        <div className='font-semibold'>Projects</div>
                        { !projectsActive ? <IoIosArrowDown className='h-6 w-6 mr-2' /> : <IoIosArrowUp className='h-6 w-6 mr-2' />}
                    </div>
                </div>
                <ul className='mx-5 py-2 max-h-[150px] overflow-y-scroll overflow-x-hidden'>
                    {projectsActive && 
                        <Suspense fallback={<li className='py-2 pl-7 rounded-lg m-1 font-semibold text-muted-foreground'>Loading...</li>}>
                            <ProjectSection />
                        </Suspense>
                    }   
                </ul>
            </div>
        </section>
    )
}

export default Navbar;