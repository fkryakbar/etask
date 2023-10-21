import AuthLoading from "@/components/AuthLoading";
import CreateTaskModal from "@/components/CreateTaskModal";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { deleteTask, getAllTasks, updateTask } from "@/models/TaskModel";
import { useUser } from "@/utils/Authentication"
import { Button, Input, Radio, RadioGroup, Skeleton, Textarea, useDisclosure } from "@nextui-org/react";
import {
    Modal,
    ModalContent,
    ModalHeader,
    ModalBody,
    ModalFooter
} from "@nextui-org/react";
import { useRouter } from "next/router"
import { useEffect, useState } from "react";
export default function Task() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter()
    const auth = useUser()

    if (auth.isLoading == false && auth.userData == null) {
        router.push('/login');
        return null;
    }
    if (auth.isLoading) return <AuthLoading />
    return (<>

        <DashboardLayout title="Task" userData={auth.userData}>
            <div className="mb-5 text-slate-700 dark:text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Task Board</h1>
                        <p>Keep your focus on track</p>
                    </div>
                    <Button className="bg-white dark:bg-black w-fit" size="md" onPress={onOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Button>
                </div>
                <hr className="mt-3 border-dashed border-slate-400 dark:border-slate-600" />
            </div>
            <TasksComponent userData={auth.userData} />
            <CreateTaskModal isOpen={isOpen} onOpenChange={onOpenChange} userData={auth.userData} />
        </DashboardLayout>


    </>)
}

