import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
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
import { AntDesign } from "@expo/vector-icons";
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import { View, TextInput, Text, Image, TouchableOpacity } from "react-native";
import AnimateIcon from "../essentialComponents/AnimateIcon";
import type { RootStackParamList } from "../App";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
type MatchScreenRouteProp = RouteProp<RootStackParamList, "SecondRegister">;
interface Props {
  route?: MatchScreenRouteProp;
}
interface Item {
  name: string,
  path: string,
  message: string,
  count: number,
  theme: string
}

const SecondRegister: React.FC<Props> = (props) => {
  const dName = props.route?.params.name;
  const clientUserID = auth.currentUser?.uid;
  if (!clientUserID) {
    return (
      <View>
        <Text>Error...</Text>
      </View>
    );
  }
  const clientUserDocRefMain = doc(db, "users", clientUserID);
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const [active, setActive] = useState("");
  const [starterA, setA] = useState<string | null>(null);
  const [starterB, setB] = useState<string | null>(null);
  const [starterC, setC] = useState<string | null>(null);
  //fetch these objects from db later
  var objectA = {
    name: "lost blue pup",
    count: 1,
    message: "He's following you.",
    path: "items/starters/blueDog.webp",
    theme: "rgba(121, 119, 235, 0.8)",
  };
  var objectB = {
    name: "invincible purple rabbit",
    count: 1,
    message: "She's very confident.",
    path: "items/starters/purpleRabbit.webp",
    theme: "rgba(206, 99, 205, 0.8)",
  };
  var objectC = {
    name: "great dragon",
    count: 1,
    message: "He isn't afraid of you.",
    path: "items/starters/yellowDragon.webp",
    theme: "rgba(196,104,23,255)",
  };
  const backButton = async () => {
    navigation.navigate("RegisterScreen");
  };
  const finishButton = async () => {
    var starter: Item = {  name: "",
      path: "",
      message: "",
      count: 0,
      theme: ""}
    if (dName === "") {
      console.log("DEBUG ERROR NICK EMPTY");
      return;
    }
    if (active === "A") {
      starter = objectA;
    } else if (active === "B") {
      starter = objectB;
    } else if (active === "C") {
      starter = objectC;
    }
    try {
      console.log("registered with default stats");
      await setDoc(
        clientUserDocRefMain,
        {
          displayName: dName,
          email: auth.currentUser?.email,
          saves:[],
          jilt: true,
          rating: 0,
          matchedID: "None",
          inventory: [starter],
          new: true,
          official: true,
        },
        { merge: true },
      );
      console.log("Success");
      navigation.navigate("HomePage");
    } catch (error) {
      console.log(error);
    }
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
          padding: 5,
          justifyContent: "center",
          borderWidth: 0,
          marginTop: 20,
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
        <View style={{ marginTop: 10 }}>
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
            pick one.
          </Text>
        </View>

        <View
          style={{
            borderWidth: 0,
            flexDirection: "row",
            flex: 1,
            justifyContent: "center",
            padding: 20,
            marginTop: 10,
          }}
        >
          <AnimateIcon
            onPress={() => setActive("A")}
            iconComponent={
              starterA && (
                <Image
                  source={{ uri: starterA }}
                  resizeMode="contain"
                  style={{
                    backgroundColor: "rgba(28,29,35,.25)",
                    padding: 25,
                    width: 75,
                    height: 75,
                    borderWidth: active === "A" ? 6 : 2,
                    borderColor: "#e3e5e8",
                    borderRadius: 10,
                  }}
                />
              )
            }
          ></AnimateIcon>
          <AnimateIcon
            onPress={() => setActive("B")}
            iconComponent={
              starterB && (
                <Image
                  source={{ uri: starterB }}
                  resizeMode="contain"
                  style={{
                    backgroundColor: "rgba(28,29,35,.25)",
                    padding: 25,
                    width: 75,
                    height: 75,
                    borderWidth: active === "B" ? 6 : 2,
                    borderColor: "#e3e5e8",
                    borderRadius: 10,
                  }}
                />
              )
            }
          ></AnimateIcon>

          <AnimateIcon
            onPress={() => setActive("C")}
            iconComponent={
              starterC && (
                <Image
                  source={{ uri: starterC }}
                  resizeMode="contain"
                  style={{
                    backgroundColor: "rgba(28,29,35,.25)",
                    padding: 25,
                    width: 75,
                    height: 75,
                    borderWidth: active === "A" ? 6 : 2,
                    borderColor: "#e3e5e8",
                    borderRadius: 10,
                  }}
                />
              )
            }
          ></AnimateIcon>
        </View>
      </View>
      <View style={{ flex: 1, borderWidth: 0, margin: 20 }}>
        <FlashButton pressFunc={finishButton} text={"Finish"}></FlashButton>
      </View>
    </KeyboardAwareScrollView>
  );
};
export default SecondRegister;
