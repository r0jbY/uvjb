// app/(tabs)/_layout.tsx
import { Tabs } from 'expo-router';

import { Ionicons } from '@expo/vector-icons';
import {TouchableOpacity, View } from 'react-native';
import FloatingMenu from '../Components/FloatingMenu';

import TabBar from '../Components/TabBar';
import { useUnsavedStore } from '../../utils/unsavedChanges';
import ConfirmModal from "../Components/ConfirmModal";
import { useRef, useState } from 'react';
import Toast from 'react-native-toast-message';
import { Host } from "react-native-portalize";

function HeaderRight() {
  return <FloatingMenu />;
}

export default function TabLayout() {

  const hasUnsaved = useUnsavedStore((s) => s.hasUnsaved);
  const clearUnsaved = () => useUnsavedStore.getState().setHasUnsaved(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [pendingRoute, setPendingRoute]   = useState<string | null>(null); 


  const navRef = useRef<any>(null);

  return (
    <Host>
    <View className='flex-1 bg-[#F7EFDA]'>
      
      <Tabs
        tabBar={props => <TabBar {...props} />}
        backBehavior='history'
        screenOptions={{
          tabBarHideOnKeyboard: true,
          headerStyle: {
            backgroundColor: "#F7EFDA",
   
          },

          headerTitleAlign: 'center',
          headerTintColor: '#426363',
              // Back arrow and icon color
          headerTitleStyle: {
            padding: 0,
            color: '#426363',             // Title color
            fontWeight: 'bold',           // Optional
            fontSize: 23,                 // Optional
            // Must match loaded font name
          },
        
          headerRight: () => <HeaderRight />
        }}
        screenListeners={({ navigation }) => {
          navRef.current = navigation;            // save navigator once
          return {
            tabPress: (e) => {
              if (!hasUnsaved) return;            // nothing to block
              e.preventDefault();                 // stop the switch

              // ── replicate your original “find target route” logic
              const targetKey = e.target;
              const routes = navigation.getState().routes;
              const target = routes.find(r => r.key === targetKey);

              if (target) {
                setPendingRoute(target.name);     // remember where to go
                setModalVisible(true);            // show custom modal
              }
            },
          };
        }}

      >
        <Tabs.Screen
          name="(Meetings)"
          options={{
            title: 'Meetings',
            headerShown: false,
            
          }}
          
        />
        <Tabs.Screen
          name="history"
          options={{
            title: 'History'
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{ title: 'Profile' }}
        />
      </Tabs>

      <ConfirmModal
        visible={modalVisible}
        title="Discard changes?"
        message="You have unsaved changes to you profile."
        cancelLabel="Stay"
        confirmLabel="Discard"
        onCancel={() => setModalVisible(false)}
         onConfirm={() => {
          setModalVisible(false);
          clearUnsaved();

          if (pendingRoute && navRef.current) {
            navRef.current.navigate(pendingRoute as never); // same logic, but after confirm
            setPendingRoute(null);
          }
        }}
      />
      <Toast/>
    </View >
    </Host>
  );
}
