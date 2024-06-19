import React, { ReactNode } from "react";
import {
  TouchableWithoutFeedback,
  StyleSheet,
  Modal,
  View,
  ViewStyle,
} from "react-native";

interface MyModalProps {
  children: ReactNode;
  visible: boolean;
  dismiss: () => void;
  transparent?: boolean;
  animationType?: "none" | "slide" | "fade"; // Adjust animation types as needed
  style?: ViewStyle;
}

const MyModal: React.FC<MyModalProps> = ({
  children,
  visible,
  dismiss,
  transparent = true,
  animationType = "fade",
  style,
}) => {
  return (
    <Modal
      visible={visible}
      transparent={transparent}
      onRequestClose={dismiss}
      animationType={animationType}
    >
      <TouchableWithoutFeedback onPress={dismiss}>
        <View style={styles.modalOverlay} />
      </TouchableWithoutFeedback>

      <View style={[styles.modalContent, style]}>{children}</View>
    </Modal>
  );
};
export default MyModal;

const styles = StyleSheet.create({
  modalContent: {
    // height: '70%', // Adjust as needed, e.g., '50%' or a fixed value like 200
    width: "95%", // Adjust as needed, e.g., '85%' or a fixed value like 300
    padding: 0,
    borderRadius: 10,
    backgroundColor: "rgba(38,39,47,255)",
    shadowColor: "#000",
    elevation: 4,
    marginTop: 40,
  },

  modalOverlay: {
    position: "absolute",
    top: 20,
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(0,0,0,0.0)",
  },
});
