import AuthLoading from "@/components/AuthLoading";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { createNewPlan, deletePlan, getAllPlans, updatePlan } from "@/models/PlanModel";
import { useUser } from "@/utils/Authentication";
import { Toast } from "@/utils/Swal";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Radio, RadioGroup, Textarea, useDisclosure, Select, SelectSection, SelectItem, Skeleton } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";


export default function Week() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter()
    const auth = useUser()

    if (auth.isLoading == false && auth.userData == null) {
        router.push('/login');
        return null;
    }
    if (auth.isLoading) return <AuthLoading />
    return <>
        <DashboardLayout title="Weekly Plan" userData={auth.userData}>
            <div className="mb-5 text-slate-700 dark:text-white">
                <div className="flex justify-between items-center">
                    <div>
                        <h1 className="text-3xl font-bold">Weekly Plan</h1>
                        <p>Week by Week, Step by Step.</p>
                    </div>
                    <Button className="bg-white dark:bg-black w-fit" size="md" onPress={onOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    </Button>
                </div>
                <hr className="mt-3 border-dashed border-slate-400 dark:border-slate-600" />
            </div>
            <PlansComponent userData={auth.userData} />
            <CreatePlanModal isOpen={isOpen} onOpenChange={onOpenChange} userData={auth.userData} />
        </DashboardLayout>


    </>
}


function CreatePlanModal({ isOpen, onOpenChange, userData }: any) {
    const [isLoading, setIsLoading] = useState(false)
    const [planData, setPlanData] = useState({
        title: '',
        day: '',
        time: '',
    })

    async function onCreatePlan(onCloseFunction: any) {
        setIsLoading(true);
        if (planData.title == '' || planData.day == '' || planData.time == '') {
            Toast.fire({
                icon: 'error',
                title: 'All fields are required'
            })
            setIsLoading(false)
            return false
        }

        await createNewPlan(planData, userData)
        setPlanData({
            title: '',
            day: '',
            time: '',
        })
        setIsLoading(false);
        onCloseFunction()

    }


    return <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Create new Plan</ModalHeader>
                        <ModalBody>
                            <Textarea
                                label="What is Your Plan?"
                                labelPlacement="inside"
                                placeholder="Tell me what you are gonna do"
                                isRequired={true}
                                isDisabled={isLoading}
                                className="w-full" onChange={e => {
                                    setPlanData({ ...planData, title: e.target.value })
                                }}
                            />
                            <Select
                                label="Select a day of the plan"
                                className="w-full"
                                onChange={e => {
                                    setPlanData({ ...planData, day: e.target.value })
                                }}
                                isDisabled={isLoading}
                            >
                                <SelectItem key={'Monday'} value={'monday'}>
                                    Monday
                                </SelectItem>
                                <SelectItem key={'Tuesday'} value={'tuesday'}>
                                    Tuesday
                                </SelectItem>
                                <SelectItem key={'Wednesday'} value={'wednesday'}>
                                    Wednesday
                                </SelectItem>
                                <SelectItem key={'Thursday'} value={'thursday'}>
                                    Thursday
                                </SelectItem>
                                <SelectItem key={'Friday'} value={'friday'}>
                                    Friday
                                </SelectItem>
                                <SelectItem key={'Saturday'} value={'saturday'}>
                                    Saturday
                                </SelectItem>
                                <SelectItem key={'Sunday'} value={'sunday'}>
                                    Sunday
                                </SelectItem>

                            </Select>
                            <Input isRequired={true} isDisabled={isLoading} type="text" label="Time" size="sm" onChange={e => {
                                setPlanData({ ...planData, time: e.target.value });
                            }} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="success" isDisabled={isLoading} onPress={e => { onCreatePlan(onClose) }}>
                                Create
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}

