import React from 'react';
import Upcoming from '@/sections/Upcoming';
import Navbar from '@/sections/Navbar';

function UpcomingPage() {
  return (
    <>
    <div className='overflow-hidden'>
        <Navbar active="upcoming" />
    </div>
    <div className='overflow-x-scroll'>
        <Upcoming />
    </div>
    </>
  )
}

export default UpcomingPage;