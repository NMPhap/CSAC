import { getFirestore } from "firebase/firestore";
import firebaseApp from "./firebaseApp";

const database = getFirestore(firebaseApp);
export default database