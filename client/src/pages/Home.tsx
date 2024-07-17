import React, { useEffect } from 'react';

import Navbar from '@/sections/Navbar';
import Today from '../sections/Today';
import Upcoming from '@/sections/Upcoming';

function Home() {
  return (
    <div className='overflow-x-hidden'>
        <Navbar active="home" />
        <Today />
    </div>
  );
}

export default Home;