import { get, limitToFirst, onValue, orderByChild, query, ref, startAfter } from "firebase/database";
import { db } from "./firebase";

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

export async function fetchUsersBatch(
  currentUid: string,
  lastEmail: string | null = null,
  limit: number = 12
): Promise<any[]> {
  const usersRef = ref(db, "users");

  const usersQuery = lastEmail
    ? query(usersRef, orderByChild("email"), startAfter(lastEmail), limitToFirst(limit))
    : query(usersRef, orderByChild("email"), limitToFirst(limit));

  const snapshot = await get(usersQuery);
  const data = snapshot.val();

  console.log("FETCHED USERS DATA:", data);

  const users = data
    ? Object.values(data).filter((user: any) => user.uid !== currentUid)
    : [];

  return users;
}

console.log("User Data In Batch: ",fetchUsersBatch("FV3Iif0mIKQExAS2t6KJz8W300g1"))