function TasksComponent({ userData }: { userData: any }) {
    const [taskData, setTaskData] = useState<{ [taskid: string]: TaskData }>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getAllTasks(setTaskData, setIsLoading, userData);
    }, [])
    return (<>
        <div className="flex lg:flex-row flex-col gap-4 text-slate-700 dark:text-white">
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Ongoing
                </h1>
                {
                    isLoading && taskData ? (<><LoadingTask /></>) : Object.keys(taskData).map((taskId: string) => {
                        let isOnGoingAvailable = false;
                        if (taskData[taskId].taskType == 'ongoing') {
                            isOnGoingAvailable = true
                            return <TaskComponent key={taskId} taskId={taskId} taskData={taskData[taskId]} userData={userData} />

                        }
                    })
                }
                {
                    isLoading == false && !Object.values(taskData).some(task => task.taskType == 'ongoing') ? (
                        <div className="flex flex-col justify-center items-center gap-4 dark:text-slate-300 text-slate-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-emoji-dizzy w-14 h-14"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                            </svg>
                            <p className="text-sm">
                                There`&apos;s no activity to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Upcoming
                </h1>
                {
                    isLoading ? (<><LoadingTask /></>) : Object.keys(taskData).map((taskId: string) => {
                        if (taskData[taskId].taskType == 'upcoming') {
                            return <TaskComponent key={taskId} taskId={taskId} taskData={taskData[taskId]} userData={userData} />
                        }
                    })
                }
                {
                    isLoading == false && !Object.values(taskData).some(task => task.taskType == 'upcoming') ? (
                        <div className="flex flex-col justify-center items-center gap-4 dark:text-slate-300 text-slate-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-emoji-dizzy w-14 h-14"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                            </svg>
                            <p className="text-sm">
                                There`&apos;s no activity to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Done
                </h1>
                {
                    isLoading ? (<><LoadingTask /></>) : Object.keys(taskData).map((taskId: string) => {
                        if (taskData[taskId].taskType == 'done') {
                            return <TaskComponent key={taskId} taskId={taskId} taskData={taskData[taskId]} userData={userData} />

                        }
                    })
                }
                {
                    isLoading == false && !Object.values(taskData).some(task => task.taskType == 'done') ? (
                        <div className="flex flex-col justify-center items-center gap-4 dark:text-slate-300 text-slate-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width={16}
                                height={16}
                                fill="currentColor"
                                className="bi bi-emoji-dizzy w-14 h-14"
                                viewBox="0 0 16 16"
                            >
                                <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z" />
                                <path d="M9.146 5.146a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 0 1 .708.708l-.647.646.647.646a.5.5 0 0 1-.708.708l-.646-.647-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zm-5 0a.5.5 0 0 1 .708 0l.646.647.646-.647a.5.5 0 1 1 .708.708l-.647.646.647.646a.5.5 0 1 1-.708.708L5.5 7.207l-.646.647a.5.5 0 1 1-.708-.708l.647-.646-.647-.646a.5.5 0 0 1 0-.708zM10 11a2 2 0 1 1-4 0 2 2 0 0 1 4 0z" />
                            </svg>
                            <p className="text-sm">
                                There`&apos;s no activity to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
        </div>

    </>)
}

function TaskComponent({ taskData, taskId, userData }: { taskData: TaskData, taskId: string, userData: any }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false)
    const [taskDataState, setTaskData] = useState(taskData)


    async function onDeleteTask() {
        setIsLoading(true)
        await deleteTask(taskId, userData.uid);
        setIsLoading(false)
    }

    async function onUpdateTask(onCloseFunction: any) {
        setIsLoading(true)
        await updateTask(taskId, userData.uid, taskDataState);
        onCloseFunction()
        setIsLoading(false)
    }

    return <>
        <div className="mb-3 rounded-lg dark:bg-slate-900 p-5 bg-white shadow-lg hover:cursor-pointer transition-all hover:scale-[1.02]">
            <div className="flex justify-between items-center">
                <div className={`${taskData.priority == 'Low' ? 'bg-green-500' : taskData.priority == 'Medium' ? 'bg-amber-500' : taskData.priority == 'High' ? 'bg-red-500' : null} p-1 rounded text-[12px] font-semibold text-slate-100`}>
                    {taskData.label}
                </div>

                <div>
                    <Button className="bg-white dark:bg-slate-900 w-fit" size="sm" onPress={onOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                    </Button>
                </div>
            </div>
            <h1 className="mt-3 font-semibold">
                {taskData.title}
            </h1>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Edit Task</ModalHeader>
                        <ModalBody>
                            <Textarea
                                label="What are you working on"
                                labelPlacement="inside"
                                placeholder="Tell me what you are gonna do"
                                isRequired={true}
                                isDisabled={isLoading}
                                defaultValue={taskData.title}
                                className="w-full" onChange={e => {
                                    setTaskData({ ...taskDataState, title: e.target.value })
                                }}
                            />
                            <RadioGroup
                                isRequired={true}
                                defaultValue={taskData.taskType}
                                label="Task Type"
                                orientation="horizontal"
                                color="success"
                                isDisabled={isLoading}
                                onChange={e => {
                                    setTaskData({ ...taskDataState, taskType: e.target.value });
                                }}

                            >
                                <Radio value="ongoing">Ongoing</Radio>
                                <Radio value="upcoming">Upcoming</Radio>
                                <Radio value="done">Done</Radio>
                            </RadioGroup>
                            <Input defaultValue={taskData.label} isRequired={true} isDisabled={isLoading} type="text" label="Label" size="sm" onChange={e => {
                                setTaskData({ ...taskDataState, label: e.target.value });
                            }} />
                            <RadioGroup
                                label="Priority"
                                orientation="horizontal"
                                defaultValue={taskData.priority}
                                color="success"
                                isDisabled={isLoading}
                                isRequired={true}
                                onChange={e => {
                                    setTaskData({ ...taskDataState, priority: e.target.value });
                                }}
                            >
                                <Radio value="Low">Low</Radio>
                                <Radio value="Medium">Medium</Radio>
                                <Radio value="High">High</Radio>
                            </RadioGroup>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onDeleteTask} isDisabled={isLoading}>
                                Delete
                            </Button>
                            <Button color="success" onPress={e => { onUpdateTask(onClose) }} isDisabled={isLoading}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>

    </>
}


function LoadingTask() {
    return <>
        <div className="mb-3 rounded-lg dark:bg-slate-900 p-5 bg-white shadow-lg">
            <div className="flex justify-between items-center">
                <Skeleton className="w-20 rounded-lg">
                    <div className="w-15 h-5 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div>
                    <Skeleton className="w-10 rounded-lg">
                        <div className="w-15 h-5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                </div>
            </div>
            <h1 className="mt-3 font-semibold">
                <Skeleton className="w-15 rounded-lg">
                    <div className="w-15 h-6 rounded-lg bg-default-300"></div>
                </Skeleton>
            </h1>
        </div>
        <div className="mb-3 rounded-lg dark:bg-slate-900 p-5 bg-white shadow-lg">
            <div className="flex justify-between items-center">
                <Skeleton className="w-20 rounded-lg">
                    <div className="w-15 h-5 rounded-lg bg-default-300"></div>
                </Skeleton>
                <div>
                    <Skeleton className="w-10 rounded-lg">
                        <div className="w-15 h-5 rounded-lg bg-default-300"></div>
                    </Skeleton>
                </div>
            </div>
            <h1 className="mt-3 font-semibold">
                <Skeleton className="w-15 rounded-lg">
                    <div className="w-15 h-6 rounded-lg bg-default-300"></div>
                </Skeleton>
            </h1>
        </div>
    </>
}