import React from 'react';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import { ThemeProvider } from "@/components/theme-provider";
import { ModeToggle } from './components/mode-toggle';

import { Toaster } from "@/components/ui/toaster";

import Register from './pages/Register';
import Login from './pages/Login';
import Home from './pages/Home';

import { RecoilRoot } from 'recoil';

function App() {

  return (
    <>
    <main>
      <RecoilRoot>
      <BrowserRouter>
        <ThemeProvider>
          <Routes>
            <Route path='/' element={<Register />} />
            <Route path='/register' element={<Register />} />
            <Route path='/login' element={<Login />} />
            <Route path='/home' element={<Home />} />
          </Routes>
          <ModeToggle />
        </ThemeProvider>
      </BrowserRouter>
      </RecoilRoot>
    </main>
    <Toaster />
    </>
  )
}

export default App;
