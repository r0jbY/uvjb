// components/ConfirmModal.tsx
import React, { useEffect, useState } from 'react';
import { Modal, TouchableOpacity, View, Text } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from 'react-native-reanimated';

type Props = {
  visible: boolean;

  /** Content */
  title: string;
  message: string;
  cancelLabel?: string;
  confirmLabel?: string;

  /** Callbacks */
  onCancel: () => void;
  onConfirm: () => void;

  /** Optional style overrides */
  confirmColor?: string; // text colour of confirm button
};

export default function ConfirmModal({
  visible,
  title,
  message,
  cancelLabel = 'Cancel',
  confirmLabel = 'Confirm',
  confirmColor = '#A04030',
  onCancel,
  onConfirm,
}: Props) {
  const [mounted, setMounted] = useState(false);
  const anim = useSharedValue(0);            // 0 = hidden, 1 = shown

  /* mount + animate */
  useEffect(() => {
    if (visible) {
      setMounted(true);
      anim.value = withTiming(1, { duration: 150 });
    } else {
      anim.value = withTiming(0, { duration: 150 }, (f) =>
        f ? runOnJS(setMounted)(false) : null
      );
    }
  }, [visible]);

  const card = useAnimatedStyle(() => ({
    opacity: anim.value,
    transform: [{ scale: 0.95 + anim.value * 0.05 }],
  }));

  if (!mounted) return null;

  return (
    <Modal transparent animationType="none" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center bg-black/35">
        <Animated.View
          style={card}
          className="gap-4 rounded-2xl bg-[#FFF7E8] px-6 py-5 shadow-lg"
        >
          <Text className="text-center text-2xl font-bold text-[#4D6F70]">
            {title}
          </Text>
          <Text className="text-center text-lg text-[#4D6F70]" style={{ flexShrink: 1 , maxWidth: '80%'}}>{message}</Text>

          <View className="mt-2 flex-row justify-between">
            <TouchableOpacity onPress={onCancel} className="active:scale-95">
              <Text className="text-lg font-semibold text-[#4D6F70]">
                {cancelLabel}
              </Text>
            </TouchableOpacity>

            <TouchableOpacity onPress={onConfirm} className="active:scale-95">
              <Text
                className="text-lg font-semibold"
                style={{ color: confirmColor }}
              >
                {confirmLabel}
              </Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
