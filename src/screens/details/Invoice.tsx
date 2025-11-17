import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const InvoiceScreen: React.FC = () => (
  <View style={styles.container}>
    <Text>Invoice Content</Text>
  </View>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
});