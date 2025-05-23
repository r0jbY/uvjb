import { router } from 'expo-router';
import { Image, Pressable, Text, TextInput, View } from 'react-native';
export default function LoginScreen() {
  const handleLogin = () => {
    router.replace('/(tabs)')
  };

  return (
    
    
      <View className="flex-1 justify-center items-center bg-[#F7EFDA]">
        
        <View className="items-center pt-10 gap-20 bg-white w-[85%] h-[70%] rounded-2xl border border-[#B7C0B2] shadow-2xl">

          <Image />
          <Text className="text-3xl text-[#658F8D] font-bold mb-4">Welcome to Uvjb</Text>

          <View className='gap-10 w-[90%]'>
            <TextInput placeholder='Email' className='w-full h-14 p-3 border border-[#C3B295] rounded-3xl bg-[#F7F7F7]'></TextInput>
            <TextInput placeholder='Password' className='w-full h-14 p-3 border border-[#C3B295] rounded-3xl bg-[#F7F7F7]' />
            <Pressable
              onPress={handleLogin}
              className="bg-[#658F8D] h-14 justify-center rounded-3xl active:scale-95 active:opacity-85"
            >
              <Text className="text-white font-bold text-xl text-center">Log in</Text>
            </Pressable>
          </View>


        </View>

      </View>
    
  );
}
