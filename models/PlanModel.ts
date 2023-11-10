import addDelay from "@/utils/Delay";
import generateUID from "@/utils/GenerateUID";
import RealtimeDB from "@/utils/RealtimeDB";
import { Toast } from "@/utils/Swal";
import { onValue, ref, remove, set, update } from "firebase/database";

async function createNewPlan(planData: PlanData, userData: any) {
    const newPlanRef = ref(RealtimeDB, 'plan/' + userData.uid + '/' + generateUID());
    await set(newPlanRef, planData).then(() => {

    }).catch((err) => {
        Toast.fire({
            icon: "error",
            title: 'Error creating Plan, see logs for details'
        })
    });

}



async function getAllPlans(setPlanData: any, setIsLoading: any, userData: any) {
    const planRef = ref(RealtimeDB, 'plan/' + userData.uid);
    onValue(planRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            setPlanData(data);
        }
        setIsLoading(false)
    });

}

async function updatePlan(planId: string, userData: any, newPlanData: any) {
    const planRef = ref(RealtimeDB, 'plan/' + userData.uid + '/' + planId);
    await addDelay(200)
    await update(planRef, newPlanData).then(() => {
    }).catch((err) => {
        Toast.fire({
            icon: 'error',
            title: 'Error updating Plan, see logs for details'
        })

    });
}


async function deletePlan(planId: string, userData: any) {
    const planRef = ref(RealtimeDB, 'plan/' + userData.uid + '/' + planId);
    await addDelay(200)
    await remove(planRef).then(() => {

    }).catch((err) => {
        Toast.fire({
            icon: 'error',
            title: 'Error deleting Plan, see logs for details'
        })

    })
}

export { createNewPlan, getAllPlans, updatePlan, deletePlan }