import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ChatList from '../components/chat/ChatList';
import ChatRoom from '../components/chat/ChatRoom';

export default function Chat() {
  return (
    <Routes>
      <Route index element={<ChatList />} />
      <Route path=":chatId" element={<ChatRoom />} />
    </Routes>
  );
}