function PlansComponent({ userData }: { userData: any }) {
    const [planData, setPlanData] = useState<{ [planId: string]: PlanData }>({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        getAllPlans(setPlanData, setIsLoading, userData)
    }, []);
    return <>
        <div className="grid lg:grid-cols-4 grid-cols-1 gap-4 text-slate-700 dark:text-white">
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Monday
                </h1>
                {
                    isLoading && planData ? (<LoadingPlan />) : Object.keys(planData).map((planId: string) => {
                        let isOnGoingAvailable = false;
                        if (planData[planId].day == 'Monday') {
                            isOnGoingAvailable = true
                            return <PlanComponent key={planId} planId={planId} planData={planData[planId]} userData={userData} />

                        }
                    })
                }
                {
                    isLoading == false && !Object.values(planData).some(plan => plan.day == 'Monday') ? (
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
                                There&apos;s no plan to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Tuesday
                </h1>
                {
                    isLoading && planData ? (<LoadingPlan />) : Object.keys(planData).map((planId: string) => {
                        let isOnGoingAvailable = false;
                        if (planData[planId].day == 'Tuesday') {
                            isOnGoingAvailable = true
                            return <PlanComponent key={planId} planId={planId} planData={planData[planId]} userData={userData} />

                        }
                    })
                }
                {
                    isLoading == false && !Object.values(planData).some(plan => plan.day == 'Tuesday') ? (
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
                                There&apos;s no plan to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Wednesday
                </h1>
                {
                    isLoading && planData ? (<LoadingPlan />) : Object.keys(planData).map((planId: string) => {
                        let isOnGoingAvailable = false;
                        if (planData[planId].day == 'Wednesday') {
                            isOnGoingAvailable = true
                            return <PlanComponent key={planId} planId={planId} planData={planData[planId]} userData={userData} />

                        }
                    })
                }
                {
                    isLoading == false && !Object.values(planData).some(plan => plan.day == 'Wednesday') ? (
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
                                There&apos;s no plan to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Thursday
                </h1>
                {
                    isLoading && planData ? (<LoadingPlan />) : Object.keys(planData).map((planId: string) => {
                        let isOnGoingAvailable = false;
                        if (planData[planId].day == 'Thursday') {
                            isOnGoingAvailable = true
                            return <PlanComponent key={planId} planId={planId} planData={planData[planId]} userData={userData} />

                        }
                    })
                }
                {
                    isLoading == false && !Object.values(planData).some(plan => plan.day == 'Thursday') ? (
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
                                There&apos;s no plan to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Friday
                </h1>
                {
                    isLoading && planData ? (<LoadingPlan />) : Object.keys(planData).map((planId: string) => {
                        let isOnGoingAvailable = false;
                        if (planData[planId].day == 'Friday') {
                            isOnGoingAvailable = true
                            return <PlanComponent key={planId} planId={planId} planData={planData[planId]} userData={userData} />

                        }
                    })
                }
                {
                    isLoading == false && !Object.values(planData).some(plan => plan.day == 'Friday') ? (
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
                                There&apos;s no plan to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Saturday
                </h1>
                {
                    isLoading && planData ? (<LoadingPlan />) : Object.keys(planData).map((planId: string) => {
                        let isOnGoingAvailable = false;
                        if (planData[planId].day == 'Saturday') {
                            isOnGoingAvailable = true
                            return <PlanComponent key={planId} planId={planId} planData={planData[planId]} userData={userData} />

                        }
                    })
                }
                {
                    isLoading == false && !Object.values(planData).some(plan => plan.day == 'Saturday') ? (
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
                                There&apos;s no plan to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
            <div className="flex-1">
                <h1 className="text-xl font-bold mb-4">
                    Sunday
                </h1>
                {
                    isLoading && planData ? (<LoadingPlan />) : Object.keys(planData).map((planId: string) => {
                        let isOnGoingAvailable = false;
                        if (planData[planId].day == 'Sunday') {
                            isOnGoingAvailable = true
                            return <PlanComponent key={planId} planId={planId} planData={planData[planId]} userData={userData} />

                        }
                    })
                }
                {
                    isLoading == false && !Object.values(planData).some(plan => plan.day == 'Sunday') ? (
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
                                There&apos;s no plan to display
                            </p>
                        </div>
                    ) : null
                }
            </div>
        </div>

    </>
}


function PlanComponent({ planData, planId, userData }: { planData: PlanData, planId: string, userData: any }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false)
    const [planDataState, setPlanData] = useState(planData)


    async function onDeletePlan() {
        setIsLoading(true)
        await deletePlan(planId, userData);
        setIsLoading(false)
    }

    async function onUpdatePlan(onCloseFunction: any) {
        setIsLoading(true)
        await updatePlan(planId, userData, planDataState);
        onCloseFunction()
        setIsLoading(false)
    }

    return <>
        <div onClick={onOpen} className="mb-3 rounded-lg dark:bg-slate-900 p-5 bg-white shadow-lg hover:cursor-pointer transition-all hover:scale-[1.02]">
            <div className="flex justify-between items-center">
                <div className={`bg-green-500 p-1 rounded text-[12px] font-semibold text-slate-100 flex items-center gap-1`}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    {planData.time}
                </div>
                {/* <div>
                    <Button className="bg-white dark:bg-slate-900 w-fit" size="sm" onPress={onOpen}>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM12.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0zM18.75 12a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" />
                        </svg>
                    </Button>
                </div> */}
            </div>
            <h1 className="mt-3 font-semibold">
                {planData.title}
            </h1>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Create new Plan</ModalHeader>
                        <ModalBody>
                            <Textarea
                                label="What is Your Plan?"
                                labelPlacement="inside"
                                placeholder="Tell me what you are gonna do"
                                isRequired={true}
                                isDisabled={isLoading}
                                defaultValue={planData.title}
                                defaultChecked={true}
                                className="w-full" onChange={e => {
                                    setPlanData({ ...planDataState, title: e.target.value })
                                }}
                            />
                            <Select
                                label="Select a day of the plan"
                                className="w-full"
                                onChange={e => {
                                    setPlanData({ ...planDataState, day: e.target.value })
                                }}
                                defaultSelectedKeys={[planData.day]}
                                isDisabled={isLoading}
                            >
                                <SelectItem key={'Monday'} value={'Monday'}>
                                    Monday
                                </SelectItem>
                                <SelectItem key={'Tuesday'} value={'tuesday'}>
                                    Tuesday
                                </SelectItem>
                                <SelectItem key={'Wednesday'} value={'wednesday'}>
                                    Wednesday
                                </SelectItem>
                                <SelectItem key={'Thursday'} value={'thursday'}>
                                    Thursday
                                </SelectItem>
                                <SelectItem key={'Friday'} value={'friday'}>
                                    Friday
                                </SelectItem>
                                <SelectItem key={'Saturday'} value={'saturday'}>
                                    Saturday
                                </SelectItem>
                                <SelectItem key={'Sunday'} value={'sunday'}>
                                    Sunday
                                </SelectItem>

                            </Select>
                            <Input defaultValue={planData.time} isRequired={true} isDisabled={isLoading} type="text" label="Time" size="sm" onChange={e => {
                                setPlanData({ ...planDataState, time: e.target.value });
                            }} />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onDeletePlan}>
                                Delete
                            </Button>
                            <Button color="success" isDisabled={isLoading} onPress={e => { onUpdatePlan(onClose) }}>
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>
}


function LoadingPlan() {
    return <>
        <div className="mb-3 rounded-lg dark:bg-slate-900 p-5 bg-white shadow-lg">
            <div className="flex justify-between items-center">
                <Skeleton className="w-20 rounded-lg">
                    <div className="w-15 h-5 rounded-lg bg-default-300"></div>
                </Skeleton>
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
            </div>
            <h1 className="mt-3 font-semibold">
                <Skeleton className="w-15 rounded-lg">
                    <div className="w-15 h-6 rounded-lg bg-default-300"></div>
                </Skeleton>
            </h1>
        </div>
    </>
}