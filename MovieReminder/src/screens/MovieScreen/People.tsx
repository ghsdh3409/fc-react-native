import React from 'react';
import { Image, StyleSheet, Text, View } from 'react-native';
import Colors from 'open-color';

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    width: 150,
  },
  photo: {
    height: 150,
    backgroundColor: Colors.gray[3],
  },
  bottom: {
    padding: 12,
  },
  nameText: {
    color: Colors.black,
    fontSize: 16,
    fontWeight: 'bold',
  },
  descriptionText: {
    color: Colors.black,
    fontSize: 14,
  },
});

interface PeopleProps {
  name: string;
  description: string;
  photoUrl?: string;
}

const People = ({ name, description, photoUrl }: PeopleProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.photo}>
        {photoUrl && <Image style={styles.photo} source={{ uri: photoUrl }} />}
      </View>
      <View style={styles.bottom}>
        <Text style={styles.nameText}>{name}</Text>
        <Text style={styles.descriptionText}>{description}</Text>
      </View>
    </View>
  );
};

export default People;
