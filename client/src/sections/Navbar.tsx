import React from 'react';

import { Link } from 'react-router-dom';

import { IoTodayOutline, IoCalendarOutline, IoMenu, IoLogOutOutline } from "react-icons/io5";
import { FaRegUser } from "react-icons/fa";
import { BiMessageSquareDots } from "react-icons/bi";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

import Logo from '../assets/icons/logo.png';
import Logo_name from '../assets/icons/logo_home.png';

const taskItems = [
  {
    title: 'Today',
    icon: <IoTodayOutline className='lg:h-5 lg:w-5 md:w-3 md:h-3 max-md:w-3 max-md:h-3' />,
    link: '/home',
    isActive: "home"
  },
  {
    title: 'Upcoming',
    icon: <IoCalendarOutline className='lg:h-5 lg:w-5 md:w-3 md:h-3 max-md:w-3 max-md:h-3' />,
    link: '/upcoming',
    isActive: "upcoming"
  },
];

const userItems = [
  {
    title: 'Profile',
    icon: <FaRegUser className='lg:h-5 lg:w-5 md:w-3 md:h-3 max-md:w-3 max-md:h-3' />,
    link: '/profile'
  },
  {
    title: 'Inbox',
    icon: <BiMessageSquareDots className='lg:h-5 lg:w-5 md:w-3 md:h-3 max-md:w-3 max-md:h-3' />,
    link: '/inbox'
  },
  {
    title: 'Logout',
    icon: <IoLogOutOutline className='lg:h-5 lg:w-5 md:w-3 md:h-3 max-md:w-3 max-md:h-3' />,
    link: '/logout'
  },
];

function Navbar({active}) {
  return (
    <section className='bg-background z-20 fixed sm:border-r flex max-sm:flex-row max-sm:items-center sm:flex-col h-screen lg:w-[15rem] max-md:w-[10rem] md:w-[10rem] max-sm:h-10 max-sm:w-screen'>
      <div className='lg:p-5 lg:pl-3 sm:mx-3 sm:mt-5 max-sm:border-0 max-md:border-b md:border-b flex lg:gap-5 items-center max-md:p-3 md:p-3 md:gap-2 max-md:gap-2'>
        <img src={Logo} className='lg:h-7 lg:w-7 max-md:h-5 max-md:w-5 md:w-5, md:h-5' />
        <img src={Logo_name} className='lg:h-7 max-md:h-5 md:h-5 max-sm:hidden' />
      </div>
      <nav className='flex sm:flex-col max-sm:flex-row max-sm:justify-around'>
        <Tasks active={active} />
        <UserSection />
      </nav>
    </section>
  );
}

function Tasks({active}) {
  return (
      <>
        <ul className='my-5 border-b mx-3 pb-6 max-sm:hidden'>
          {/* {taskItems.map((navItem, index) => {
            return (
              <Link key={index} to={navItem.link}>
                <li className='flex gap-5 hover:text-primary text-muted-foreground md:text-xs max-md:text-xs lg:text-base font-semibold items-center lg:px-5 lg:py-2 my-2 lg:mx-5 lg:pl-7 lg:pb-3 md:py-2 md:px-3 md:mx-2 max-md:py-2 max-md:px-3 max-md:mx-2 lg:rounded-lg md:rounded-sm max-md:rounded-sm'>
                  {navItem.icon}
                  {navItem.title}
                </li>
              </Link>
            )
          })} */}
          <Link to='/home'>
                <li className={(active == 'home') ? 'bg-accent flex gap-5 hover:text-primary text-muted-foreground md:text-xs max-md:text-xs lg:text-base font-semibold items-center lg:px-5 lg:py-2 my-2 lg:mx-5 lg:pl-7 lg:pb-3 md:py-2 md:px-3 md:mx-2 max-md:py-2 max-md:px-3 max-md:mx-2 lg:rounded-lg md:rounded-sm max-md:rounded-sm' : 'flex gap-5 hover:text-primary text-muted-foreground md:text-xs max-md:text-xs lg:text-base font-semibold items-center lg:px-5 lg:py-2 my-2 lg:mx-5 lg:pl-7 lg:pb-3 md:py-2 md:px-3 md:mx-2 max-md:py-2 max-md:px-3 max-md:mx-2 lg:rounded-lg md:rounded-sm max-md:rounded-sm'}>
                  <IoTodayOutline className='lg:h-5 lg:w-5 md:w-3 md:h-3 max-md:w-3 max-md:h-3' />
                  <span>Today</span>
                </li>
              </Link>
              <Link to='/upcoming'>
              <li className={(active == 'upcoming') ? 'bg-accent flex gap-5 hover:text-primary text-muted-foreground md:text-xs max-md:text-xs lg:text-base font-semibold items-center lg:px-5 lg:py-2 my-2 lg:mx-5 lg:pl-7 lg:pb-3 md:py-2 md:px-3 md:mx-2 max-md:py-2 max-md:px-3 max-md:mx-2 lg:rounded-lg md:rounded-sm max-md:rounded-sm' : 'flex gap-5 hover:text-primary text-muted-foreground md:text-xs max-md:text-xs lg:text-base font-semibold items-center lg:px-5 lg:py-2 my-2 lg:mx-5 lg:pl-7 lg:pb-3 md:py-2 md:px-3 md:mx-2 max-md:py-2 max-md:px-3 max-md:mx-2 lg:rounded-lg md:rounded-sm max-md:rounded-sm'}>
                  <IoCalendarOutline className='lg:h-5 lg:w-5 md:w-3 md:h-3 max-md:w-3 max-md:h-3' />
                  <span>Upcoming</span>
                </li>
              </Link>
        </ul>
        <div className='sm:hidden ml-3'>
          <DropdownMenu>
            <DropdownMenuTrigger><IoMenu className='hover:bg-accent mt-1 h-7 w-7 p-[2px] rounded-[10%]' /></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className='cursor-pointer'>Today</DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>Upcoming</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
  )
}

function UserSection() {
  return (
      <>
        <ul className='my-5 pb-6 mx-3 max-sm:hidden'>
          {userItems.map((navItem, index) => {
            return (
              <Link key={index} to={navItem.link}>
                <li className='flex gap-5 hover:text-primary text-muted-foreground md:text-xs max-md:text-xs lg:text-base font-semibold items-center lg:px-5 lg:py-2 my-2 lg:mx-5 lg:pl-7 lg:pb-3 md:py-2 md:px-3 md:mx-2 max-md:py-2 max-md:px-3 max-md:mx-2 lg:rounded-lg md:rounded-sm max-md:rounded-sm'>
                  {navItem.icon}
                  {navItem.title}
                </li>
              </Link>
            )
          })}
        </ul>
        <div className='sm:hidden absolute right-12 top-0'>
          <DropdownMenu>
            <DropdownMenuTrigger><FaRegUser className='hover:bg-accent m-3 h-5 w-5 p-[2px] rounded-[10%]' /></DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem className='cursor-pointer'>Profile</DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>Inbox</DropdownMenuItem>
              <DropdownMenuItem className='cursor-pointer'>Logout</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </>
  )
}

export default Navbar;