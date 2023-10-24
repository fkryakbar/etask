import generateUID from "@/utils/GenerateUID";
import RealtimeDB from "@/utils/RealtimeDB";
import { Toast } from "@/utils/Swal";
import { onValue, ref, remove, set, update } from "firebase/database";

async function createNewMemo(memoData: MemoData, userData: any) {
    const newMemoRef = ref(RealtimeDB, 'memo/' + userData.uid + '/' + generateUID());
    await set(newMemoRef, memoData).then(() => {

    }).catch((err) => {
        Toast.fire({
            icon: "error",
            title: 'Error creating Memo, see logs for details'
        })
    });

}

async function getAllMemos(setMemoData: any, setIsLoading: any, userData: any) {
    const memoRef = ref(RealtimeDB, 'memo/' + userData.uid);
    onValue(memoRef, (snapshot) => {
        const data = snapshot.val();
        if (data) {
            setMemoData(data);
        }
        setIsLoading(false)
    });
}


async function updateMemo(memoId: string, userData: any, newMemoData: MemoData) {
    const memoRef = ref(RealtimeDB, 'memo/' + userData.uid + '/' + memoId);
    await update(memoRef, newMemoData).then(() => {
    }).catch((err) => {
        Toast.fire({
            icon: 'error',
            title: 'Error updating Plan, see logs for details'
        })

    });
}

async function deleteMemo(memoId: string, userData: any) {
    const memoRef = ref(RealtimeDB, 'memo/' + userData.uid + '/' + memoId);
    await remove(memoRef).then(() => {

    }).catch((err) => {
        Toast.fire({
            icon: 'error',
            title: 'Error deleting Plan, see logs for details'
        })

    })
}

export { createNewMemo, getAllMemos, updateMemo, deleteMemo }
