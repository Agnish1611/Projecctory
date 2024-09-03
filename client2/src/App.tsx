import { Routes, Route, BrowserRouter } from "react-router-dom";

import Layout from "./components/Layout";
import Overview from "./pages/Overview";
import Inbox from "./pages/Inbox";
import Settings from "./pages/Settings";
import Analytics from "./pages/Analytics";
import Friends from "./pages/Friends";
import Project from "./pages/Project";
import AuthLayout from "./components/AuthLayout";
import PersistLogin from "./components/PersistLogin";
import Error404 from "./pages/Error404";
import Login from "./pages/Login";
import Signup from "./pages/Signup";

const App = () => {
  return (
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<AuthLayout />}>
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
          </Route>
          <Route element={<PersistLogin />}>
            <Route path='/dash' element={<Layout />}>
              <Route index element={<Overview />} />
              <Route path="inbox" element={<Inbox />} />
              <Route path="settings" element={<Settings />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="friends" element={<Friends />} />
              <Route path="project" element={<Project />} />
            </Route>
          </Route>
          <Route path="*" element={<Error404 />} />
        </Routes>
      </BrowserRouter>
  )
}

export default App;
