// 'use client';

// import {
//   Avatar,
//   Box,
//   IconButton,
//   TextField,
//   Typography,
//   InputAdornment,
// } from '@mui/material';
// import SendIcon from '@mui/icons-material/Send';
// import { useEffect, useRef, useState } from 'react';
// import { useSelector } from 'react-redux';
// import { RootState } from '@/store';
// import { db } from '@/firebase/firebase';
// import { onValue, push, ref, set } from 'firebase/database';
// import { useDispatch } from "react-redux";
// import { setMessages } from "@/store/chatSlice";
// import { addMessage } from "@/store/chatSlice";

// interface IMessage {
//   text: string;
//   senderId: string;
//   timestamp: number;
// }

// const Chat = () => {
//   const [message, setMessage] = useState('');
//   const [status, setStatus] = useState('Offline');
//   const [messages, setMessages] = useState<IMessage[]>([]);
//   const scrollRef = useRef<HTMLDivElement>(null);
//   const dispatch = useDispatch();

//   const currentChatId = useSelector(
//     (state: RootState) => state.chat.currentChatId
//   );

//   const currentUser =
//     typeof window !== 'undefined'
//       ? JSON.parse(localStorage.getItem('user') || '{}')
//       : {};
//   const selectedUser =
//     typeof window !== 'undefined'
//       ? JSON.parse(localStorage.getItem('selectedUser') || '{}')
//       : {};

//   useEffect(() => {
//     if (!currentChatId) return;

//     const chatRef = ref(db, `messages/${currentChatId}`);
//     const unsubscribe = onValue(chatRef, (snapshot) => {
//       const msgs: IMessage[] = [];
//       snapshot.forEach((childSnapshot) => {
//         const data = childSnapshot.val();
//         msgs.push(data);
//         dispatch(addMessage(data));
//       });
//       setMessages(msgs);
//       setTimeout(() => {
//         scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
//       }, 100);

//     });

//     return () => unsubscribe();
//   }, [currentChatId]);


//   const handleSend = () => {
//     if (!message.trim() || !currentChatId || !currentUser?.uid) return;

//     const newMsg: IMessage = {
//       text: message,
//       senderId: currentUser.uid,
//       timestamp: Date.now(),
//     };

//     const chatRef = ref(db, `messages/${currentChatId}`);
//     push(chatRef, newMsg);

//     // const chatRef2 = ref(db, `messages/${currentChatId}/lastMessage`);
//     const chatRef2 = ref(db, `messages/${currentChatId}/lastMessage`);
//     set(chatRef2, newMsg);

//     setMessage('');
//   };

//   const handleClick = () => {
//     setStatus('typing...');    
//   };

//   const handleHover = () => {
//     setStatus('offline');    
//   };

//   return (
//     <Box
//       flex={3}
//       display="flex"
//       flexDirection="column"
//       height="100vh"
//       width="100%"
//       onMouseOver = {handleHover}
//     >
//       {currentChatId ? (
//         <>
//           {/* Header */}
//           <Box
//             display="flex"
//             alignItems="center"
//             px={2}
//             py={1}
//             borderBottom="1px solid #ccc"
//             bgcolor="#f5f5f5"
//           >
//             <Avatar src={selectedUser.photoURL || ''} />
//             <Box ml={2}>
//               <Typography variant="subtitle1">
//                 {selectedUser.displayName || selectedUser.email}
//               </Typography>
//               <Typography variant="caption" color="green">
//                 {/* {currentUser.isOnline ? 'Online' : 'Offline'} */}
//                 {status}
//               </Typography>
//             </Box>
//           </Box>

//           {/* Messages */}
//           <Box
//             flex={1}
//             p={2}
//             overflow="auto"
//             sx={{
//               backgroundColor: '#fafafa',
//               display: 'flex',
//               flexDirection: 'column',
//               gap: '8px',
//             }}
//           >
//             {messages.map((msg, index) => (
//               <Box
//                 key={index}
//                 alignSelf={
//                   msg.senderId === currentUser.uid
//                     ? 'flex-end'
//                     : 'flex-start'
//                 }
//                 bgcolor={
//                   msg.senderId === currentUser.uid ? '#DCF8C6' : '#fff'
//                 }
//                 p={1.2}
//                 borderRadius={2}
//                 maxWidth="70%"
//               >
//                 <Typography variant="body2">{msg.text}</Typography>
//               </Box>
//             ))}
//             <div ref={scrollRef} />
//           </Box>

//           {/* Input */}
//           <Box px={2} py={1} borderTop="1px solid #ccc" bgcolor="#f5f5f5">
//             <TextField
//               fullWidth
//               placeholder="Type a message"
//               value={message}
//               onChange={(e) => setMessage(e.target.value)}
//               onKeyDown={(e) => e.key === 'Enter' && handleSend()}
//               onInput={handleClick}
//               InputProps={{
//                 endAdornment: (
//                   <InputAdornment position="end">
//                     <IconButton onClick={handleSend}>
//                       <SendIcon />
//                     </IconButton>
//                   </InputAdornment>
//                 ),
//               }}
//             />
//           </Box>
//         </>
//       ) : (
//         <Box
//           flex={1}
//           display="flex"
//           alignItems="center"
//           justifyContent="center"
//         >
//           <Typography variant="h6" color="textSecondary">
//             Select a contact to start chatting
//           </Typography>
//         </Box>
//       )}
//     </Box>
//   );
// };

