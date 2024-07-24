import { Routes, Route, BrowserRouter } from "react-router-dom";
import { RecoilRoot } from "recoil";

import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Inbox from "./pages/Inbox";
import Settings from "./pages/Settings";
import Tasks from "./pages/Tasks";
import Analytics from "./pages/Analytics";
import Friends from "./pages/Friends";
import Project from "./pages/Project";

const App = () => {
  return (
    <RecoilRoot>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<Overview />} />
            <Route path="inbox" element={<Inbox />} />
            <Route path="settings" element={<Settings />} />
            <Route path="tasks" element={<Tasks />} />
            <Route path="analytics" element={<Analytics />} />
            <Route path="friends" element={<Friends />} />
            <Route path="project" element={<Project />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </RecoilRoot>
  )
}

export default App
