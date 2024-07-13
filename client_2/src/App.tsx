import React from 'react';

import { ThemeProvider } from "@/components/theme-provider"
import { ModeToggle } from './components/mode-toggle';

import { Toaster } from "@/components/ui/toaster"

import Register from './pages/Register';

function App() {

  return (
    <>
    <main>
      <ThemeProvider>
        <Register />
        <ModeToggle />
      </ThemeProvider>
    </main>
    <Toaster />
    </>
  )
}

export default App
