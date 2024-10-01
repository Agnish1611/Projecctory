import { AiOutlineLineChart } from "react-icons/ai";
import { GoPeople } from "react-icons/go";
import { LuInbox } from "react-icons/lu";
import { RiHomeSmile2Line, RiLogoutCircleRLine, RiSettingsLine } from "react-icons/ri";
import Icon from '../assets/profile_icons/boy-1.jpg';
import { useRecoilState, useRecoilValue } from "recoil";
import { userAtom } from "@/store/user";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { LiaProjectDiagramSolid } from "react-icons/lia";
import { projectsAtom } from "@/store/projects";
import { currentProjectAtom } from "@/store/currentProject";
import { Suspense, useEffect, useState } from "react";
import { IoIosArrowDown, IoIosArrowUp } from "react-icons/io";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";

import Boy1 from '../assets/profile_icons/boy-1.jpg';
import Boy2 from '../assets/profile_icons/boy-2.jpg';
import Boy3 from '../assets/profile_icons/boy-3.jpg';
import Girl1 from '../assets/profile_icons/girl-1.jpg';
import Girl2 from '../assets/profile_icons/girl-2.jpg';
import Girl3 from '../assets/profile_icons/girl-3.jpg';
import Man1 from '../assets/profile_icons/man-1.jpg';
import Woman1 from '../assets/profile_icons/woman-1.jpg';
import { axiosPrivate } from "@/api/axiosConfig";

const avatars  = ['', Boy1, Boy2, Boy3, Girl1, Girl2, Girl3, Man1, Woman1];

let navItems = [
    [
        {
            title: "Overview",
            icon: <RiHomeSmile2Line className='w-6 h-6 mx-3' />,
            count: false,
            link: '/dash'
        },
        {
            title: "Inbox",
            icon: <LuInbox className='w-6 h-6 mx-3' />,
            count: true,
            link: '/dash/inbox'
        },
        {
            title: "Settings",
            icon: <RiSettingsLine className='w-6 h-6 mx-3' />,
            count: false,
            link: '/dash/settings'
        },
    ],
    [
        {
            title: "Analytics",
            icon: <AiOutlineLineChart className='w-6 h-6 mx-3' />,
            count: false,
            link: '/dash/analytics'
        },
        {
            title: "Friends",
            icon: <GoPeople className='w-6 h-6 mx-3' />,
            count: true,
            link: '/dash/friends'
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
                        <Link to='/project' key={i}>
                            <li className={`py-2 pl-7 rounded-lg cursor-pointer m-1 font-semibold ${ currentProject._id==project._id && location.pathname=='/project'  ? `bg-zinc-800` : `hover:bg-accent-foreground`}`} onClick={() => {setCurrentProject(project)}}>{project.name}</li>
                        </Link>
                    )
                })}
            </>
        )
    }
}

function Navbar() {
    const location = useLocation();
    const navigate = useNavigate();
    const [user, setUser] = useRecoilState(userAtom);   
    const [projectsActive, setProjectsActive] = useState(location.pathname == '/project');

    useEffect(() => {
        if (!(user.accessToken)) {
            navigate('/login');
        }
    }, []);

    async function handlelogout() {
        try {
            const res = await axiosPrivate.post('/users/logout');
            console.log(res.data);
            setUser({
                id: null,
                username: null,
                uniqueId: null,
                email: null,
                friends: null,
                pfp: null,
                accessToken: null,
            });
            navigate('/login');
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <section className="sm:w-[15rem] flex sm:flex-col max-sm:items-center max-sm:justify-between flex-row bg-[#070707] text-white font-quicksand sm:h-screen w-screen h-10">
            <div className='flex gap-5 py-5 px-6 items-center'>
                {user.pfp 
                    && (<img src={avatars[user.pfp]} className='h-8 w-8 rounded-full max-sm:h-6 max-sm:w-6' />)
                }
                <div className='w-full flex justify-between items-center'>
                    <div className='text-sm font-semibold flex gap-1 flex-col max-sm:hidden'>
                        <div>{user?.username}</div>
                        <div className='text-xs font-regular text-muted-foreground'>{user?.uniqueId}</div>
                    </div>
                    <button onClick={handlelogout}><RiLogoutCircleRLine className='h-5 w-5 max-sm:h-4 max-sm:w-4 cursor-pointer hover:scale-125 transition' /></button>
                </div>
            </div>
            <div className="sm:hidden">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild><HamburgerMenuIcon className="h-4 w-4 mr-5" /></DropdownMenuTrigger>
                    <DropdownMenuContent className="bg-[#070707] text-white font-quicksand">
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
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
            <div className="max-sm:hidden">
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