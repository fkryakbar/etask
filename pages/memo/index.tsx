import AuthLoading from "@/components/AuthLoading";
import DashboardLayout from "@/components/Layout/DashboardLayout";
import { createNewMemo, deleteMemo, getAllMemos, updateMemo } from "@/models/MemoModel";
import { useUser } from "@/utils/Authentication";
import { Toast } from "@/utils/Swal";
import { useAuth } from "@/utils/UserContext";
import { Button, Input, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Skeleton, Textarea, VisuallyHidden, useDisclosure, useSwitch } from "@nextui-org/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Markdown from "react-markdown";

export default function Memo() {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const router = useRouter()
    const auth = useUser()

    if (auth.isLoading == false && auth.userData == null) {
        router.push('/login');
        return null;
    }
    if (auth.isLoading) return <AuthLoading />
    return <DashboardLayout title="Memo">
        <div className="mb-5 text-slate-700 dark:text-white">
            <div className="flex justify-between items-center">
                <div>
                    <h1 className="text-3xl font-bold">Memo</h1>
                    <p>Crafting Ideas, One Note at a Time.</p>
                </div>
                <Button className="bg-white dark:bg-black w-fit" size="md" onPress={onOpen}>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v6m3-3H9m12 0a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </Button>
            </div>
            <hr className="mt-3 border-dashed border-slate-400 dark:border-slate-600" />
            <MemosComponent />
            <CreateMemoModal isOpen={isOpen} onOpenChange={onOpenChange} />
        </div>

    </DashboardLayout>
}

function CreateMemoModal({ isOpen, onOpenChange }: { isOpen: boolean, onOpenChange: () => void }) {
    const [isLoading, setIsLoading] = useState(false)
    const [memoData, setMemoData] = useState({
        title: '',
        memo: '',
        updatedAt: Date.now()
    })
    const { userData } = useAuth()
    async function onCreatePlan(onCloseFunction: any) {
        setIsLoading(true);
        if (memoData.title == '' || memoData.memo == '') {
            Toast.fire({
                icon: 'error',
                title: 'All fields are required'
            })
            setIsLoading(false)
            return false
        }

        await createNewMemo(memoData, userData)
        setMemoData({
            title: '',
            memo: '',
            updatedAt: Date.now()
        })
        setIsLoading(false);
        onCloseFunction()

    }
    return <>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex flex-col gap-1">Create new Memo</ModalHeader>
                        <ModalBody>
                            <Input isRequired={true} isDisabled={isLoading} type="text" label="Title" size="sm" onChange={e => {
                                setMemoData({ ...memoData, title: e.target.value });
                            }} />
                            <Textarea
                                label="Your Memo"
                                labelPlacement="inside"
                                placeholder="Tell me what you want me to keep..."
                                isRequired={true}
                                isDisabled={isLoading}
                                className="w-full" onChange={e => {
                                    setMemoData({ ...memoData, memo: e.target.value })
                                }}
                            />
                        </ModalBody>
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onClose}>
                                Close
                            </Button>
                            <Button color="success" isDisabled={isLoading} onPress={e => { onCreatePlan(onClose) }} isLoading={isLoading}>
                                Create
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>


    </>
}

function MemosComponent() {
    const [memoData, setMemoData] = useState<{ [memoId: string]: MemoData }>({})
    const [isLoading, setIsLoading] = useState(true);
    const { userData } = useAuth()
    useEffect(() => {
        getAllMemos(setMemoData, setIsLoading, userData)
    }, []);
    return <>
        <div className="grid lg:grid-cols-3 grid-cols-1 gap-4 text-slate-700 dark:text-white mt-4">
            {
                isLoading && memoData ? (<MemoLoading />) : Object.keys(memoData).map((memoId: string) => {
                    return <MemoComponent memoData={memoData[memoId]} key={memoId} memoId={memoId} />
                })
            }
            {
                isLoading == false && Object.keys(memoData).length == 0 ? (
                    <div className="flex flex-col justify-center items-center gap-4 dark:text-slate-300 text-slate-600 mt-2">
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
                            There&apos;s no memo to display
                        </p>
                    </div>
                ) : null
            }
        </div>

    </>
}

