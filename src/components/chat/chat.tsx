// components/Chat.tsx

'use client';

import {
  Avatar,
  Box,
  IconButton,
  TextField,
  Typography,
  InputAdornment,
} from '@mui/material';
import SendIcon from '@mui/icons-material/Send';
import { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store/index';

const Chat = () => {
  const [message, setMessage] = useState('');

  const currentChatId = useSelector(
    (state: RootState) => state.chat.currentChatId
  );
  const selectedUser = useSelector(
    (state: RootState) => state.chat.selectedUser
  );

  if (!currentChatId || !selectedUser) {
    return (
      <Box
        flex={1}
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        <Typography variant="h6" color="textSecondary">
          Select a contact to start chatting
        </Typography>
      </Box>
    );
  }

  return (
    <Box
      flex={3}
      display="flex"
      flexDirection="column"
      height="98vh"
      width="100%"
    >
      {/* Chat Header */}
      <Box
        display="flex"
        alignItems="center"
        px={2}
        py={1}
        borderBottom="1px solid #ccc"
        bgcolor="#f5f5f5"
      >
        <Avatar src={selectedUser.photoURL || ''} />
        <Box ml={2}>
          <Typography variant="subtitle1">
            {selectedUser.displayName || selectedUser.email}
          </Typography>
          <Typography variant="caption" color="green">
            {selectedUser.isOnline ? 'Online' : 'Offline'}
          </Typography>
        </Box>
      </Box>

      {/* Messages List */}
      <Box
        flex={1}
        p={2}
        overflow="auto"
        sx={{
          backgroundColor: '#fafafa',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px',
        }}
      >
        {/* TEMPORARY MESSAGES */}
        <Box alignSelf="flex-end" bgcolor="#DCF8C6" p={1} borderRadius={2}>
          <Typography variant="body2">Hi there!</Typography>
        </Box>
        <Box alignSelf="flex-start" bgcolor="#fff" p={1} borderRadius={2}>
          <Typography variant="body2">Hello! How are you?</Typography>
        </Box>
      </Box>

      {/* Message Input */}
      <Box px={2} py={1} borderTop="1px solid #ccc" bgcolor="#f5f5f5">
        <TextField
          fullWidth
          placeholder="Type a message"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton
                  onClick={() => {
                    if (message.trim()) {
                      console.log('Send:', message);
                      setMessage('');
                    }
                  }}
                >
                  <SendIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
};

export default Chat;
