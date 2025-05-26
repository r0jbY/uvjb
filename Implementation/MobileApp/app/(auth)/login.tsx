import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Image, Keyboard, Pressable, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import logo from '../../assets/Logo.png';
import FloatingLabelInput from '../Components/FloatingLabelInput';

export default function LoginScreen() {
  const handleLogin = () => router.replace('/(tabs)');


  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return (
    <KeyboardAwareScrollView
      /** The view that moves with the keyboard */
      contentContainerStyle={{
        flexGrow: 1,
        justifyContent: isKeyboardOpen ? "flex-start" : 'center',
        alignItems: 'center',
        backgroundColor: '#F7EFDA', // keeps background steady
        paddingBottom: isKeyboardOpen ? 60 : 0,
      }}
      enableOnAndroid           // turns on automatic handling
      keyboardShouldPersistTaps="handled"
    >
      {/* Safe area still respected */}

      <View className={`w-[90%] justify-center items-center ${isKeyboardOpen ? 'pb-4' : 'pb-16'} ${isKeyboardOpen ? 'pt-4' : 'pt-12'}  ${isKeyboardOpen ? 'gap-10' : 'gap-16'} ${isKeyboardOpen ? 'mt-10' : 'mt-0'} rounded-2xl border border-[#B7C0B2] bg-white  shadow-2xl`}>
        <Image
          source={logo}
          className='w-28 h-20' // 👈 set fixed width & height
        />

        <Text className="text-center text-4xl font-extrabold text-[#658F8D]">
          Welcome to Uvjb
        </Text>

        <View className="gap-6 w-[90%]">
          <FloatingLabelInput label="Email" value={email} onChangeText={setEmail} keyboardType='email-address'/>

          <FloatingLabelInput label="Password" value={password} onChangeText={setPassword} secureTextEntry={true} />

          <Pressable
            onPress={handleLogin}
            className="h-14 items-center justify-center rounded-full bg-[#658F8D] mt-6 active:scale-95 active:opacity-85"
          >
            <Text className="text-xl font-bold text-white">Log in</Text>
          </Pressable>
        </View>
      </View>

    </KeyboardAwareScrollView>
  );
}
