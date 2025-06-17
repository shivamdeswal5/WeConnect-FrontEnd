"use client";

import {
  Avatar,
  Box,
  Typography,
  TextField,
  InputAdornment,
  Badge,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { fetchAllUsers } from "@/firebase/user-service";
import { useDispatch, useSelector } from "react-redux";
import { setCurrentChatId } from "@/store/chatSlice";
import { RootState } from "@/store";
import { db } from "@/firebase/firebase";
import { onValue, ref } from "firebase/database";

type SomeFunction = (...args: any[]) => void;

interface IUser {
  uid?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  lastMessage?: string;
  unreadCount?: number; 
}

const Contacts = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const currentChatId = useSelector(
    (state: RootState) => state.chat.currentChatId
  );

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearch(e.target.value);
  };

  const debounce = (func: SomeFunction, wait: number) => {
    let timerId: ReturnType<typeof setTimeout>;
    return (...args: unknown[]) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), wait);
    };
  };
  const debounceCall = debounce(handleSearch, 600);

  useEffect(() => {
    const filtered = users.filter((u) =>
      (u.displayName || u.email || "")
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const handleContactClick = (contact: IUser) => {
    if (!currentUser.uid || !contact.uid) return;
    const chatId = [currentUser.uid, contact.uid].sort().join("_");
    localStorage.setItem("currentChatId", JSON.stringify(chatId));
    dispatch(setCurrentChatId(chatId));
    localStorage.setItem("selectedUser", JSON.stringify(contact));
  };

  useEffect(() => {
    if (!currentUser.uid) return;

    const unsubscribers: Array<() => void> = [];

    fetchAllUsers(currentUser.uid, (allUsers) => {
      const promises = allUsers.map((user) => {
        const chatId = [currentUser.uid, user.uid].sort().join("_");

        return new Promise<IUser>((resolve) => {
          const lastMsgRef = ref(db, `lastMessages/${chatId}`);
          const unreadRef = ref(
            db,
            `unreadMessages/${currentUser.uid}/${chatId}`
          );

          let updatedUser: IUser = { ...user };

          const unsub1 = onValue(lastMsgRef, (snapshot) => {
            const lastMsg = snapshot.val();
            if (lastMsg?.text) {
              updatedUser.lastMessage = lastMsg.text;
            }

            setUsers((prev) =>
              prev.map((u) =>
                u.uid === user.uid
                  ? { ...u, lastMessage: lastMsg?.text || "" }
                  : u
              )
            );
          });

          const unsub2 = onValue(unreadRef, (snapshot) => {
            const count = snapshot.val() || 0;
            updatedUser.unreadCount = count;

            setUsers((prev) =>
              prev.map((u) =>
                u.uid === user.uid
                  ? { ...u, unreadCount: count }
                  : u
              )
            );
          });

          unsubscribers.push(() => unsub1());
          unsubscribers.push(() => unsub2());
          resolve(updatedUser);
        });
      });

      Promise.all(promises).then((userList) => {
        setUsers(userList);
      });
    });

    return () => {
      unsubscribers.forEach((u) => u());
    };
  }, [currentUser.uid]);

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      sx={{
        width: "300px",
        borderRight: "1px solid #ccc",
        boxSizing: "border-box",
        px: 2,
        pt: 2,
      }}
    >
      <Typography variant="h4">Messages</Typography>

      <TextField
        fullWidth
        placeholder="Search users..."
        variant="outlined"
        onChange={debounceCall}
        sx={{ my: 2 }}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
      />

      <Box flex={1} overflow="auto" pr={1}>
        {filteredUsers.map((item, index) => (
          <Box
            key={index}
            display="flex"
            alignItems="center"
            padding="10px"
            borderBottom="1px solid #ccc"
            sx={{ cursor: "pointer" }}
            onClick={() => handleContactClick(item)}
          >
            <Badge
              color="error"
              badgeContent={item.unreadCount || 0}
              invisible={!item.unreadCount}
              overlap="circular"
            >
              <Avatar src={item.photoURL || ""} sx={{ mr: 1.5 }} />
            </Badge>
            <Box>
              <Typography variant="body1">
                {item.displayName || item.email?.split("@")[0]}
              </Typography>
              <Typography
                variant="caption"
                color="textSecondary"
                noWrap
                width="180px"
              >
                {item.lastMessage || "No messages yet"}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Contacts;

