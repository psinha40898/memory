import React, { ReactNode } from "react";
import styles from "../essentialComponents/Style";
import {
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
  Keyboard,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
type CustomKeyboardWrapperProps = {
  children: ReactNode;
};

const CustomKeyboardWrapper: React.FC<CustomKeyboardWrapperProps> = ({
  children,
}) => {
  if (Platform.OS === "ios") {
    return (
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <KeyboardAvoidingView
          // IOS debug styles 5/27/2024
          // style={styles.container}
          behavior="padding"
        >
          {children}
        </KeyboardAvoidingView>
      </TouchableWithoutFeedback>
    );
  } else {
    return (
      <KeyboardAwareScrollView contentContainerStyle={styles.container}>
        {children}
      </KeyboardAwareScrollView>
    );
  }
};

export default CustomKeyboardWrapper;
