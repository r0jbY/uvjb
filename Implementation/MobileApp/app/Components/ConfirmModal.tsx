import React, { useEffect } from "react";
import { Modal, TouchableOpacity, View, Text } from "react-native";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  runOnJS,
} from "react-native-reanimated";

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export default function ConfirmLogoutModal({
  visible,
  onCancel,
  onConfirm,
}: Props) {
  /** 0 = hidden, 1 = visible (drives opacity + scale) */
  const anim = useSharedValue(0);
  const [render, setRender] = React.useState(false);

  /* mount + animate in/out when visible toggles */
  useEffect(() => {
    if (visible) {
      setRender(true);
      anim.value = withTiming(1, { duration: 100 });
    } else {
      anim.value = withTiming(0, { duration: 100 }, (f) =>
        f ? runOnJS(setRender)(false) : null
      );
    }
  }, [visible]);

  const cardStyle = useAnimatedStyle(() => ({
    opacity: anim.value,
    transform: [{ scale: anim.value * 0.05 + 0.95 }], // 0.95→1
  }));

  if (!render) return null;

  return (
    <Modal visible transparent animationType="none" onRequestClose={onCancel}>
      <View className="flex-1 items-center justify-center  bg-black/35">
        <Animated.View
          style={cardStyle}
          className="rounded-2xl bg-[#FFF7E8] px-8 py-6 shadow-lg gap-10"
        >
          <Text className="text-2xl font-bold text-[#4D6F70] text-center">
            Log out
          </Text>
          <Text className="text-lg text-[#4D6F70] text-center">
            Are you sure you want to log out?
          </Text>

          <View className="flex-row justify-between">
            <TouchableOpacity
              onPress={onCancel}
              className="py-2 rounded-lg active:scale-95 transition-all duration-200"
            >
              <Text className="text-[#4D6F70] text-lg font-semibold">Cancel</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={onConfirm}
              className="py-2 rounded-lg active:scale-95 transition-all duration-200"
            >
              <Text className="text-[#A04030] text-lg font-semibold">Log out</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      </View>
    </Modal>
  );
}
