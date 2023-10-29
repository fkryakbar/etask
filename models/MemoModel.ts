import generateUID from "@/utils/GenerateUID";
import RealtimeDB from "@/utils/RealtimeDB";
import { Toast } from "@/utils/Swal";
import { onValue, orderByChild, orderByKey, orderByValue, query, ref, remove, set, update } from "firebase/database";

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
    const memoRef = query(ref(RealtimeDB, 'memo/' + userData.uid), orderByChild('updatedAt'));
    onValue(memoRef, (snapshot) => {
        const data: { [memoId: string]: MemoData } = snapshot.val();
        const orderedAscData: { [memoId: string]: MemoData } = {}


        snapshot.forEach((el: any) => {
            orderedAscData[el.key] = el.val();
        });

        const orderedAscDataArray = Object.keys(orderedAscData).map(key => ({
            [key]: data[key]
        }));


        orderedAscDataArray.sort((a, b) => b[Object.keys(b)[0]].updatedAt - a[Object.keys(a)[0]].updatedAt);
        const orderedDescData = orderedAscDataArray.reduce((obj, item) => {
            obj[Object.keys(item)[0]] = item[Object.keys(item)[0]];
            return obj;
        }, {});


        if (data) {
            setMemoData(orderedDescData);
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
