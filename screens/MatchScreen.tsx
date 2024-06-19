import styles from "../essentialComponents/Style";
import type { RootStackParamList } from "../App";
import {
  doc,
  db,
  runTransaction,
  onSnapshot,
  updateDoc,
  increment,
  deleteDoc,
  getDoc,
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
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import JiltdChat from "../essentialComponents/JiltdChat";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import FlashButton from "../essentialComponents/FlashButton";
import { FontAwesome5 } from "@expo/vector-icons";
import AnimateIcon from "../essentialComponents/AnimateIcon";
import IconButton from "../essentialComponents/IconButton";
import { useEffect, useState } from "react";
type MatchScreenRouteProp = RouteProp<RootStackParamList, "MatchScreen">;
interface Props {
  route?: MatchScreenRouteProp;
}

const MatchScreen: React.FC<Props> = (props) => {
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();
  //Passed in
  const matched = props.route?.params.match;
  const me = props.route?.params.self;
  const theme = props.route?.params.theme;
  const path = props.route?.params.path;
  //New States
  const [clientDisplayName, setDisplayName] = useState("");
  const [matchDisplayName, setMDisplayName] = useState("");
  const [matchTheme, setMTheme] = useState("");
  const [matchPath, setMPath] = useState("");

  //get client and match name
  //prop checking through inversion
  if (!me || !matched || !theme || !path) {
    return (
      <View>
        <Text>Loading...</Text>
      </View>
    );
  }
  const clientUserDocRef = doc(db, "users", me);
  const matchUserDocRef = doc(db, "users", matched);
  const clientUserQueueDoc = doc(db, "queue", me);
  const removeDoc = async () => {
    await deleteDoc(clientUserQueueDoc);
  };
  const confirmMatch = async () => {
    await updateDoc(matchUserDocRef, { matchedID: me });
  };
  const cleanUp = async () => {
    await updateDoc(clientUserDocRef, { matchedID: "None" });
  };

  useEffect(() => {
    const fetchNames = async () => {
      try {
        const clientUserDocSnap = await getDoc(doc(db, "users", me));
        const matchUserDocSnap = await getDoc(doc(db, "users", matched));
        setDisplayName(clientUserDocSnap.data()?.displayName);
        setMDisplayName(matchUserDocSnap.data()?.displayName);
        setMTheme(matchUserDocSnap.data()?.curTheme);
        setMPath(matchUserDocSnap.data()?.curPath);
        //console.log("Displayname1", clientDisplayName, "Displayname2", matchDisplayName, "theme2", matchTheme)
      } catch (error) {
        console.error("Error fetching user data:", error);
        // Handle error (e.g., display error message)
      }
    };

    fetchNames();
  }, []);

  useEffect(() => {
    console.log("MatchScreen.tsx, ENTERED I AM", me, "WITH", matched);
    confirmMatch();
  }, []);

  // listeners should be defined inside useEffect

  // - Call those cleanup fucntions in the parts of the code where I want users to still be in the app but no longer listening to data
  // - and also call it as a return of useeffect just to ENSURE that they are unsubscribed when the component is no longer mounted
  useEffect(() => {
    const unsubscribe = onSnapshot(clientUserDocRef, (doc) => {
      if (doc.data()?.matchedID === matched) {
        console.log(
          "IF STATEMENT MatchScreen.tsx, ENTERED I AM",
          me,
          "WITH",
          matched,
        );
        // Perform your cleanup actions here // Unsubscribe from the listener
        removeDoc();
        //cleanUp();
        unsubscribe();
      }
    });

    return () => {
      unsubscribe(); // Unsubscribe when the component unmounts
    };
  }, [clientUserDocRef, matched, me]);

  // if the matched user presses the button
  //if the client presses the button

  return (
    <KeyboardAvoidingView style={[styles.matchContainer, {}]}>
      {/* <View style={[{flex: 1, justifyContent: 'center', alignItems: 'center' },styles.buttonContainer]}>
            <AnimateIcon style={{}}  
                        iconComponent={
                        <View style={{  width: 50, height:50,  marginTop: 10,
                                        padding:5,
                                        backgroundColor: theme,
                                        borderRadius: 20,
                                        justifyContent: 'center', 
                                        alignItems: 'center',}}> 
                               <MaterialCommunityIcons name="exit-run" size={24} color='white' />
                            </View>}
                          onPress={handleJilt}/>
          </View> */}
      <View style={{ flex: 10 }}>
        {matchTheme ??
        matchPath ??
        matchDisplayName ??
        matched ??
        me ??
        path ??
        clientDisplayName ??
        theme ? (
          <JiltdChat
            client_ID={me}
            match_ID={matched}
            theme={theme}
            path={path}
            clientName={clientDisplayName}
            matchName={matchDisplayName}
            matchTheme={matchTheme}
            matchPath={matchPath}
            navigation={navigation}
          />
        ) : (
          <Text>Error: Missing required props</Text>
        )}
      </View>
    </KeyboardAvoidingView>
  );
};
export default MatchScreen;
