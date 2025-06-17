
'use client';

import {
  Avatar,
  Box,
  Typography,
  TextField,
  InputAdornment,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import { useEffect, useState } from 'react';
import { fetchAllUsers } from '../../firebase/user-service';
import { useDispatch } from 'react-redux';
import { setCurrentChatId, setSelectedUser } from '../../store/chatSlice';

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
  const [search, setSearch] = useState('');

  const dispatch = useDispatch();

  const currentUser =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};

  useEffect(() => {
    if (!currentUser.uid) return;
    fetchAllUsers(currentUser.uid, (allUsers) => {
      setUsers(allUsers);
    });
  }, [currentUser.uid]);

  useEffect(() => {
    const filtered = users.filter((u) =>
      (u.displayName || u.email || '')
        .toLowerCase()
        .includes(search.toLowerCase())
    );
    setFilteredUsers(filtered);
  }, [search, users]);

  const handleContactClick = (contact: IUser) => {
    if (!currentUser.uid || !contact.uid) return;
    const chatId = [currentUser.uid, contact.uid].sort().join('_');

    dispatch(setCurrentChatId(chatId));

    dispatch(
      setSelectedUser({
        uid: contact.uid,
        displayName:
          contact.displayName || contact.email?.split('@')[0] || 'User',
        photoURL: contact.photoURL || '',
        email: contact.email,
        isOnline: true,
      })
    );
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      height="100vh"
      sx={{
        width: '300px',
        borderRight: '1px solid #ccc',
        boxSizing: 'border-box',
        px: 2,
        pt: 2,
      }}
    >
      <Typography variant="h4" component="h1">
        Messages
      </Typography>

      <Box mr={2} mt={2} mb={2}>
        <TextField
          fullWidth
          placeholder="Search users..."
          variant="outlined"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>

      <Box flex={1} overflow="auto" pr={2}>
        {filteredUsers.map((item, index) => (
          <Box
            key={index}
            sx={{
              display: 'flex',
              alignItems: 'center',
              padding: '10px',
              borderBottom: '1px solid #ccc',
              cursor: 'pointer',
            }}
            onClick={() => handleContactClick(item)}
          >
            <Avatar
              src={item.photoURL || ''}
              alt={item.displayName || 'User Avatar'}
              sx={{ marginRight: '10px' }}
            />
            <Box>
              <Typography variant="body1">
                {item.displayName !== 'Anonymous' && item.displayName
                  ? item.displayName
                  : item.email?.split('@')[0]}
              </Typography>
              <Typography variant="caption">
                {item?.lastMessage || ''}
              </Typography>
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default Contacts;
