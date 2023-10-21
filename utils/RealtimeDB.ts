import { getDatabase } from "firebase/database";
import FirebaseApp from "./Firebase";

const RealtimeDB = getDatabase(FirebaseApp);
export default RealtimeDB