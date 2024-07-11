import React from 'react';
import Navbar from './components/Navbar';
import Today from './pages/Today';
import * as ReactRouter from 'react-router-dom';
import Upcoming from './pages/Upcoming';

const App = () => {
  return (
    <div className='flex flex-row'>
      <ReactRouter.BrowserRouter>
        <Navbar />
        <ReactRouter.Routes>
          <ReactRouter.Route path='/' element={<Today />} />
          <ReactRouter.Route path='/upcoming' element={<Upcoming />} />
        </ReactRouter.Routes>
      </ReactRouter.BrowserRouter>
    </div>
  );
}

export default App;
