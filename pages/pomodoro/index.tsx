import AuthLoading from "@/components/AuthLoading";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { useUser } from "@/utils/Authentication";
import { useAuth } from "@/utils/UserContext";
import { useDisclosure, Button, CircularProgress, Modal, ModalContent, ModalFooter, ModalBody, ModalHeader, Select, SelectItem } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useRef, useState } from "react";

export default function Pomodoro() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isStarted, setIsStarted] = useState(false);
    const [settings, setSettings] = useState<{
        pomodorosTotal: number,
        focusTime: number,
        breakTime: number
    }>({
        pomodorosTotal: 4,
        focusTime: 25,
        breakTime: 5
    })
    const router = useRouter()
    const auth = useAuth()

    if (auth.isLoading == false && auth.userData == null) {
        router.push('/login');
        return null;
    }
    if (auth.isLoading) return <AuthLoading />

    return <DashboardLayout title="Pomodoro">
        <div className="mb-5 text-slate-700 dark:text-white flex-grow flex flex-col">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Pomodoro Clock</h1>
                    <p>A simple method to balance focus with deliberate breaks</p>
                </div>
                <Button className="bg-white dark:bg-black w-fit" size="md" onPress={onOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.324.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.24-.438.613-.431.992a6.759 6.759 0 010 .255c-.007.378.138.75.43.99l1.005.828c.424.35.534.954.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.57 6.57 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.28c-.09.543-.56.941-1.11.941h-2.594c-.55 0-1.02-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.992a6.932 6.932 0 010-.255c.007-.378-.138-.75-.43-.99l-1.004-.828a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.087.22-.128.332-.183.582-.495.644-.869l.214-1.281z" />
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                </Button>
            </div>
            <hr className="my-3 border-dashed border-slate-400 dark:border-slate-600" />
            <Timer pomodoros={settings.pomodorosTotal} focusTime={settings.focusTime} breakTime={settings.breakTime} setIsStarted={setIsStarted} />
            <SettingsModal isOpen={isOpen} onOpenChange={onOpenChange} setSettings={setSettings} settings={settings} isStarted={isStarted} />
        </div>
    </DashboardLayout>
}

function SettingsModal({ isOpen, onOpenChange, setSettings, settings, isStarted }: any) {
    return <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Pomodoro Settings</ModalHeader>
                        <ModalBody>
                            <Select
                                label="Pomodoro Total"
                                placeholder="Select Pomodoro"
                                defaultSelectedKeys={[settings.pomodorosTotal.toString()]}
                                isDisabled={isStarted}
                                onChange={e => {
                                    setSettings({
                                        ...settings,
                                        pomodorosTotal: Number(e.target.value)
                                    })
                                }}
                            >
                                <SelectItem defaultChecked={true} key={'2'} value={2}>
                                    2 Pomodoros
                                </SelectItem>
                                <SelectItem defaultChecked={true} key={'4'} value={4}>
                                    4 Pomodoros
                                </SelectItem>
                                <SelectItem defaultChecked={true} key={'6'} value={6}>
                                    6 Pomodoros
                                </SelectItem>
                                <SelectItem defaultChecked={true} key={'8'} value={8}>
                                    8 Pomodoros
                                </SelectItem>
                            </Select>
                            <Select
                                label="Focus Time"
                                placeholder="Set your focus time"
                                defaultSelectedKeys={[settings.focusTime.toString()]}
                                isDisabled={isStarted}
                                onChange={e => {
                                    setSettings({
                                        ...settings,
                                        focusTime: Number(e.target.value)
                                    })
                                }}
                            >
                                <SelectItem defaultChecked={true} key={'15'} value={15}>
                                    15 Minutes
                                </SelectItem>
                                <SelectItem defaultChecked={true} key={'25'} value={25}>
                                    25 Minutes
                                </SelectItem>
                                <SelectItem defaultChecked={true} key={'35'} value={35}>
                                    35 Minutes
                                </SelectItem>
                                <SelectItem defaultChecked={true} key={'45'} value={45}>
                                    45 Minutes
                                </SelectItem>
                                <SelectItem defaultChecked={true} key={'55'} value={55}>
                                    55 Minutes
                                </SelectItem>
                            </Select>
                            <Select
                                label="Break Time"
                                placeholder="Set your break time"
                                defaultSelectedKeys={[settings.breakTime.toString()]}
                                isDisabled={isStarted}
                                onChange={e => {
                                    setSettings({
                                        ...settings,
                                        breakTime: Number(e.target.value)
                                    })
                                }}
                            >
                                <SelectItem defaultChecked={true} key={'5'} value={5}>
                                    5 Minutes
                                </SelectItem>
                                <SelectItem defaultChecked={true} key={'10'} value={10}>
                                    10 Minutes
                                </SelectItem>
                                <SelectItem defaultChecked={true} key={'15'} value={15}>
                                    15 Minutes
                                </SelectItem>
                            </Select>
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>


    </>
}


