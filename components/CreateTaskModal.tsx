import { createNewTask } from "@/models/TaskModel";
import { Toast } from "@/utils/Swal";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Textarea } from "@nextui-org/react";
import { Input } from "@nextui-org/react";
import { RadioGroup, Radio } from "@nextui-org/react";
import { useState } from "react";
export default function CreateTaskModal({ isOpen, onOpenChange, userData }: any) {
    const [isLoading, setIsLoading] = useState(false)
    const [taskData, setTaskData] = useState({
        title: '',
        taskType: 'ongoing',
        label: '',
        priority: 'Low',
    })
    async function onCreateTask(onClose: any) {
        setIsLoading(true);
        if (taskData.title == '' || taskData.label == '') {
            Toast.fire({
                icon: 'error',
                title: ' All fields are required'
            })
            setIsLoading(false)
            return false
        }
        await createNewTask(taskData, userData)
        setTaskData({
            title: '',
            taskType: 'ongoing',
            label: '',
            priority: 'Low',
        })
        onClose()
        setIsLoading(false)
    }


    return (
        <>
            <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
                <ModalContent>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Create new Task</ModalHeader>
                            <ModalBody>
                                <Textarea
                                    label="What are you working on"
                                    labelPlacement="inside"
                                    placeholder="Tell me what you are gonna do"
                                    isRequired={true}
                                    isDisabled={isLoading}
                                    className="w-full" onChange={e => {
                                        setTaskData({ ...taskData, title: e.target.value })
                                    }}
                                />
                                <RadioGroup
                                    isRequired={true}
                                    defaultValue={'ongoing'}
                                    label="Task Type"
                                    orientation="horizontal"
                                    color="success"
                                    isDisabled={isLoading}
                                    onChange={e => {
                                        setTaskData({ ...taskData, taskType: e.target.value });
                                    }}

                                >
                                    <Radio value="ongoing">Ongoing</Radio>
                                    <Radio value="upcoming">Upcoming</Radio>
                                    <Radio value="done">Done</Radio>
                                </RadioGroup>
                                <Input isRequired={true} isDisabled={isLoading} type="text" label="Label" size="sm" onChange={e => {
                                    setTaskData({ ...taskData, label: e.target.value });
                                }} />
                                <RadioGroup
                                    label="Priority"
                                    orientation="horizontal"
                                    defaultValue={'Low'}
                                    color="success"
                                    isDisabled={isLoading}
                                    isRequired={true}
                                    onChange={e => {
                                        setTaskData({ ...taskData, priority: e.target.value });
                                    }}
                                >
                                    <Radio value="Low">Low</Radio>
                                    <Radio value="Medium">Medium</Radio>
                                    <Radio value="High">High</Radio>
                                </RadioGroup>
                            </ModalBody>
                            <ModalFooter>
                                <Button color="danger" variant="light" onPress={onClose}>
                                    Close
                                </Button>
                                <Button color="success" isDisabled={isLoading} onPress={e => onCreateTask(onClose)} isLoading={isLoading}>
                                    Create
                                </Button>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}