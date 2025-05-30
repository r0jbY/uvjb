// app/(tabs)/index.tsx
import { Pressable, Text, View, Image, ScrollView, TextInput } from 'react-native';
import ProfileField from '../Components/ProfileField';
import turtle from '../../assets/turtle.png'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useHeaderHeight } from '@react-navigation/elements';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useKeyboard from '@/hooks/useKeyboard';
import { useRef } from 'react';

export default function ProfileScreen() {

  const tabBarHeight = 64;
  const { bottom } = useSafeAreaInsets();
  const headerHeight = useHeaderHeight();
  const { isKeyboardOpen } = useKeyboard();



  return (
    <ScrollView
      className="bg-[#F7EFDA] flex-1 "
      contentContainerStyle={{
        flexGrow: 1,                  // layout for children
        alignItems: 'center',
        gap: 16,
        paddingBottom: tabBarHeight + bottom + 12,
      }}

      keyboardShouldPersistTaps="handled"
    >
      <View className='border-2 border-[#658F8D] rounded-full mt-4'>
        <Image
          source={turtle}
          className='w-36 h-36' // 👈 set fixed width & height
        />
      </View>
      <View className='h-full w-full items-center gap-4'>
        <ProfileField label='First Name' icon='person-outline' text='Robert' />
        <ProfileField label='Last Name' icon='person-outline' text='Balint' />
        <ProfileField label='Email' icon='mail-outline' text='r.balint@gmail.com' />
        <ProfileField label='Phone Number' icon='call-outline' text='+31 234 563 345' />
        <ProfileField label='Address' icon='location-outline' text='Spoorstraat 25, Venlo' />

      </View>
    </ScrollView>
  );
}
