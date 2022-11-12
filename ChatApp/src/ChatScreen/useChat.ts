import { useCallback, useEffect, useState } from 'react';
import firestore from '@react-native-firebase/firestore';
import _ from 'lodash';

import {
  Chat,
  Collections,
  FirestoreMessageData,
  Message,
  User,
} from '../types';

const getChatKey = (userIds: string[]) => {
  return _.orderBy(userIds, userId => userId, 'asc');
};

const useChat = (userIds: string[]) => {
  const [chat, setChat] = useState<Chat | null>(null);
  const [loadingChat, setLoadingChat] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [sending, setSending] = useState(false);
  const [loadingMessages, setLoadingMessages] = useState(false);

  const addNewMessages = useCallback((newMessages: Message[]) => {
    setMessages(prevMessages => {
      return _.uniqBy(newMessages.concat(prevMessages), m => m.id);
    });
  }, []);

  const loadUsers = async (uIds: string[]) => {
    const usersSnapshot = await firestore()
      .collection(Collections.USERS)
      .where('userId', 'in', uIds)
      .get();
    const users = usersSnapshot.docs.map<User>(doc => doc.data() as User);
    return users;
  };

  const loadChat = useCallback(async () => {
    try {
      setLoadingChat(true);
      const chatSnapshot = await firestore()
        .collection(Collections.CHATS)
        .where('userIds', '==', getChatKey(userIds))
        .get();

      if (chatSnapshot.docs.length > 0) {
        const doc = chatSnapshot.docs[0];
        const chatUserIds = doc.data().userIds as string[];
        const users = await loadUsers(chatUserIds);

        setChat({
          id: doc.id,
          userIds: chatUserIds,
          users: users,
        });
        return;
      }

      const users = await loadUsers(userIds);
      const data = {
        userIds: getChatKey(userIds),
        users,
      };
      const doc = await firestore().collection(Collections.CHATS).add(data);
      setChat({
        id: doc.id,
        ...data,
      });
    } finally {
      setLoadingChat(false);
    }
  }, [userIds]);

  useEffect(() => {
    loadChat();
  }, [loadChat]);

  const sendMessage = useCallback(
    async (text: string, user: User) => {
      if (chat?.id == null) {
        throw new Error('Chat is not loaded');
      }
      try {
        setSending(true);
        const data: FirestoreMessageData = {
          text: text,
          user: user,
          createdAt: new Date(),
        };

        const doc = await firestore()
          .collection(Collections.CHATS)
          .doc(chat.id)
          .collection(Collections.MESSAGES)
          .add(data);

        addNewMessages([
          {
            id: doc.id,
            ...data,
          },
        ]);
      } finally {
        setSending(false);
      }
    },
    [chat?.id, addNewMessages],
  );

  useEffect(() => {
    if (chat?.id == null) {
      return;
    }
    setLoadingMessages(true);
    const unsubscribe = firestore()
      .collection(Collections.CHATS)
      .doc(chat.id)
      .collection(Collections.MESSAGES)
      .orderBy('createdAt', 'desc')
      .onSnapshot(snapshot => {
        const newMessages = snapshot
          .docChanges()
          .filter(({ type }) => type === 'added')
          .map(docChange => {
            const { doc } = docChange;
            const docData = doc.data();
            const newMessage: Message = {
              id: doc.id,
              text: docData.text,
              user: docData.user,
              createdAt: docData.createdAt.toDate(),
            };
            return newMessage;
          });
        addNewMessages(newMessages);
        setLoadingMessages(false);
      });

    return () => {
      unsubscribe();
    };
  }, [addNewMessages, chat?.id]);

  return {
    chat,
    loadingChat,
    sendMessage,
    messages,
    sending,
    loadingMessages,
  };
};

export default useChat;
