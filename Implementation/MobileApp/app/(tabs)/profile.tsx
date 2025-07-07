// app/(tabs)/index.tsx
import { View, Image, SafeAreaView, Text, Pressable, TouchableOpacity, ActivityIndicator } from 'react-native';
import ProfileField from '../Components/ProfileField';
import turtle from '../../assets/turtle.png'
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import useKeyboard from '@/hooks/useKeyboard';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { getProfileInfo, updateProfileInfo } from '@/Services/Profile';
import { useAuth } from '@/hooks/useAuth';
import { useFocusEffect, useNavigation } from 'expo-router';
import { UserProfile } from '@/types/UserProfile';
import { useUnsavedStore } from '@/utils/unsavedChanges';
import { validateProfile } from '@/utils/profileValidation';
import Toast from 'react-native-toast-message'; // or your favourite lib
import ConfirmModal from '../Components/ConfirmModal';
import { BackHandler } from 'react-native';
import { useLanguage } from '@/context/LanguageProvider';


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
  const [role, setRole] = useState('');

  const [firstNameNew, setFirstNameNew] = useState("");
  const [lastNameNew, setLastNameNew] = useState("");
  const [emailNew, setEmailNew] = useState("");
  const [phoneNew, setPhoneNew] = useState("");
  const [addressNew, setAddressNew] = useState("");
  const [isActiveNew, setIsActiveNew] = useState(false);

  const setHasUnsaved = useUnsavedStore((s) => s.setHasUnsaved);
  const hasUnsaved = useUnsavedStore(s => s.hasUnsaved);
  const clearUnsaved = () => useUnsavedStore.getState().setHasUnsaved(false);
  const navigation = useNavigation();

  const [loading, setLoading] = useState(true);

  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [pendingAction, setPendingAction] = useState<any>(null);
  const { t } = useLanguage();

  useFocusEffect(
    useCallback(() => {
      const onBackPress = () => {
        if (!hasUnsaved) return false;               // nothing to block

        // Save what *would* happen by default
        setPendingAction(() => {
          if (navigation.canGoBack()) {
            return () => navigation.goBack();
          }
          return () => BackHandler.exitApp();        // tab root → exit app
        });

        setShowLeaveModal(true);                     // show confirm dialog
        return true;                                // we handled the key
      };

      const sub = BackHandler.addEventListener('hardwareBackPress', onBackPress);
      return () => sub.remove();
    }, [hasUnsaved, navigation])
  );




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
        setRole(user.role);

        setFirstNameNew(user.firstName);
        setLastNameNew(user.lastName);
        setEmailNew(user.email);
        setPhoneNew(user.phoneNumber);
        setAddressNew(user.address);
        setIsActiveNew(user.active);

        setLoading(false);
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

  const handleSave = async () => {
    const form = {
      firstName: firstNameNew,
      lastName: lastNameNew,
      email: emailNew,
      phoneNumber: phoneNew,
      address: addressNew,
      active: isActiveNew,
      role,                     // unchanged by UI but backend requires it
    };

    const result = validateProfile(form);
    if (!result.valid) {
      Toast.show({ type: 'error', text1: result.message });
      return;
    }

    try {
      await updateProfileInfo(userId!, form);  // userId isLoading  = useState(true);defined here
      /* ─── sync originals so hasChanges becomes false ─── */
      setFirstName(form.firstName);
      setLastName(form.lastName);
      setEmail(form.email);
      setPhone(form.phoneNumber);
      setAddress(form.address);
      setIsActive(isActiveNew);

      setHasUnsaved(false);                   // clear global flag
      Toast.show({ type: 'success', text1: t('profile.updateSuccess') });
    } catch (err) {
      Toast.show({ type: 'error', text1: t('profile.updateFail') });
      console.error(err);
    }
  };

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
        {loading ? (
          <View className="flex-1 items-center justify-center bg-[#F7EFDA]">
            {/* any spinner you like */}
            <ActivityIndicator size={50} color="#658F8D" />
          </View>

        ) : (<><View className='border-2 border-[#658F8D] rounded-full mt-4'>
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
              {isActiveNew ? t('profile.active') : t('profile.inactive')}
            </Text>
          </Pressable>
          <ProfileField label={t('profile.firstName')} icon='person-outline' text={firstNameNew} setText={setFirstNameNew} />
          <ProfileField label={t('profile.lastName')} icon='person-outline' text={lastNameNew} setText={setLastNameNew} />
          <ProfileField label={t('profile.email')} icon='mail-outline' text={emailNew} setText={setEmailNew} />
          <ProfileField label={t('profile.phone')} icon='call-outline' text={phoneNew} setText={setPhoneNew} />
          <ProfileField label={t('profile.address')} icon='location-outline' text={addressNew} setText={setAddressNew} />
          {hasChanges && (
            <TouchableOpacity
              onPress={handleSave}
              className="bg-[#658F8D] px-6 py-3 rounded-full mt-4 active:scale-95"
            >
              <Text className="text-white font-semibold text-base">{t('profile.save')}</Text>
            </TouchableOpacity>
          )}
        </>)}
      </KeyboardAwareScrollView>

      <ConfirmModal
        visible={showLeaveModal}
        title={t('profile.unsavedDialogTitle')}
        message={t('profile.unsavedDialogBody')}
        cancelLabel={t('profile.unsavedStay')}
        confirmLabel={t('profile.unsavedDiscard')}
        onCancel={() => setShowLeaveModal(false)}
        onConfirm={() => {
          clearUnsaved();               // reset global flag
          setShowLeaveModal(false);
          if (pendingAction) navigation.dispatch(pendingAction); // continue back
        }}
      />
    </SafeAreaView>
  );
}
