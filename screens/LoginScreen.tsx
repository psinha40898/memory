import React, { useState } from "react";
import styles from "../essentialComponents/Style";
import FlashButton from "../essentialComponents/FlashButton";
import { useNavigation } from "@react-navigation/native";
import { Animated, TextInput, Text, View, Platform, Image } from "react-native";
import {
  auth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from "../Firebase";
import CustomKeyboardWrapper from "../conditionalComponents/CustomKeyboardWrapper"; // Use relative path to the CustomKeyboardWrapper.js file
import type { RootStackParamList } from "../App";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";

const LoginScreen = () => {
  /*
    Data required to process registration and login to application
    string: email
    string: password
    prop: navigation
    */
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const inputContainerWidth = Platform.OS === "web" ? "25%" : "60%";
  const buttonContainerWidth = Platform.OS === "web" ? "15%" : "40%";
  //factor this out
  const [animation] = useState(new Animated.Value(1));

  // Legacy code
  // useEffect(() => {
  //     const unsubscribe = auth.onAuthStateChanged(user => {
  //         if (user) {
  //             navigation.navigate("Home")
  //         }
  //     })
  //     return unsubscribe
  // }, [])

  // Eventually will have to rewrite login logic such that create profile presents a screen for user to enter details and upload images

  /*
    Registers a user to the database    
    @param None
    @returns None
    Attaches to an eventhandler and intializes a promise which:
    creates a user in the database if promise is fulfilled
    displays an error if promise is rejected
     */
  // todo: Make it redirect to a register screen
  const handleSignUp = () => {
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.email, "is registered");
      })
      .catch((error) => alert(error.message));
  };
  /*
    Logs an existing user into the application
    @param None
    @returns None
    Attaches to an eventhandler and initializes a promise which:
    navigates to the main user interface if promise is fulfilled
    displays an error if promise is rejected
     
    */
  const handleLogin = (e: any) => {
    e.preventDefault();
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        console.log(userCredential.user.email, "is logged in");
        if (userCredential) {
          navigation.navigate("HomePage");
        }
      })
      .catch((error) => alert(error.message));
  };

  return (
    //May have to wrap everything in scrollview or write android specific code

    <CustomKeyboardWrapper>
      <View style={[{ width: inputContainerWidth, flex: 1, marginTop: 24 }]}>
        <View style={[{ justifyContent: "center", flex: 1 }]}>
          <Text
            style={[
              styles.size3,
              {
                fontWeight: "700",
                textAlign: "left",
                color: "rgba(227,229,232,255)",
              },
            ]}
          >
            memory.
          </Text>

          <TextInput
            placeholder="email"
            placeholderTextColor="white"
            value={email}
            onChangeText={(text) => setEmail(text)}
            style={styles.input}
          />
          <TextInput
            placeholder="password"
            placeholderTextColor="white"
            value={password}
            onChangeText={(text) => setPassword(text)}
            style={styles.input}
            secureTextEntry
          />

          <FlashButton pressFunc={handleLogin} text={"LOGIN"}></FlashButton>

          <FlashButton
            pressFunc={() => navigation.navigate("RegisterScreen")}
            text={"REGISTER"}
          ></FlashButton>
        </View>
      </View>
    </CustomKeyboardWrapper>
  );
};

export default LoginScreen;
