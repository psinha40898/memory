import React, { useRef } from "react";
import { MaterialIcons } from "@expo/vector-icons";
import {
  TouchableOpacity,
  Animated,
  View,
  StyleSheet,
  GestureResponderEvent,
} from "react-native";
import { auth, signOut } from "../Firebase";
import { SimpleLineIcons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import type { RootStackParamList } from "../App";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

type IconButtonProps = {
  onPress: (event: GestureResponderEvent) => void;
  color?: string; // color is optional
  active: string;
  theme: string;
};

const IconButton: React.FC<IconButtonProps> = ({ color, active, theme }) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  const animatedValue1 = useRef(new Animated.Value(1)).current;
  const animatedValue2 = useRef(new Animated.Value(1)).current;
  const animatedValue3 = useRef(new Animated.Value(1)).current;
  const animatedValue4 = useRef(new Animated.Value(1)).current;

  const handlePressIn = (animatedValue: Animated.Value) => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(animatedValue, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(animatedValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
      ]),
    ).start();
  };

  const handlePressOut = (animatedValue: Animated.Value) => {
    Animated.timing(animatedValue, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).stop();
  };

  const handSignout = () => {
    console.log("Ax");
    signOut(auth)
      .then(() => {
        console.log("A");
        navigation.navigate("Login");
        // Sign-out successful.
      })
      .catch((error) => {
        console.log("A");
      });
  };

  const getColor = (name: string) =>
    active === name ? theme : color || "white";

  return (
    <View style={{ flexDirection: "row", marginLeft: 8 }}>
      <TouchableOpacity
        onPressIn={() => handlePressIn(animatedValue1)}
        onPressOut={() => handlePressOut(animatedValue1)}
        activeOpacity={0.7}
        onPress={handSignout}
      >
        <Animated.View
          style={{ transform: [{ scale: animatedValue1 }], padding: 4 }}
        >
          <SimpleLineIcons name="logout" size={26} color={theme} />
        </Animated.View>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  iconButton: {
    // Adjust styling as needed
  },
});

export default IconButton;
