import React, { useState } from 'react';
import { NavLink } from "react-router-dom";

import * as CgIcons from 'react-icons/cg';
import * as Io5Icons from "react-icons/io5";
import * as FaIcons from "react-icons/fa";
import * as IoIcons from "react-icons/io";

import Skeleton, { SkeletonTheme } from 'react-loading-skeleton';

import { motion } from 'framer-motion';

import { labelsState } from '../atoms/labels.js';
import { RecoilRoot, useRecoilValue, useRecoilValueLoadable, useRecoilStateLoadable } from 'recoil';


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
  }
];

function Navbar() {
  const [labelActive, setLabelActive] = useState(false);

  return (
    <RecoilRoot>
    <div className='h-screen w-[15rem] bg-[#111113] shadow-[9px -1px 28px 16px rgba(15,13,15,1)] border-r-[1px] border-zinc-600'>
      <ul className='p-5'>
        <li className='flex flex-row items-center gap-7 justify-start mb-5'>
          <CgIcons.CgGoogleTasks color='yellow' className='h-10 w-10'/>
          <div className='text-xl text-zinc-200 font-Montserrat font-semibold'>Do<span className='text-[#fae94f]'>It</span>Later</div>
        </li>
        <div className='h-[1px] w-full bg-zinc-600 mb-10'></div>
        {data.map((item, index) => {
          return (
            <NavLink to={item.link} key={index}>
              <li id='navlink' className='flex flex-row items-center gap-10 py-2 hover:bg-zinc-800 px-2 my-2 rounded-xl cursor-pointer'>
                {item.icon}
                <div className='text-zinc-200 font-Montserrat font-medium text-sm'>{item.title}</div>
              </li>
            </NavLink>
          )
        })}
        <li className='flex flex-row items-center gap-10 py-2 hover:bg-zinc-800 px-2 my-2 rounded-xl cursor-pointer' onClick={() => {setLabelActive(!labelActive)}}>
          <FaIcons.FaTag className='h-5 w-5 text-zinc-200' />
          <div className='text-zinc-200 font-Montserrat font-medium text-sm'>Labels</div>
          {labelActive ? <IoIcons.IoIosArrowUp className='h-5 w-5 text-zinc-200' /> : <IoIcons.IoIosArrowDown className='h-5 w-5 text-zinc-200' />}
        </li>
        {labelActive ? <LabelList /> : null}
      </ul>
    </div>
    </RecoilRoot>
  )
}

function LabelList() {
  const [labels, setLabels] = useRecoilStateLoadable(labelsState);

  if (labels.state == 'loading'){
    return (
      <></>
    );
  }
  else {
    return (
      <>
        {labels.contents.map((value, index) => {
          return (
            <li id='label' key={index} className='flex flex-row items-center gap-2 py-2 hover:bg-zinc-800 px-2 my-2 rounded-xl cursor-pointer pl-10'>

              <FaIcons.FaHashtag className='h-3 w-3 text-zinc-200' />
              <motion.div
                animate={{y: 0, opacity: 1}}
                initial={{y: -50, opacity: 0}} 
                className='text-zinc-200 font-Montserrat font-medium text-sm'
              >
                  {value.title}
              </motion.div>

            </li>
          )
        })}
      </>
    );
  }

  
}

export default Navbar;