import styles from "../essentialComponents/Style";
import type { RootStackParamList } from "../App";
import { doc, db, runTransaction, onSnapshot } from "../Firebase";
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
  Platform,
} from "react-native";
import FlashButton from "../essentialComponents/FlashButton";
import { TextInput } from "react-native";

type RatingScreenRouteProp = RouteProp<RootStackParamList, "RatingScreen">;
interface Props {
  route?: RatingScreenRouteProp;
}

const RatingScreen: React.FC<Props> = (props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  const rateeID = props.route?.params.ratee;

  const buttonContainerWidth = Platform.OS === "web" ? "15%" : "40%";
  //ref to rateeID in users
  //snap to rateeID in users

  const updateRep = async (val: number) => {
    if (rateeID) {
      const matchUserDocRef = doc(db, "users", rateeID);

      try {
        await runTransaction(db, async (transaction) => {
          const matchDoc = await transaction.get(matchUserDocRef);
          if (!matchDoc.exists()) {
            throw "Document does not exist!";
          }
          const newRating = matchDoc.data().rating + val;
          transaction.update(matchUserDocRef, { rating: newRating });
          navigation.navigate("HomePage");
        });
      } catch (e) {
        console.log("Failed!", e);
      }
    }
  };
  const handlePositive = async () => {
    updateRep(1);
  };
  const handleNeutral = async () => {
    updateRep(0.25);
  };
  const handleNegative = async () => {
    updateRep(-1);
  };
  const handleSkip = async () => {
    updateRep(0);
  };
  return (
    <SafeAreaView
      style={[
        styles.container,
        { justifyContent: "center", alignItems: "center" },
      ]}
    >
      <View
        style={[
          styles.buttonContainer,
          { flex: 1, flexDirection: "column", width: "80%" },
        ]}
      >
        <Text
          style={[
            { fontSize: 14 },
            {
              fontWeight: "700",
              textAlign: "center",
              color: "rgba(227,229,232,255)",
            },
          ]}
        >
          A user ended the session.
        </Text>
        <Text
          style={[
            { fontSize: 22 },
            {
              fontWeight: "700",
              textAlign: "left",
              color: "rgba(227,229,232,255)",
            },
          ]}
        >
          How would you describe the conversation you just had?
        </Text>
        <View style={{ width: "100%" }}>
          <FlashButton pressFunc={handlePositive} text={"POSITIVE"} />
        </View>
        <View style={{ width: "100%" }}>
          <FlashButton pressFunc={handleNeutral} text={"NEUTRAL"}></FlashButton>
        </View>
        <View style={{ width: "100%" }}>
          <FlashButton
            pressFunc={handleNegative}
            text={"NEGATIVE"}
          ></FlashButton>
        </View>
        <View style={{ width: "50%" }}>
          <FlashButton pressFunc={handleSkip} text={"SKIP"}></FlashButton>
        </View>

        <Text
          style={[
            { fontSize: 14 },
            {
              fontWeight: "700",
              textAlign: "left",
              margin: 12,
              color: "rgba(227,229,232,255)",
            },
          ]}
        >
          thank you
        </Text>
      </View>
    </SafeAreaView>
  );
};
export default RatingScreen;
