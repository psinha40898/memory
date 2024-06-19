import React, { useRef } from "react";
import { Entypo } from "@expo/vector-icons";
import { MaterialIcons } from "@expo/vector-icons";
import { TouchableOpacity, Animated, View, StyleSheet, Text, GestureResponderEvent } from 'react-native';

type IconButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  color?: string; // color is optional
};
const IconButton: React.FC<IconButtonProps> = ({ onPress, color }) => {
    const animatedValue1 = useRef(new Animated.Value(1)).current;
  const animatedValue2 = useRef(new Animated.Value(1)).current;

  const handlePressIn = (animatedValue: Animated.Value) => {
    Animated.spring(animatedValue, {
      toValue: 0.8,
      useNativeDriver: false,
    }).start();
  };
  
  const handlePressOut = (animatedValue: Animated.Value) => {
    Animated.spring(animatedValue, {
      toValue: 1,
      useNativeDriver: false,
    }).start();
  };
  const animatedStyle1 = {
    transform: [{ scale: animatedValue1 }],
  };

  const animatedStyle2 = {
    transform: [{ scale: animatedValue2 }],
  };

  return (
    <View style={{ flexDirection: "row" }}>
      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => handlePressIn(animatedValue1)}
        onPressOut={() => handlePressOut(animatedValue1)}
        activeOpacity={0.7}
      >
        <Animated.View style={[styles.iconButton, animatedStyle1]}>
          <MaterialIcons name="home-filled" size={32} color={color} />
        </Animated.View>
      </TouchableOpacity>

      <TouchableOpacity
        onPress={onPress}
        onPressIn={() => handlePressIn(animatedValue2)}
        onPressOut={() => handlePressOut(animatedValue2)}
        activeOpacity={0.7}
      >
        <Animated.View style={[styles.iconButton, animatedStyle2]}>
          <MaterialIcons name="people" size={32} color={color} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = {
  iconButton: {
    // Adjust styling as needed
  },
};

export default IconButton;
