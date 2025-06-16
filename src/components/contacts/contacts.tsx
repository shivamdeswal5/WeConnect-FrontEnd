'use client'
import { Avatar, Box, Typography } from "@mui/material";
import {
  collection,
  collectionGroup,
  doc,
  onSnapshot,
  query,
  setDoc,
  where,
} from "firebase/firestore";
import { useEffect, useRef, useState } from "react";
import SearchIcon from "@mui/icons-material/Search";
import Search from "@mui/icons-material/Search";

interface IUser {
  uid?: string;
  email?: string;
  photoURL?: string;
  displayName?: string;
  lastMessage?: string;
}

const Contacts = () => {
 
  const [user, setUser] = useState<IUser[]>([]);
  const [allUsers, setAllUsers] = useState<IUser[]>([]);
  const [lastVisible, setLastVisible] = useState<any>(null);

  return (
    <Box
      flex={1}
      sx={{
        p: "16px 0 16px 16px",
        width: "300px",
        borderRight: "1px solid #ccc",
      }}
    >
      <Typography variant="h4" component={"h1"}>
        Messages
      </Typography>

      <Box mr={2} mt={2} mb={2}>
        <Search>  
        </Search>
      </Box>

      <Typography
        variant="subtitle1"
        component={"h2"}
        sx={{ marginTop: "20px" }}
      >
        Sort By
      </Typography>
      
      <Box
        id="scrollContainer"
        maxHeight={"40%"}
        overflow={"auto"}
      >
        {user.map((item, index) => {
          return (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                padding: "10px",
                borderBottom: "1px solid #ccc",
                cursor: "pointer",
              }}
            >
              <Avatar
                src={item.photoURL || ""}
                alt={item.displayName || "User Avatar"}
                sx={{ marginRight: "10px" }}
              />
              <Box>
                <Typography variant="body1">
                  {item.displayName !== "Anonymous" || undefined
                    ? item.displayName
                    : item.email?.split("@")[0]}
                </Typography>
                <Typography variant="caption">{item?.lastMessage}</Typography>
              </Box>
              <Box>
                
                  <Typography variant="subtitle2"></Typography>
            
              </Box>{" "}
            </Box>
          );
        })}
      </Box>
    </Box>
  );
};

export default Contacts;