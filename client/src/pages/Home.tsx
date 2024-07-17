import React, { useEffect } from 'react';

import Navbar from '@/sections/Navbar';
import Today from '../sections/Today';

function Home() {
  return (
    <div className='overflow-x-hidden'>
        <Navbar />
        <Today />
    </div>
  );
}

export default Home;