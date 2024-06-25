import styles from "../essentialComponents/Style";
import type { RootStackParamList } from "../App";
import {
  auth,
  db,
  ref,
  storage,
  getDownloadURL,
  doc,
  getDoc,
  Timestamp,
  updateDoc,
  arrayUnion,
  setDoc,
} from "../Firebase";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import {
  ParamListBase,
  RouteProp,
  useNavigation,
  useRoute,
} from "@react-navigation/native";
import {
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  Image,
  Platform,
  Alert
} from "react-native";
import { ImageSourcePropType } from "react-native";
import FlashButton from "../essentialComponents/FlashButton";
import { TextInput } from "react-native";
import { useEffect, useState } from "react";

type LevelUpPropRoute = RouteProp<RootStackParamList, "LevelUp">;
interface Props {
  route?: LevelUpPropRoute;
}
interface Reward {
  path: string;
  theme: string;
  name: string;
  count: number;
  message: string;
}
const LevelUp: React.FC<Props> = (props) => {
  const [urls, setUrls] = useState<(string | undefined)[]>([]);
  const [active, setActive] = useState<(Reward)>({path: "Empty", theme: "Empty", name: "Empty", count: 0, message: "Empty"})
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const level = props.route?.params.levelVal;
  const objList = props.route?.params.objList;
  if (!objList) {
    navigation.navigate("Login");
    return;
  }
  useEffect(() => {
    const init = async () => {
      var listCache = [];
      for (const item of objList) {
        const storageRef = ref(storage, item.path);
        const URL = await getDownloadURL(storageRef);
        listCache.push(URL);
      }
      setUrls(listCache);
    };
    init();
  }, [urls]);

  const pickReward = async (reward: Reward) => {
    if (reward.name === "Empty"){
      Alert.alert('Reward available', 'You need to pick a reward!', [
        {
          text: 'Cancel',
          onPress: () => console.log('Cancel Pressed'),
          style: 'cancel',
        },
        {text: 'OK', onPress: () => console.log('OK Pressed')},
      ]);
      return;
    }
    if (auth.currentUser?.uid) {
      const userRef = doc(db, "users", auth.currentUser?.uid);
      const userSnap = await getDoc(userRef);

      if (userSnap.exists() && level) {
        let userData = userSnap.data();

        if (userData.rewards[level - 2] === "" || !userData.rewards[level-2]) {
          await updateDoc(userRef, {
            inventory: arrayUnion(reward),
          });
        }

        let newRewards = userData.rewards;
        newRewards[level - 2] = reward.name;

        await setDoc(userRef, { rewards: newRewards }, { merge: true });
        console.log("em");
        navigation.navigate("HomePage");
      }
    } else {
      navigation.navigate("HomePage");
      return;
    }
  };
  //ref to rateeID in users
  //snap to rateeID in users

  return (
    <SafeAreaView
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <Text
        style={[
          styles.size4,
          {
            fontWeight: "700",

            color: "rgba(227,229,232,255)",
          },
        ]}
      >
        You were commended.
      </Text>
      <Text
        style={[
          styles.size3,
          {
            fontWeight: "700",

            color: "rgba(227,229,232,255)",
          },
        ]}
      >
        Pick a reward.
      </Text>
      <View style={{ flex: 0.5, flexDirection: "row" }}>
        {objList.map((obj, index) => (
          <TouchableOpacity
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
            key={obj.name}
            onPress={()=>setActive(obj)}
          >
            {urls[index] ? (
              <Image
                source={{ uri: urls[index] }}
                style={{
                  width: 115,
                  height: 135,
                  borderWidth: active === obj ? 8 : 4,
                  margin: 6,
                  borderColor: obj.theme,
                }}
              />
            ) : null}

            <View style={{ width: "100%" }}>
            <Text
        style={[
          
          {
            marginTop: 12,
            fontWeight: active === obj ? "700" : "500",
            fontSize: active === obj ? 18 : 14,
            textAlign: "center",
            color: obj.theme,
          },
        ]}
      >
        {obj.name}
      </Text>
            </View>
          </TouchableOpacity>

          // Adjust this line based on how you want to display each object
        ))}
       
      </View>
  <View style = {{flex: 0.25, flexDirection: "row"}}>
    <View style = {{width: "50%"}}>
    <FlashButton
                pressFunc={() => {
                (pickReward(active))
                }}
                text={"Submit"}
              />
    </View>


  </View>
    </SafeAreaView>
  );
};
export default LevelUp;
