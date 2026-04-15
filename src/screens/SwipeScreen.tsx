import { StyleSheet, Text, View } from 'react-native';

export default function SwipeScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Swipe</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a1a2e' },
  title: { fontSize: 24, color: '#fff' },
});
