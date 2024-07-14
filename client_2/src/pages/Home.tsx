import React from 'react';

import Navbar from '@/sections/Navbar';
import Today from '../sections/Today';

function Home() {
  return (
    <div className='h-[200vh] w-screen flex flex-row'>
        <Navbar />
        <Today />
    </div>
  )
}

export default Home;