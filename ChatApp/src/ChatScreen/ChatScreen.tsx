import { RouteProp, useRoute } from '@react-navigation/native';
import moment from 'moment';
import React, {
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  View,
  Text,
  FlatList,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import ImageCropPicker from 'react-native-image-crop-picker';
import Icon from 'react-native-vector-icons/MaterialIcons';
import AuthContext from '../components/AuthContext';
import Screen from '../components/Screen';
import UserPhoto from '../components/UserPhoto';
import Colors from '../modules/Colors';
import { RootStackParamList } from '../types';
import Message from './Message';
import useChat from './useChat';

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  chatContainer: {
    flex: 1,
    padding: 20,
  },
  membersSection: {},
  membersTitleText: {
    fontSize: 16,
    color: Colors.BLACK,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  userProfile: {
    width: 34,
    height: 34,
    borderRadius: 34 / 2,
    backgroundColor: Colors.BLACK,
    borderWidth: 1,
    borderColor: Colors.LIGHT_GRAY,
    justifyContent: 'center',
    alignItems: 'center',
  },
  userProfileText: {
    color: Colors.WHITE,
  },
  messageList: {
    flex: 1,
    marginVertical: 20,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  textInputContainer: {
    flex: 1,
    marginRight: 10,
    borderRadius: 24,
    borderColor: Colors.BLACK,
    borderWidth: 1,
    overflow: 'hidden',
    padding: 10,
    minHeight: 50,
    justifyContent: 'center',
  },
  textInput: {
    paddingTop: 0,
    paddingBottom: 0,
  },
  sendButton: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.BLACK,
    width: 50,
    height: 50,
    borderRadius: 50 / 2,
  },
  sendIcon: {
    color: Colors.WHITE,
    fontSize: 18,
  },
  messageSeparator: {
    height: 8,
  },
  imageButton: {
    borderWidth: 1,
    borderColor: Colors.BLACK,
    width: 50,
    height: 50,
    borderRadius: 8,
    marginLeft: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageIcon: {
    color: Colors.BLACK,
    fontSize: 32,
  },
  sendingContainer: {
    paddingTop: 10,
    alignItems: 'flex-end',
  },
});

const disabledSendButtonStyle = [
  styles.sendButton,
  { backgroundColor: Colors.GRAY },
];

const ChatScreen = () => {
  const { params } = useRoute<RouteProp<RootStackParamList, 'Chat'>>();
  const { other, userIds } = params;
  const {
    loadingChat,
    chat,
    sendMessage,
    messages,
    loadingMessages,
    updateMessageReadAt,
    userToMessageReadAt,
    sendImageMessage,
    sending,
  } = useChat(userIds);
  const [text, setText] = useState('');
  const sendDisabled = useMemo(() => text.length === 0, [text]);
  const { user: me } = useContext(AuthContext);
  const loading = loadingChat || loadingMessages;

  console.log('messages', messages);

  useEffect(() => {
    if (me != null && messages.length > 0) {
      updateMessageReadAt(me.userId);
    }
  }, [me, messages.length, updateMessageReadAt]);

  const onChangeText = useCallback((newText: string) => {
    setText(newText);
  }, []);

  const onPressSendButton = useCallback(() => {
    if (me != null) {
      sendMessage(text, me);
      setText('');
    }
  }, [me, sendMessage, text]);

  const onPressImageButton = useCallback(async () => {
    if (me != null) {
      const image = await ImageCropPicker.openPicker({ cropping: true });
      sendImageMessage(image.path, me);
    }
  }, [me, sendImageMessage]);

  const renderChat = useCallback(() => {
    if (chat == null) {
      return null;
    }
    return (
      <View style={styles.chatContainer}>
        <View style={styles.membersSection}>
          <Text style={styles.membersTitleText}>대화상대</Text>
          <FlatList
            data={chat.users}
            renderItem={({ item: user }) => (
              <UserPhoto
                size={34}
                style={styles.userProfile}
                name={user.name}
                nameStyle={styles.userProfileText}
                imageUrl={user.profileUrl}
              />
            )}
            horizontal
          />
        </View>
        <FlatList
          inverted
          style={styles.messageList}
          data={messages}
          renderItem={({ item: message }) => {
            const user = chat.users.find(u => u.userId === message.user.userId);
            const unreadUsers = chat.users.filter(u => {
              const messageReadAt = userToMessageReadAt[u.userId] ?? null;
              if (messageReadAt == null) {
                return true;
              }
              return moment(messageReadAt).isBefore(message.createdAt);
            });
            const unreadCount = unreadUsers.length;

            if (message.text != null) {
              return (
                <Message
                  name={user?.name ?? ''}
                  text={message.text}
                  createdAt={message.createdAt}
                  isOtherMessage={message.user.userId !== me?.userId}
                  imageUrl={user?.profileUrl}
                  unreadCount={unreadCount}
                />
              );
            }
            if (message.imageUrl != null) {
              return null;
            }
            return null;
          }}
          ItemSeparatorComponent={() => (
            <View style={styles.messageSeparator} />
          )}
          ListHeaderComponent={() => {
            if (sending) {
              return (
                <View style={styles.sendingContainer}>
                  <ActivityIndicator />
                </View>
              );
            }
            return null;
          }}
        />
        <View style={styles.inputContainer}>
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              value={text}
              onChangeText={onChangeText}
              multiline
            />
          </View>
          <TouchableOpacity
            style={sendDisabled ? disabledSendButtonStyle : styles.sendButton}
            disabled={sendDisabled}
            onPress={onPressSendButton}>
            <Icon style={styles.sendIcon} name="send" />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.imageButton}
            onPress={onPressImageButton}>
            <Icon name="image" style={styles.imageIcon} />
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [
    chat,
    onChangeText,
    text,
    sendDisabled,
    onPressSendButton,
    messages,
    me?.userId,
    userToMessageReadAt,
    onPressImageButton,
    sending,
  ]);

  return (
    <Screen title={other.name}>
      <View style={styles.container}>
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          renderChat()
        )}
      </View>
    </Screen>
  );
};

export default ChatScreen;