function Timer(props: { pomodoros: number, focusTime: number, breakTime: number, setIsStarted: any }) {
    const [pomodoros, setPomodoros] = useState(props.pomodoros);
    const [focusTime, setFocusTime] = useState(props.focusTime);
    const [breakTime, setBreakTime] = useState(props.breakTime);

    const [isStarted, setIsStarted] = useState(false)
    const [isFocusTime, setIsFocusTime] = useState(true)
    const [isPaused, setIsPaused] = useState(false);

    const [secondsFocusLeft, setSecondsFocusLeft] = useState(focusTime * 60)
    const [secondsBreakLeft, setSecondsBreakLeft] = useState(breakTime * 60)
    const [pomodorosLeft, setPomodorosLeft] = useState(pomodoros)
    const [valueProgress, setValueProgress] = useState(0);
    const [intervalId, setIntervalId] = useState(0);
    const [timeLeftDisplay, setTimeLeftDisplay] = useState(`${Math.floor(secondsFocusLeft / 60).toString().padStart(2, '0')}:${(secondsFocusLeft % 60).toString().padStart(2, '0')}`)

    const resetButton = useRef<HTMLButtonElement | null>(null)
    const audioTag = useRef<HTMLAudioElement | null>(null);

    const [isMounted, setIsMounted] = useState(false);

    function startPomodoro() {
        props.setIsStarted(true);
        setIsStarted(true);
        setIsPaused(false)
        let focusSecondsTotal = secondsFocusLeft
        let breakSecondsTotal = secondsBreakLeft
        let pomodorosTotal = pomodorosLeft
        const countdown = setInterval(() => {
            if (pomodorosTotal > 0) {
                if (focusSecondsTotal > 0 && isFocusTime) {
                    focusSecondsTotal = focusSecondsTotal - 1;

                    setValueProgress(100 - Math.round(((focusSecondsTotal) / secondsFocusLeft) * 100));
                    setSecondsFocusLeft(focusSecondsTotal)
                    setTimeLeftDisplay(`${(Math.floor(focusSecondsTotal / 60)).toString().padStart(2, '0')}:${(focusSecondsTotal % 60).toString().padStart(2, '0')}`)
                } else {
                    if (breakSecondsTotal > 0) {
                        setIsFocusTime(false)
                        breakSecondsTotal = breakSecondsTotal - 1;

                        setValueProgress(100 - Math.round(((breakSecondsTotal) / secondsBreakLeft) * 100));
                        setSecondsBreakLeft(breakSecondsTotal)
                        setTimeLeftDisplay(`${(Math.floor(breakSecondsTotal / 60)).toString().padStart(2, '0')}:${(breakSecondsTotal % 60).toString().padStart(2, '0')}`)
                    } else {
                        setIsFocusTime(true);
                        focusSecondsTotal = focusTime * 60
                        breakSecondsTotal = breakTime * 60
                        pomodorosTotal = pomodorosTotal - 1
                        setPomodorosLeft((prev) => prev - 1)

                    }
                }
            } else {
                if (resetButton.current) {
                    resetButton.current.click()
                }
            }

        }, 1000);
        setIntervalId(countdown as any)
    }

    function pausePomodoro() {
        setIsPaused(true)
        setIsStarted(false)
        clearInterval(intervalId)
    }


    function resetPomodoro() {
        props.setIsStarted(false);
        setIsPaused(false)
        setIsStarted(false)
        clearInterval(intervalId)
        setSecondsFocusLeft(focusTime * 60)
        setSecondsBreakLeft(breakTime * 60)
        setIsFocusTime(true)
        setValueProgress(0)
        setPomodorosLeft(pomodoros)
        setTimeLeftDisplay(`${(Math.floor((focusTime * 60) / 60)).toString().padStart(2, '0')}:${((focusTime * 60) % 60).toString().padStart(2, '0')}`)
    }

    useEffect(() => {
        if (isMounted) {
            playAlarm()
        }
        setIsMounted(true)
    }, [isFocusTime])
    useEffect(() => {
        setPomodoros(props.pomodoros);
        setFocusTime(props.focusTime);
        setBreakTime(props.breakTime);

        setPomodorosLeft(props.pomodoros)
        setSecondsFocusLeft(props.focusTime * 60)
        setSecondsBreakLeft(props.breakTime * 60)
        setTimeLeftDisplay(`${(Math.floor((props.focusTime * 60) / 60)).toString().padStart(2, '0')}:${((props.focusTime * 60) % 60).toString().padStart(2, '0')}`)


    }, [props.pomodoros, props.focusTime, props.breakTime]);

    function playAlarm() {
        if (audioTag.current) {
            audioTag.current.play()
        }
    }
    return <>
        <div className="flex-grow flex justify-center items-center mt-3">
            <div className="flex flex-col items-center">
                {
                    isStarted || isPaused ? <>
                        <div className="font-bold">
                            {
                                isFocusTime ? <>
                                    It&apos;s Focus Time!
                                </> : <>
                                    Time to break
                                </>
                            }
                        </div>
                        <div className="text-xs font-semibold mb-3 dark:text-slate-400 text-slate-600">
                            Pomodoro left : {pomodorosLeft}
                        </div>
                    </> : null
                }
                <CircularProgress
                    size="lg"
                    aria-label="Pomodoro"
                    value={valueProgress}
                    valueLabel={timeLeftDisplay}
                    color={`${isFocusTime ? 'warning' : 'success'}`}
                    showValueLabel={true}
                    formatOptions={{ style: 'decimal' }}
                    classNames={{
                        svg: "w-36 h-36 drop-shadow-md",
                        value: "text-2xl font-semibold",
                    }}
                />
                <div className="flex gap-3 mt-4">
                    {
                        !isStarted ? <>
                            <Button onPress={startPomodoro} color="success" className="text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        </> : <>
                            <Button onPress={pausePomodoro} color="warning" className="text-white">
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                                    <path fillRule="evenodd" d="M6.75 5.25a.75.75 0 01.75-.75H9a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H7.5a.75.75 0 01-.75-.75V5.25zm7.5 0A.75.75 0 0115 4.5h1.5a.75.75 0 01.75.75v13.5a.75.75 0 01-.75.75H15a.75.75 0 01-.75-.75V5.25z" clipRule="evenodd" />
                                </svg>
                            </Button>
                        </>
                    }
                    <Button ref={resetButton} onPress={resetPomodoro} color="danger" className="text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-6 h-6">
                            <path fillRule="evenodd" d="M4.5 7.5a3 3 0 013-3h9a3 3 0 013 3v9a3 3 0 01-3 3h-9a3 3 0 01-3-3v-9z" clipRule="evenodd" />
                        </svg>
                    </Button>
                </div>
                <audio ref={audioTag} id="myAudio" className="hidden">
                    <source src="/alarm.m4a" type="audio/mpeg" />
                    Your browser does not support the audio element.
                </audio>
            </div>
        </div>

    </>
}