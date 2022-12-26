import OpenColor from 'open-color';
import React from 'react';
import { ActivityIndicator, StyleSheet, View } from 'react-native';
import LoadingBar from './LoadingBar';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: OpenColor.white,
  },
  loadingBar: {
    marginTop: 20,
  },
});

interface LoadingScreenProps {
  progress?: {
    now: number;
    total: number;
  };
}

const LoadingScreen = ({ progress }: LoadingScreenProps) => {
  return (
    <View style={styles.container}>
      <ActivityIndicator />
      {progress != null && (
        <View style={styles.loadingBar}>
          <LoadingBar total={progress.total} now={progress.now} width={200} />
        </View>
      )}
    </View>
  );
};

export default LoadingScreen;
