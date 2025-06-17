import { db } from "./firebase";
import { onValue, ref } from "firebase/database";

export function fetchAllUsers(currentUid: string, callback: (users: any[]) => void) {
  const usersRef = ref(db, "users");

  onValue(usersRef, (snapshot) => {
    const data = snapshot.val();
    const users = data
      ? Object.values(data).filter((user: any) => user.uid !== currentUid)
      : [];
    callback(users);
  });
}
