import { Feather } from '@expo/vector-icons';
import { useEffect, useState } from 'react';
import { Image, Keyboard, Pressable, Text, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import logo from '../../assets/Logo.png';
import FloatingLabelInput from '../Components/FloatingLabelInput';
import { login } from '@/Services/Authentication';


export default function LoginScreen() {

  const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState<string | null>(null);
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [loginError, setLoginError] = useState<string | null>(null);

  useEffect(() => {
    const showSub = Keyboard.addListener('keyboardDidShow', () => setIsKeyboardOpen(true));
    const hideSub = Keyboard.addListener('keyboardDidHide', () => setIsKeyboardOpen(false));
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);


  function isValidEmail(email: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  }

  function isValidPassword(password: string): boolean {
    return password.length >= 6;
  }

  const validateLogin = (): boolean => {
    let isValid = true;

    if (!isValidEmail(email)) {
      setEmailError('Please enter a valid email address.');
      isValid = false;
    } else {
      setEmailError(null);
    }

    if (!isValidPassword(password)) {
      setPasswordError('Password must be at least 6 characters long.');
      isValid = false;
    } else {
      setPasswordError(null);
    }

    return isValid;
  };

  const handleLogin = async () => {
    if (!validateLogin()) return;

    try {
      await login(email, password);
      console.log('Worked!');
    } catch (error: unknown) {  

      console.log(error);
      if (error instanceof Error) {
        setLoginError(error.message);
      } else {
        setLoginError('An unknown error occurred');
      }
    }


  };

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

      <View className={`w-[90%] justify-center items-center ${isKeyboardOpen ? 'pb-4' : 'pb-16'} ${isKeyboardOpen ? 'pt-4' : 'pt-6'}  ${isKeyboardOpen ? 'gap-10' : 'gap-14'} ${isKeyboardOpen ? 'mt-10' : 'mt-0'} rounded-2xl border border-[#B7C0B2] bg-white  shadow-2xl`}>
        <Image
          source={logo}
          className='w-28 h-20' // 👈 set fixed width & height
        />

        <Text className="text-center text-4xl font-extrabold text-[#658F8D]">
          Welcome to Uvjb
        </Text>

        <View className="gap-6 w-[90%]">

          {loginError && (
            <View className="flex-row justify-center items-center  gap-2 bg-red-100 border border-red-400 rounded-lg px-5 py-3 mb-3">
              <Feather name="alert-circle" color="#b91c1c" size={16}  />
              <Text className="text-red-700 text-md text-center font-bold">
                {loginError}
              </Text>
            </View>
          )}

          <View className='gap-0 mb-4'>
            <FloatingLabelInput label="Email" value={email} onChangeText={setEmail} keyboardType='email-address' error={emailError !== null} />
            <Text
              className={`text-start pl-5 mt-1 text-red-600 ${emailError ? '' : 'hidden'}`}
              accessibilityRole="alert"
            >
              {emailError}
            </Text>
          </View>

          <View className='gap-0 mb-4'>
            <FloatingLabelInput label="Password" value={password} onChangeText={setPassword} secureTextEntry={true} error={passwordError !== null} />
            <Text
              className={`text-start pl-5 mt-1 text-red-600 ${passwordError ? '' : 'hidden'}`}
              accessibilityRole="alert"
            >
              {passwordError}
            </Text>
          </View>
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
