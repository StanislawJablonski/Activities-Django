import { createBrowserRouter } from "react-router-dom";
import Main from "./pages/Main";
import Login from "./pages/Authentication/Login";
import Register from "./pages/Authentication/Register";
import Activate from "./pages/Authentication/Activate";
import Dashboard from "./pages/Dashboard/Dashboard";
import Settings from "./pages/Settings/Settings";
import CreateActivity from "./pages/Activities/CreateActivity";
import TakePartIn from "./pages/Activities/TakePartIn";
import WeekCalendar from "./components/Calendar/WeekCalendar";
import MonthCalendar from "./components/Calendar/MonthCalendar";
import DayCalendar from "./components/Calendar/DayCalendar";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Main />,
  },
  {
    path: "/dashboard",
    element: <Dashboard />,
    children: [
      {
        path: "createactivity",
        element: <CreateActivity />,
      },
      {
        path: "takepartinactivity",
        element: <TakePartIn />,
      },
      {
        path: "weekCalendar",
        element: <WeekCalendar />,
      },
      {
        path: "monthCalendar",
        element: <MonthCalendar />,
      },
      {
        path: "dayCalendar",
        element: <DayCalendar />,
      },
      {
        path: "settings",
        element: <Settings />,
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "/createactivity",
    element: <CreateActivity />,
  },
  {
    path: "/weekCalendar",
    element: <WeekCalendar />,
  },
  {
    path: "/monthCalendar",
    element: <MonthCalendar />,
  },
  {
    path: "/dayCalendar",
    element: <DayCalendar />,
  },
  {
    path: "/auth/activate/:code",
    element: <Activate />,
  },
]);

export default router;
