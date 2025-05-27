// app/(tabs)/index.tsx
import { router } from 'expo-router';
import { Pressable, Text, View } from 'react-native';

export default function HistoryScreen() {
  return (
    <View className="flex-1 justify-center items-center bg-white">
      <Text className="text-3xl font-bold">Welcome!</Text>

      <Pressable
        className="bg-red-500 px-4 py-2 rounded"
        onPress={() => router.replace('/(auth)/login')}
      >
        <Text className="text-white font-semibold">Log out</Text>
      </Pressable>
    </View>
  );
}
