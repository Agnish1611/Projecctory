import axios from "@/api/axiosConfig";
import TaskCalendar from "@/components/TaskCalendar";
import { userAtom } from "@/store/user";
import { useEffect, useState } from "react";
import { useRecoilValue } from "recoil";
import TaskCompleted from '../assets/task_images/task_completed.jpg';
import TodoTask from '../assets/task_images/todo_task.jpg';
import NotCompleted from '../assets/task_images/not_completed.jpg';
import Meetings from "@/components/Meetings";
import { Toaster } from "@/components/ui/toaster";
import useAxiosPrivate from "@/hooks/useAxiosPrivate";
import { renderTasksAtom } from "@/store/renderTasks";
import { useNavigate } from "react-router-dom";
import { ColorRing } from "react-loader-spinner";

const Overview = () => {
  const [completedTasks, setCompletedTasks] = useState([]);
  const [todoTasks, setTodoTasks] = useState([]);
  const [skippedTasks, setSkippedTasks] = useState([]);
  const [completedTasksLoading, setCompletedTasksLoading] = useState(true);
  const [todoTasksLoading, setTodoTasksLoading] = useState(true);
  const [skippedTasksLoading, setSkippedTasksLoading] = useState(true);

  const axiosPrivate = useAxiosPrivate();

  const renderTasks = useRecoilValue(renderTasksAtom);

  useEffect(() => {
    axiosPrivate.get('/tasks/'+'?completed=true')
      .then(res => new Promise(resolve => {
          setTimeout(() => {
            resolve(res);
            setCompletedTasks(res.data?.data);
            setCompletedTasksLoading(false);
          }, 500);
        })
      )
      .catch((e) => {
        console.log(e);
      })
  }, [renderTasks]);

  useEffect(() => {
    axiosPrivate.get('/tasks/'+'?completed=false')
      .then(res => new Promise(resolve => {
          setTimeout(() => {
            resolve(res);
            setTodoTasks(res.data?.data);
            setTodoTasksLoading(false);
          }, 500);
        })
      )
      .catch((e) => {
        console.log(e);
      })
  }, [renderTasks]);

  useEffect(() => {
    axiosPrivate.get('/tasks/skipped')
      .then(res => new Promise(resolve => {
          setTimeout(() => {
            resolve(res);
            setSkippedTasks(res.data?.data);
            setSkippedTasksLoading(false);
          }, 500);
        })
      )
      .catch((e) => {
        console.log(e);
      })
  }, [renderTasks]);

  return (
    <section className="w-full h-screen bg-zinc-950 flex gap-2 p-2 font-quicksand overflow-hidden">
        <div className="flex flex-col gap-2 h-full">
            <div className="h-[100rem] w-[60rem] rounded-3xl bg-white overflow-hidden p-5">
              <TaskCalendar />
            </div>
            <div className="flex h-full w-fit mt-0">
                <div className="h-full flex rounded-3xl mr-2 w-[19.7rem] items-center justify-between bg-zinc-900 p-7 text-white">
                  <div>
                    <div className="text-4xl font-bold my-2">
                      {completedTasksLoading
                        ? <ColorRing
                            visible={true}
                            height="60"
                            width="60"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
                          />
                        : completedTasks.length}
                      </div>
                    <div className="text-xl font-semibold">Tasks Completed</div>
                  </div>
                  <img src={TaskCompleted} className="h-32 w-32 rounded-full" />
                </div>
                <div className="h-full flex rounded-3xl mr-2 w-[19.7rem] items-center justify-between bg-zinc-900 p-10 text-white">
                  <div>
                    <div className="text-4xl font-bold my-2">
                      {todoTasksLoading && skippedTasksLoading
                        ? <ColorRing
                            visible={true}
                            height="60"
                            width="60"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
                          />
                        : todoTasks.length - skippedTasks.length}
                    </div>
                    <div className="text-xl font-semibold">To-do Tasks</div>
                  </div>
                  <img src={TodoTask} className="h-32 w-32 rounded-full" />
                </div>
                <div className="h-full flex rounded-3xl mr-2 w-[19.7rem] items-center justify-between bg-zinc-900 p-10 text-white">
                  <div>
                    <div className="text-4xl font-bold my-2">
                      {skippedTasksLoading
                        ? <ColorRing
                            visible={true}
                            height="60"
                            width="60"
                            ariaLabel="color-ring-loading"
                            wrapperStyle={{}}
                            wrapperClass="color-ring-wrapper"
                            colors={['#ffffff', '#ffffff', '#ffffff', '#ffffff', '#ffffff']}
                          />
                        : skippedTasks.length}
                    </div>
                    <div className="text-xl font-semibold">Tasks Skipped</div>
                  </div>
                  <img src={NotCompleted} className="h-32 w-32 rounded-full" />
                </div>
            </div>
        </div>
        <div className="h-full w-full bg-zinc-900 rounded-3xl p-5 overflow-hidden">
          <Meetings />
        </div>
    </section>
  )
}

export default Overview;