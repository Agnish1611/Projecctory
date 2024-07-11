import React from 'react';
import * as CgIcons from 'react-icons/cg';
import * as Io5Icons from "react-icons/io5";
import * as FaIcons from "react-icons/fa";
import * as MdIcons from "react-icons/md";
import { NavLink } from "react-router-dom";


const data = [
  {
    title: "Today",
    icon: <Io5Icons.IoToday className='h-5 w-5 text-zinc-200' />,
    link: '/'
  },
  {
    title: "Upcoming",
    icon: <FaIcons.FaCalendarAlt className='h-5 w-5 text-zinc-200' />,
    link: '/upcoming'
  },
  // {
  //   title: "My Labels",
  //   icon: <MdIcons.MdLabel className='h-6 w-6 text-zinc-200' />,
  //   link: '/labels'
  // }
]

function Navbar() {
  return (
    <div className='h-screen w-[15rem] bg-[#111113] shadow-[9px -1px 28px 16px rgba(15,13,15,1)] border-r-[1px] border-zinc-600'>
      <ul className='p-5'>
        <li className='flex flex-row items-center gap-7 justify-start mb-5'>
          <CgIcons.CgGoogleTasks color='yellow' className='h-10 w-10'/>
          <div className='text-xl text-zinc-200 font-Montserrat font-semibold'>Do<span className='text-[#fae94f]'>It</span>Later</div>
        </li>
        <div className='h-[1px] w-full bg-zinc-600 mb-10'></div>
        {data.map((item) => {
          return (
            <NavLink to={item.link}>
              <li id='navlink' className='flex flex-row items-center gap-10 py-2 hover:bg-zinc-800 px-2 my-2 rounded-xl cursor-pointer'>
                {item.icon}
                <div className='text-zinc-200 font-Montserrat font-medium text-sm'>{item.title}</div>
              </li>
            </NavLink>
          )
        })}
      </ul>
    </div>
  )
}

export default Navbar;