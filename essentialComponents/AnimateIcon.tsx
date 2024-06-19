import React, { useRef } from "react";
import { TouchableOpacity, Animated, View } from "react-native";

const AnimateIcon = ({
  onPress,
  iconComponent,
  style,
}: {
  onPress: () => void;
  iconComponent: React.ReactNode;
  style?: any; // Make style prop optional
}) => {
  const animatedValue = useRef(new Animated.Value(1)).current;

  const handlePressIn = () => {
    Animated.spring(animatedValue, {
      toValue: 0.8,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animatedValue, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: animatedValue }],
  };

  return (
    <TouchableOpacity
      style={[style]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.7}
    >
      <Animated.View style={[animatedStyle]}>{iconComponent}</Animated.View>
    </TouchableOpacity>
  );
};

export default AnimateIcon;
