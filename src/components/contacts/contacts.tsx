"use client";

import {
  Avatar,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useEffect, useState } from "react";
import { fetchAllUsers } from "@/firebase/user-service";
import { useDispatch } from "react-redux";
import { setCurrentChatId } from "@/store/chatSlice";
type SomeFunction = (...args: any[]) => void;

interface IUser {
  uid?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  lastMessage?: string;
}

const Contacts = () => {
  const [users, setUsers] = useState<IUser[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<IUser[]>([]);
  const [search, setSearch] = useState("");
  const dispatch = useDispatch();

  const currentUser =
    typeof window !== "undefined"
      ? JSON.parse(localStorage.getItem("user") || "{}")
      : {};

  useEffect(() => {
    if (!currentUser.uid) return;
    fetchAllUsers(currentUser.uid, (allUsers) => {
      setUsers(allUsers);
    });
  }, [currentUser.uid]);

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
    dispatch(setCurrentChatId(chatId));
    localStorage.setItem("selectedUser", JSON.stringify(contact));
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
   setSearch(e.target.value);
   console.log("search");
  };

  const debounce = (func: SomeFunction, wait: number) => {
    let timerId: ReturnType<typeof setTimeout>;
    return (...args: unknown[]) => {
      clearTimeout(timerId);
      timerId = setTimeout(() => func(...args), wait);
    };
  };
  const debounceCall = debounce(handleSearch, 600);

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
        value={search}
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
            <Avatar src={item.photoURL || ""} sx={{ mr: 1.5 }} />
            <Box>
              <Typography variant="body1">
                {item.displayName || item.email?.split("@")[0]}
              </Typography>
              <Typography variant="caption">
                {item?.lastMessage || ""}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Contacts;
