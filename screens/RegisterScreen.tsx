import {
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    auth,
    doc,
    db,
    setDoc,
    getDoc,
    ref,
    getDownloadURL,
    storage,
    Timestamp,
  } from "../Firebase";
  import FlashButton from "../essentialComponents/FlashButton";
  import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
  import styles from "../essentialComponents/Style";
  import { useState, useEffect } from "react";
  import { useNavigation, useRoute } from "@react-navigation/native";
  import { View, TextInput, Text, Image, TouchableOpacity } from "react-native";
  import AnimateIcon from "../essentialComponents/AnimateIcon";
  import type { RootStackParamList } from "../App";
  import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
  import { AntDesign } from "@expo/vector-icons";
  
  const RegisterScreen = () => {
    const [email, setEmail] = useState("");
    const navigation =
      useNavigation<NativeStackNavigationProp<RootStackParamList>>();
    const [active, setActive] = useState("");
    const [password, setPassword] = useState("");
    const [displayName, setDName] = useState("");
    const [starterA, setA] = useState<string | null>(null);
    const [starterB, setB] = useState<string | null>(null);
    const [starterC, setC] = useState<string | null>(null);
    //fetch these objects from db later
  
    const backButton = async () => {
      navigation.navigate("Login");
    };
    useEffect(() => {
      // This function will be executed whenever the 'active' state changes
      console.log("Active changed:", active);
      // You can perform any actions you want to do when 'active' changes here
    }, [active]); // 'active' is added as a dependency here
    useEffect(() => {
      const init = async () => {
        try {
          const Aref = ref(storage, "items/starters/dogSi.webp");
          const A = await getDownloadURL(Aref);
          const Bref = ref(storage, "items/starters/rabSi.webp");
          const B = await getDownloadURL(Bref);
          const Cref = ref(storage, "items/starters/dragSi.webp");
          const C = await getDownloadURL(Cref);
          setA(A);
          setB(B);
          setC(C);
          console.log("done");
        } catch (e) {
          console.log(e);
        }
      };
      init();
    }, []);
  
    const JiltedRegister = (email: string, password:string) => {
      return new Promise((resolve, reject) => {
        createUserWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            const userID = userCredential.user.uid;
            const clientUserDocRef = doc(db, "users", userID);
            resolve([userID, clientUserDocRef]);
          })
          .catch((error) => reject(error));
      });
    };
  
    const handleRegister = async (email:string, password:string, nick:string) => {
      console.log("Being calledHR");
      //let active = "a"
      // var starter = {}
      // if (nick === ''){
      //     console.log("DEBUG ERROR NICK EMPTY")
      //     return;
      // }
      // if (active === 'A') {
      //     starter = objectA
      // }
      // else if (active === 'B')
      // {
      //     starter = objectB
      // }
      // else if (active === 'C')
      // {
      //     starter = objectC
      // }
      try {
        //fix
        const userCreds = await JiltedRegister(email, password);
        //fix
        console.log("registered with default stats");
        signInWithEmailAndPassword(auth, email, password)
          .then((userCredential) => {
            console.log("SIGNED IN!!!");
          })
          .catch((error) => {
            console.log(error.message);
          });
        navigation.navigate("SecondRegister", { name: nick });
        //navigate to secondregister
        //await setDoc(userCreds[1], {displayName: nick, email: auth.currentUser.email, jilt: true, rating: 0, matchedID: "None", inventory: [starter], new: true}, {merge: true})
      } catch (error) {
        console.log(error);
      }
    };
  
    return (
      <KeyboardAwareScrollView
        style={{
          flex: 1,
          flexDirection: "column",
          backgroundColor: "rgba(28,29,35,255)",
        }}
      >
        <View
          style={{
            flex: 0.3,
            marginTop: 20,
            padding: 5,
            justifyContent: "center",
            borderWidth: 0,
          }}
        >
          <TouchableOpacity style={{ marginTop: 20 }} onPress={backButton}>
            <AntDesign name="arrowleft" size={32} color="white" />
          </TouchableOpacity>
          <Text
            style={[
              styles.size2,
              {
                fontWeight: "700",
                textAlign: "left",
                color: "rgba(227,229,232,255)",
              },
            ]}
          >
            memory.
          </Text>
        </View>
        <View
          style={{
            flex: 1,
            borderWidth: 0,
            width: "100%",
            alignSelf: "center",
            padding: 20,
          }}
        >
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
  
          <TextInput
            placeholder="displayName"
            placeholderTextColor="white"
            value={displayName}
            onChangeText={(text) => setDName(text)}
            style={styles.input}
          />
          {/* <View style = {{marginTop: 10}}><Text style ={[ styles.size3, { fontWeight: '700', textAlign: 'left', color: 'rgba(227,229,232,255)'}]}>pick one.</Text></View>
         
          <View style = {{borderWidth: 0, flexDirection: 'row', flex:1, justifyContent: 'center', padding: 20, marginTop: 10}}>
  
  
          <AnimateIcon onPress = {()=> setActive('A')} iconComponent={<Image source={{uri:starterA}} resizeMode ='contain' style={{ backgroundColor:'rgba(28,29,35,.25)', padding:25, width: 75, height: 75, borderWidth: active === 'A' ? 6 : 2,
          borderColor: '#e3e5e8', borderRadius: 10,  }} />}></AnimateIcon>
  <AnimateIcon onPress = {()=> setActive('B')}iconComponent={<Image source={{uri:starterB}} resizeMode ='contain' style={{ backgroundColor:'rgba(28,29,35,.25)', padding:25, width: 75, height: 75, borderWidth: active === 'B' ? 6 : 2,
          borderColor: '#e3e5e8', borderRadius: 10,  }} />}></AnimateIcon>
  
  <AnimateIcon onPress = {()=> setActive('C')} iconComponent={<Image source={{uri:starterC}} resizeMode ='contain' style={{ backgroundColor:'rgba(28,29,35,.25)', padding:25, width: 75, height: 75,  borderWidth: active === 'C' ? 6 : 2, 
          borderColor: '#e3e5e8', borderRadius: 10,  }} />}></AnimateIcon>
  
          </View>
        */}
        </View>
        <View style={{ flex: 1, margin: 20, marginTop: 0 }}>
          <FlashButton
            pressFunc={() => handleRegister(email, password, displayName)}
            text={"Next"}
          ></FlashButton>
        </View>
      </KeyboardAwareScrollView>
    );
  };
  export default RegisterScreen;
  