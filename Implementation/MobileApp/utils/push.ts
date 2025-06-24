import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

export async function getExpoPushToken(): Promise<string | null> {
  if (!Device.isDevice) return null;   // emulators can't get tokens

  // Ask permission (prompts only if necessary)
  const { status: existing } = await Notifications.getPermissionsAsync();
  let final = existing;
  if (existing !== 'granted') {
    const { status } = await Notifications.requestPermissionsAsync();
    final = status;
  }
  if (final !== 'granted') return null;

  const projectId =
    Constants.expoConfig?.extra?.eas?.projectId ||
    Constants.easConfig?.projectId;

  return (await Notifications.getExpoPushTokenAsync({ projectId })).data;
}
