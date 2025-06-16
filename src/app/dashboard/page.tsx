import { Stack } from '@mui/material'
import React from 'react'
import SideBar from '@/components/sidebar/sidebar'
import Contacts from '../../components/contacts/contacts';
import Chat from '@/components/chat/chat';

export default function page() {
  return (
    <Stack direction={"row"} height={"100vh"}>
      <SideBar/>  
      <Contacts/> 
      <Chat/>
    </Stack>
  )
}
