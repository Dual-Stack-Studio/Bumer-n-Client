import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

export default function WelcomeScreen({ navigation }: any) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        
        <Text style={styles.title}>Bumerán</Text>
        
        <TouchableOpacity 
          style={styles.primaryButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.buttonText}>Necesito un favor</Text>
        </TouchableOpacity>

        <TouchableOpacity 
          style={styles.secondaryButton}
          onPress={() => navigation.navigate('Main')}
        >
          <Text style={styles.buttonText}>Quiero hacer un favor</Text>
        </TouchableOpacity>

      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: '#fafaf9', // stone-50
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24, // px-6
  },
  title: {
    fontSize: 36, // text-4xl
    fontWeight: '800', // font-extrabold
    color: '#1e293b', // slate-800
    marginBottom: 48, // mb-12
  },
  primaryButton: {
    width: '100%',
    backgroundColor: '#14b8a6', // teal-500
    paddingVertical: 16, // py-4
    borderRadius: 16, // rounded-2xl
    marginBottom: 16, // mb-4
  },
  secondaryButton: {
    width: '100%',
    backgroundColor: '#fb923c', // orange-400
    paddingVertical: 16, // py-4
    borderRadius: 16, // rounded-2xl
  },
  buttonText: {
    color: '#ffffff',
    textAlign: 'center',
    fontWeight: 'bold',
    fontSize: 18, // text-lg
  }
});