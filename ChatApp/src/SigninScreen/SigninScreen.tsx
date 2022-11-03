import React, { useCallback, useContext, useMemo, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import validator from 'validator';
import AuthContext from '../components/AuthContext';
import Screen from '../components/Screen';
import Colors from '../modules/Colors';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  section: {
    marginBottom: 20,
  },
  title: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.BLACK,
  },
  input: {
    marginTop: 10,
    borderWidth: 1,
    padding: 10,
    borderRadius: 10,
    borderColor: Colors.GRAY,
    fontSize: 16,
  },
  errorText: {
    fontSize: 15,
    color: Colors.RED,
    marginTop: 4,
  },
  signinButton: {
    backgroundColor: Colors.BLACK,
    borderRadius: 10,
    alignItems: 'center',
    padding: 20,
  },
  signinButtonText: {
    color: Colors.WHITE,
    fontSize: 16,
    fontWeight: 'bold',
  },
  disabledSigninButton: {
    backgroundColor: Colors.GRAY,
  },
  signingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

const SigninScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { signin, processingSignin } = useContext(AuthContext);

  const emailErrorText = useMemo(() => {
    if (email.length === 0) {
      return '이메일을 입력해주세요.';
    }
    if (!validator.isEmail(email)) {
      return '올바른 이메일이 아닙니다.';
    }
    return null;
  }, [email]);

  const passwordErrorText = useMemo(() => {
    if (password.length === 0) {
      return '비밀번호를 입력해주세요.';
    }
    if (password.length < 6) {
      return '비밀번호는 6자리 이상이여야합니다';
    }
    return null;
  }, [password]);

  const onChangeEmailText = useCallback((text: string) => {
    setEmail(text);
  }, []);

  const onChangePasswordText = useCallback((text: string) => {
    setPassword(text);
  }, []);

  const signinButtonEnabled = useMemo(() => {
    return emailErrorText == null && passwordErrorText == null;
  }, [emailErrorText, passwordErrorText]);

  const signinButtonStyle = useMemo(() => {
    if (signinButtonEnabled) {
      return styles.signinButton;
    }
    return [styles.signinButton, styles.disabledSigninButton];
  }, [signinButtonEnabled]);

  const onPressSigninButton = useCallback(async () => {
    try {
      await signin(email, password);
    } catch (error: any) {
      Alert.alert(error.message);
    }
  }, [email, password, signin]);

  return (
    <Screen title="로그인">
      <View style={styles.container}>
        {processingSignin ? (
          <View style={styles.signingContainer}>
            <ActivityIndicator />
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <Text style={styles.title}>이메일</Text>
              <TextInput
                value={email}
                style={styles.input}
                onChangeText={onChangeEmailText}
              />
              {emailErrorText && (
                <Text style={styles.errorText}>{emailErrorText}</Text>
              )}
            </View>
            <View style={styles.section}>
              <Text style={styles.title}>비밀번호</Text>
              <TextInput
                value={password}
                style={styles.input}
                secureTextEntry
                onChangeText={onChangePasswordText}
              />
              {passwordErrorText && (
                <Text style={styles.errorText}>{passwordErrorText}</Text>
              )}
            </View>
            <View>
              <TouchableOpacity
                style={signinButtonStyle}
                onPress={onPressSigninButton}
                disabled={!signinButtonEnabled}>
                <Text style={styles.signinButtonText}>로그인</Text>
              </TouchableOpacity>
            </View>
          </>
        )}
      </View>
    </Screen>
  );
};

export default SigninScreen;