function MemoLoading() {
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

const EditToggler = (props: any) => {
    const {
        Component,
        slots,
        isSelected,
        getBaseProps,
        getInputProps,
        getWrapperProps
    } = useSwitch(props);

    return (
        <div className="flex flex-col gap-2">
            <Component {...getBaseProps()}>
                <VisuallyHidden>
                    <input {...getInputProps()} />
                </VisuallyHidden>
                <div
                    {...getWrapperProps()}
                    className={slots.wrapper({
                        class: [
                            "w-8 h-8",
                            "flex items-center justify-center",
                            "rounded-lg bg-default-100 hover:bg-default-200",
                        ],
                    })}
                >
                    {isSelected ? <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-w-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </> : <>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                        </svg>
                    </>}
                </div>
            </Component>
        </div>
    )
}

function useDebounce<T>(value: T, delay: number): T {
    const [debouncedValue, setDebouncedValue] = useState<T>(value);

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        return () => {
            clearTimeout(timeoutId);
        };
    }, [value, delay]);

    return debouncedValue;
}

function MemoComponent({ memoData, memoId }: { memoData: MemoData, memoId: string }) {
    const { isOpen, onOpen, onOpenChange } = useDisclosure();
    const [isLoading, setIsLoading] = useState(false)
    const [memoDataState, setMemoData] = useState(memoData)
    const [isEditMode, setIsEditMode] = useState(false)
    const debouncedInput = useDebounce(memoDataState, 500);
    const { userData } = useAuth()

    async function onDeleteMemo() {
        setIsLoading(true)
        await deleteMemo(memoId, userData);
        setIsLoading(false)
    }
    useEffect(() => {
        updateMemo(memoId, userData, debouncedInput)
    }, [debouncedInput]);
    function changeMode(e: React.ChangeEvent<HTMLInputElement>) {
        setIsEditMode(e.target.checked);
    }

    return <>
        <div onClick={onOpen} className="rounded-lg dark:bg-slate-900 p-5 bg-white shadow-lg hover:cursor-pointer transition-all hover:scale-[1.02] max-h-[125px] overflow-hidden text-ellipsis">
            <div className="flex justify-between items-center">
                <h1 className="font-bold text-2xl">{memoData.title}</h1>
            </div>
            <div className="mt-3 prose dark:prose-invert prose-sm prose-p:mt-0 prose-p:mb-0 prose-h1:text-lg prose-h2:text-lg prose-h3:text-lg prose-h4:text-lg">
                <Markdown>
                    {memoData.memo.replace(/\n/gi, "\n\n")}
                </Markdown>
            </div>
        </div>
        <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className="flex justify-between gap-1">
                            <h1>{memoData.title}</h1>
                            <EditToggler size='sm' onChange={(e: any) => changeMode(e)} />

                        </ModalHeader>
                        {
                            isEditMode ? <>
                                <ModalBody>
                                    <Input defaultValue={memoData.title} isRequired={true} isDisabled={isLoading} type="text" label="Title" size="sm" onChange={e => {
                                        const currentTime = Date.now();
                                        setMemoData({ ...memoDataState, title: e.target.value, updatedAt: currentTime });
                                    }} />
                                    <Textarea
                                        label="Your Memo"
                                        labelPlacement="inside"
                                        placeholder="Tell me what you want me to keep..."
                                        isRequired={true}
                                        isDisabled={isLoading}
                                        defaultValue={memoDataState.memo}
                                        defaultChecked={true}
                                        className="w-full" onChange={e => {
                                            const currentTime = Date.now();
                                            setMemoData({ ...memoDataState, memo: e.target.value, updatedAt: currentTime });
                                        }}
                                    />

                                </ModalBody>
                            </> : <>
                                <ModalBody className="max-h-[400px] overflow-y-auto">
                                    <div className="mt-3 prose dark:prose-invert prose-sm prose-p:mt-0 prose-p:mb-0 prose-p:text-xs lg:prose-p:text-sm">
                                        <Markdown>
                                            {memoData.memo.replace(/\n/gi, "\n\n")}
                                        </Markdown>
                                    </div>
                                </ModalBody>
                            </>
                        }
                        <ModalFooter>
                            <Button color="danger" variant="light" onPress={onDeleteMemo} isLoading={isLoading}>
                                Delete
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    </>

}