// export default Chat;

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
import { useEffect, useRef, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '@/store';
import { db } from '@/firebase/firebase';
import {
  onValue,
  push,
  ref,
  set,
  onDisconnect,
} from 'firebase/database';
import { setMessages, addMessage } from '@/store/chatSlice';

interface IMessage {
  text: string;
  senderId: string;
  timestamp: number;
}

const Chat = () => {
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState('Offline');
  const [messages, setMessagesState] = useState<IMessage[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const dispatch = useDispatch();

  const currentChatId = useSelector(
    (state: RootState) => state.chat.currentChatId
  );

  const currentUser =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('user') || '{}')
      : {};
  const selectedUser =
    typeof window !== 'undefined'
      ? JSON.parse(localStorage.getItem('selectedUser') || '{}')
      : {};

  useEffect(() => {
    if (!currentUser?.uid) return;

    const userRef = ref(db, `onlineUsers/${currentUser.uid}`);
    set(userRef, true);
    onDisconnect(userRef).set(false);
  }, []);

  useEffect(() => {
    if (!currentChatId) return;

    const chatRef = ref(db, `messages/${currentChatId}`);
    const unsubscribe = onValue(chatRef, (snapshot) => {
      const msgs: IMessage[] = [];
      snapshot.forEach((childSnapshot) => {
        const data = childSnapshot.val();
        msgs.push(data);
        dispatch(addMessage(data));
      });
      setMessagesState(msgs);
      setTimeout(() => {
        scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    });

    return () => unsubscribe();
  }, [currentChatId]);

  useEffect(() => {
    if (!selectedUser?.uid || !currentChatId || !currentUser?.uid) return;
    const statusRef = ref(db, `onlineUsers/${selectedUser.uid}`);
    const unsubscribeStatus = onValue(statusRef, (snapshot) => {
      const isOnline = snapshot.val();
      setStatus(isOnline ? 'Online' : 'Offline');
    });

    const typingRef = ref(db, `typingStatus/${currentChatId}/${selectedUser.uid}`);
    const unsubscribeTyping = onValue(typingRef, (snapshot) => {
      const isTyping = snapshot.val();
      if (isTyping) setStatus('Typing...');
    });

    return () => {
      unsubscribeStatus();
      unsubscribeTyping();
    };
  }, [selectedUser?.uid, currentChatId]);

  const handleTyping = () => {
    if (!currentChatId || !currentUser?.uid) return;

    const typingRef = ref(db, `typingStatus/${currentChatId}/${currentUser.uid}`);
    set(typingRef, true);

    setTimeout(() => {
      set(typingRef, false);
    }, 2000);
  };

  const handleSend = () => {
    if (!message.trim() || !currentChatId || !currentUser?.uid) return;

    const newMsg: IMessage = {
      text: message,
      senderId: currentUser.uid,
      timestamp: Date.now(),
    };

    const chatRef = ref(db, `messages/${currentChatId}`);
    push(chatRef, newMsg);

    const lastMsgRef = ref(db, `lastMessages/${currentChatId}`);
    set(lastMsgRef, {
      ...newMsg,
      receiverId: selectedUser.uid,
    });

    setMessage('');
  };

  return (
    <Box
      flex={3}
      display="flex"
      flexDirection="column"
      height="100vh"
      width="100%"
    >
      {currentChatId ? (
        <>
          {/* Header */}
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
              <Typography
                variant="caption"
                color={
                  status === 'Online' || status === 'Typing...'
                    ? 'green'
                    : 'textSecondary'
                }
              >
                {status}
              </Typography>
            </Box>
          </Box>

          {/* Messages */}
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
            {messages.map((msg, index) => (
              <Box
                key={index}
                alignSelf={
                  msg.senderId === currentUser.uid
                    ? 'flex-end'
                    : 'flex-start'
                }
                bgcolor={
                  msg.senderId === currentUser.uid ? '#DCF8C6' : '#fff'
                }
                p={1.2}
                borderRadius={2}
                maxWidth="70%"
              >
                <Typography variant="body2">{msg.text}</Typography>
              </Box>
            ))}
            <div ref={scrollRef} />
          </Box>

          {/* Input */}
          <Box px={2} py={1} borderTop="1px solid #ccc" bgcolor="#f5f5f5">
            <TextField
              fullWidth
              placeholder="Type a message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              onInput={handleTyping}
              InputProps={{
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={handleSend}>
                      <SendIcon />
                    </IconButton>
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        </>
      ) : (
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
      )}
    </Box>
  );
};

export default Chat;
