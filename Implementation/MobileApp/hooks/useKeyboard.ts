// useKeyboard.ts
import { useEffect, useState } from 'react';
import { Keyboard, KeyboardEvent, Platform } from 'react-native';

type KeyboardState = {
  isKeyboardOpen: boolean;
  height: number;          // 0 when closed
};

/**
 * React hook that tells you whether the on-screen keyboard is open.
 * @returns {KeyboardState} { isOpen, height }
 */
export default function useKeyboard(): KeyboardState {
  const [keyboardState, setKeyboardState] = useState<KeyboardState>({
    isKeyboardOpen: false,
    height: 0,
  });

  useEffect(() => {
    // iOS fires “will” events slightly earlier than “did” (nicer for animations)
    const showEvent = Platform.OS === 'ios' ? 'keyboardWillShow' : 'keyboardDidShow';
    const hideEvent = Platform.OS === 'ios' ? 'keyboardWillHide' : 'keyboardDidHide';

    const handleShow = (e: KeyboardEvent) =>
      setKeyboardState({ isKeyboardOpen: true, height: e.endCoordinates.height });

    const handleHide = () => setKeyboardState({ isKeyboardOpen: false, height: 0 });

    const showSub = Keyboard.addListener(showEvent, handleShow);
    const hideSub = Keyboard.addListener(hideEvent, handleHide);

    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  return keyboardState;
}
