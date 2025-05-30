// app/(tabs)/index.tsx
import { Pressable, Text, View, Image, ScrollView, TextInput, SafeAreaView } from 'react-native';
import ProfileField from '../Components/ProfileField';
import turtle from '../../assets/turtle.png'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useKeyboard from '@/hooks/useKeyboard';
import { useRef, useState } from 'react';

export default function ProfileScreen() {

  const tabBarHeight = 64;
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { isKeyboardOpen } = useKeyboard();
  const SPARE = bottom + 64 + 124;

  

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  return (
    <SafeAreaView className="flex-1 bg-white">

      <KeyboardAwareScrollView
        className="bg-[#F7EFDA] flex-1 "
        scrollEnabled={!isKeyboardOpen}       
        showsVerticalScrollIndicator={!isKeyboardOpen}
        contentContainerStyle={{
          flexGrow: 1,
          alignItems: 'center',
          justifyContent: 'flex-start',
          gap: 16,

        }}
        extraScrollHeight={SPARE}
        enableOnAndroid
        viewIsInsideTabBar
        keyboardShouldPersistTaps="handled"
      >
        <View className='border-2 border-[#658F8D] rounded-full mt-4'>
          <Image
            source={turtle}
            className='w-36 h-36' // 👈 set fixed width & height
          />
        </View>

        <ProfileField label='First Name' icon='person-outline' text={firstName} setText={setFirstName} />
        <ProfileField label='Last Name' icon='person-outline' text={lastName} setText={setLastName}/>
        <ProfileField label='Email' icon='mail-outline' text={email} setText={setEmail} />
        <ProfileField label='Phone Number' icon='call-outline' text={phone} setText={setPhone} />
        <ProfileField label='Address' icon='location-outline' text={address} setText={setAddress} />



      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
