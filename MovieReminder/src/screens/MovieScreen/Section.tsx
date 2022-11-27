import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import Colors from 'open-color';

const styles = StyleSheet.create({
  section: {
    alignItems: 'flex-start',
  },
  sectionTitleText: {
    fontSize: 20,
    color: Colors.white,
    fontWeight: 'bold',
    marginTop: 24,
    marginBottom: 8,
  },
});

interface SectionProps {
  title: string;
  children?: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <View style={styles.section}>
      <Text style={styles.sectionTitleText}>{title}</Text>
      {children}
    </View>
  );
};

export default Section;
