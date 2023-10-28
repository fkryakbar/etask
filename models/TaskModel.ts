import RealtimeDB from "@/utils/RealtimeDB";
import { Toast } from "@/utils/Swal";
import { onValue, ref, remove, set, update } from "firebase/database";
import generateUID from "@/utils/GenerateUID";



async function createNewTask(taskData: TaskData, userData: any) {
    const newTaskRef = ref(RealtimeDB, 'task/' + userData.uid + '/' + generateUID());
    await set(newTaskRef, taskData).then(() => {

    }).catch((err) => {
        Toast.fire({
            icon: "error",
            title: 'Error creating task, see logs for details'
        })
    });



}

async function getAllTasks(setTaskData: any, setIsLoading: any, userData: any) {
    const tasksRef = ref(RealtimeDB, 'task/' + userData.uid);
    onValue(tasksRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            setTaskData(data);
        }
        setIsLoading(false)
    });
}

async function deleteTask(taskId: string, uid: any) {
    const tasksRef = ref(RealtimeDB, 'task/' + uid + '/' + taskId);
    await remove(tasksRef).then(() => {

    }).catch((err) => {
        Toast.fire({
            icon: 'error',
            title: 'Error deleting task, see logs for details'
        })

    })
}

async function updateTask(taskId: string, uid: any, newTaskData: any) {
    const tasksRef = ref(RealtimeDB, 'task/' + uid + '/' + taskId);
    await update(tasksRef, newTaskData).then(() => {
    }).catch((err) => {
        Toast.fire({
            icon: 'error',
            title: 'Error updating task, see logs for details'
        })

    });

}

export { createNewTask, getAllTasks, deleteTask, updateTask } 