// app/(tabs)/index.tsx
import { View, Image, SafeAreaView, Text, Pressable, TouchableOpacity, Alert } from 'react-native';
import ProfileField from '../Components/ProfileField';
import turtle from '../../assets/turtle.png'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useKeyboard from '@/hooks/useKeyboard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProfileInfo } from '@/Services/Profile';
import { useAuth } from '@/hooks/useAuth';
import { useFocusEffect, useNavigation } from 'expo-router';
import { UserProfile } from '@/types/UserProfile';
import { useUnsavedStore } from '@/utils/unsavedChanges';

export default function ProfileScreen() {

  const { userId, isAuthenticated } = useAuth();
  const { bottom } = useSafeAreaInsets();
  const { isKeyboardOpen } = useKeyboard();
  const SPARE = bottom + 64 + 124;
  
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");
  const [isActive, setIsActive] = useState(false);

  const [firstNameNew, setFirstNameNew] = useState("");
  const [lastNameNew, setLastNameNew] = useState("");
  const [emailNew, setEmailNew] = useState("");
  const [phoneNew, setPhoneNew] = useState("");
  const [addressNew, setAddressNew] = useState("");
  const [isActiveNew, setIsActiveNew] = useState(false);

  const setHasUnsaved = useUnsavedStore((s) => s.setHasUnsaved);

  const hasChanges = useMemo(() => {
    return (
      firstName !== firstNameNew ||
      lastName !== lastNameNew ||
      email !== emailNew ||
      phone !== phoneNew ||
      address !== addressNew ||
      isActive !== isActiveNew
    );
  }, [
    firstName, firstNameNew,
    lastName, lastNameNew,
    email, emailNew,
    phone, phoneNew,
    address, addressNew,
    isActive, isActiveNew
  ]);

  useEffect(() => {
  setHasUnsaved(hasChanges);
}, [hasChanges]);




  const loadUserData = async () => {
    console.log(userId);
    if (userId) {
      try {
        const response = await getProfileInfo(userId);
        const user: UserProfile = response.data;

        setFirstName(user.firstName);
        setLastName(user.lastName);
        setEmail(user.email);
        setPhone(user.phoneNumber);
        setAddress(user.address);
        setIsActive(user.active);

        setFirstNameNew(user.firstName);
        setLastNameNew(user.lastName);
        setEmailNew(user.email);
        setPhoneNew(user.phoneNumber);
        setAddressNew(user.address);
        setIsActiveNew(user.active);

      } catch (err) {
        console.log("Failed to load user data", err);
      }
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadUserData();
    }, [])
  );

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
            className='w-32 h-32' // 👈 set fixed width & height
          />
        </View>
        <Pressable
          onPress={() => setIsActiveNew(!isActiveNew)}
          className={`w-32 h-12 rounded-full justify-center items-center  transition-all active:scale-95 ${isActiveNew ? 'bg-[#A2D6AE]' : 'bg-[#E5746A]'
            }`}
        >

          <Text className="text-[#426363] font-semibold text-base">
            {isActiveNew ? 'Active' : 'Inactive'}
          </Text>
        </Pressable>
        <ProfileField label='First Name' icon='person-outline' text={firstNameNew} setText={setFirstNameNew} />
        <ProfileField label='Last Name' icon='person-outline' text={lastNameNew} setText={setLastNameNew} />
        <ProfileField label='Email' icon='mail-outline' text={emailNew} setText={setEmailNew} />
        <ProfileField label='Phone Number' icon='call-outline' text={phoneNew} setText={setPhoneNew} />
        <ProfileField label='Address' icon='location-outline' text={addressNew} setText={setAddressNew} />

        {hasChanges && (
          <TouchableOpacity

            className="bg-[#658F8D] px-6 py-3 rounded-full mt-4 active:scale-95"
          >
            <Text className="text-white font-semibold text-base">Save Changes</Text>
          </TouchableOpacity>
        )}

      </KeyboardAwareScrollView>
    </SafeAreaView>
  );
}
