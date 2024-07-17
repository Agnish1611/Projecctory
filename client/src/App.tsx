import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from './components/mode-toggle';

import { Toaster } from "@/components/ui/toaster";

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

import { RecoilRoot, useRecoilValue, useRecoilValueLoadable } from 'recoil';
import { userAtom } from './store/user-atom';
import UpcomingPage from './pages/Upcoming';

function App() {
  const user = useRecoilValueLoadable(userAtom);

  return (
    <>
    <main>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            {user.contents.id ? <Route path='/' element={<Home />} /> : <Route path='/' element={<Register />} />}
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/home' element={<Home />} />
            <Route path='/upcoming' element={<UpcomingPage />} />
          </Routes>
          <ModeToggle />
        </ThemeProvider>
      </BrowserRouter>
    </main>
    <Toaster />
    </>
  )
}

export default App;
