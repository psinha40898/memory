import React, { useState } from "react";
import {
  View,
  TouchableHighlight,
  Animated,
  StyleSheet,
  Text,
} from "react-native";
/**
 * FlashButton.tsx
 * React.Animation
 * An animated view wrapped inside a touchable opacity; button animates on press
 */
const FlashButton = ({ pressFunc, text }) => {
  const [animation] = useState(new Animated.Value(1));

  const handlePressIn = () => {
    Animated.spring(animation, {
      toValue: 0.8,
      useNativeDriver: false,
    }).start();
  };

  const handlePressOut = () => {
    Animated.spring(animation, {
      toValue: 1,
      friction: 3,
      tension: 40,
      useNativeDriver: false,
    }).start();
  };

  const animatedStyle = {
    transform: [{ scale: animation }],
  };
  return (
    <TouchableHighlight
      onPress={pressFunc}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      underlayColor="transparent"
    >
      <Animated.View style={[styles.button, animatedStyle]}>
        <View style={{ alignContent: "center" }}>
          <Text style={styles.buttonText}>{[text]}</Text>
        </View>
      </Animated.View>
    </TouchableHighlight>
  );
};
export default FlashButton;
const styles = StyleSheet.create({
  button: {
    width: "100%",
    height: 50,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(58,65,139,255)",
    paddingHorizontal: 0,
    paddingVertical: 0,
    borderRadius: 4,
    marginTop: 20,
  },
  buttonText: {
    color: "rgba(227,229,232,0.75)",
    fontWeight: "400",
    fontSize: 12,
    textAlign: "center",
  },
});
