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

  return (
    <SafeAreaView style={styles.matchContainer}>
      <View style={[styles.buttonContainer, { width: buttonContainerWidth }]}>
        <FlashButton pressFunc={handlePositive} text={"+"}></FlashButton>
        <FlashButton pressFunc={handleNeutral} text={"0"}></FlashButton>
        <FlashButton pressFunc={handleNegative} text={"-"}></FlashButton>
      </View>
    </SafeAreaView>
  );
};
export default RatingScreen;
