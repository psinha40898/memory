import {
  View,
  FlatList,
  Text,
  TextInput,
  KeyboardAvoidingView,
  Image,
  TouchableWithoutFeedback,
  Modal,
  Button,
  Platform,
  Pressable,
  TouchableHighlight,
} from "react-native";
import {
  arrayUnion,
  arrayRemove,
  doc,
  collection,
  db,
  getDoc,
  query,
  onSnapshot,
  runTransaction,
  orderBy,
  addDoc,
  Timestamp,
  setDoc,
  getDocs,
  limit,
  ref,
  getDownloadURL,
  storage,
  updateDoc,
} from "../Firebase";
import { useState, useEffect, useRef } from "react";
import type { RootStackParamList } from "../App";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import FlashButton from "./FlashButton";
import MyModal from "./MyModal";
import { Feather } from "@expo/vector-icons";
import { Ionicons } from "@expo/vector-icons";
import styles from "./Style";
import AnimateIcon from "./AnimateIcon";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import IconButton from "./IconButton";
/**
 * JiltdChat.tsx
 * An inverted flatlist that renders an array of message objects
 * message.senderID decides if the message is on the left or right, and its color
 * message.text contains the message
 * message.timestamp contains a timestamp object
 *
 */

interface JiltdChatProps {
  client_ID: string;
  match_ID: string;
  theme: string;
  path: string;
  clientName: string;
  matchName: string;
  matchTheme: string;
  matchPath: string;
  navigation: NativeStackNavigationProp<RootStackParamList>;
}

interface Item {
  key: Timestamp;
  link: boolean;
  millisecond: number;
  realTime: Timestamp;
  senderId: string;
  text: string;
  timestamp: Timestamp;
}

const JiltdChat: React.FC<JiltdChatProps> = ({
  client_ID,
  match_ID,
  theme,
  path,
  clientName,
  matchName,
  matchTheme,
  matchPath,
  navigation,
}: JiltdChatProps) => {
  {
    /** add a boolean called link to each document message 
            If the newest message matches the senderID of the end of the array, then add it with a linking style
     *      If the newest message does not match the most recent senderID, add it with the new header style
            TODO: accept matchee avatar path
            If item.link is true render Name and Avatar
            then render body
            else render body
            A header will contain, the users nickname in proper color, and the user's avatar
            The path and RGBA string will be passed into the matchmaking functions, where it will be added to the user Doc
            The matchmaking function will enter the matchscreen which will call this current component
            This component will read the path and rgba from the DB and store them for both client and matchee
  
            First message will always be system
            First user message will not be same so it will be header style
            And so on (..
     *      
     */
  }
  if (
    !client_ID ||
    !match_ID ||
    !theme ||
    !path ||
    !clientName ||
    !matchName ||
    !matchTheme ||
    !matchPath
  ) {
    return <Text>Loading...</Text>;
  }
  //console.log("USER ID:", client_ID, "MATCHee ID:", match_ID, "THEME:", theme, "UNAME:", clientName, "MNAME:", matchName, "MTHEME:", matchTheme, "Path:", path, "mp:", matchPath)

  const [isVisible, setIsVisible] = useState(false);
  const [note, setNote] = useState("");
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const clientUserDocRef = doc(db, "users", client_ID);
  const matchUserDocRef = doc(db, "users", match_ID);

  const addSave = async (item: Item) => {
    const clientUserDocSnap = await getDoc(clientUserDocRef);
    var tempSaves = clientUserDocSnap.data()?.saves;
    const newItem = {
      author: matchName,
      body: item.text,
      date: item.timestamp,
      note: note, // Additional field example
    };
    tempSaves.push(newItem);
    console.log(tempSaves);
    //get array
    //push to array
    //set array
    //author body date note
    try {
      await updateDoc(clientUserDocRef, {
        saves: arrayUnion(newItem),
      });
      setNote("");
      hideModal();
    } catch (e) {
      hideModal();
      setNote("");
      console.log("error");
    }
    // TRY THIS  await updateDoc(clientUserDocRef, {saves: arrayUnion(newItem)})
  };
  const cleanUp = async () => {
    await updateDoc(clientUserDocRef, { matchedID: "None" });
  };

  const leaveChat = onSnapshot(clientUserDocRef, (doc) => {
    //console.log(doc.data())
    if (doc.data()?.jilt === true) {
      cleanUp();
      leaveChat();
      navigation.navigate("RatingScreen", { ratee: match_ID });
    }
  });
  //if the client presses the button
  const handleJilt = async () => {
    try {
      await runTransaction(db, async (transaction) => {
        //const myDoc = await transaction.get(clientUserDocRef);
        //const theirDoc = await transaction.get(matchUserDocRef)
        transaction.update(matchUserDocRef, { jilt: true });
        transaction.update(clientUserDocRef, { jilt: true });
        cleanUp();
        leaveChat();
      });
    } catch (e) {
      console.log("Failed!", e);
    }
    //navigate to the rating page
    navigation.navigate("RatingScreen", { ratee: match_ID });
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const handleOverlayPress = () => {
    setIsVisible(false);
    console.log("F");
  };

  //var updatedMessages = []
  var updatedMessages = [];
  const [sampleSend, setSample] = useState("");
  const textInputRef = useRef<TextInput>(null);
  const smallerUserId = client_ID < match_ID ? client_ID : match_ID;
  const largerUserId = client_ID < match_ID ? match_ID : client_ID;
  const chatroomDocRef = doc(
    db,
    "chatrooms",
    `${smallerUserId}_${largerUserId}`,
  );
  const messagesRef = collection(chatroomDocRef, "messages");
  const [surl1, sets1] = useState<string | undefined>(undefined);
  const [surl2, sets2] = useState<string | undefined>(undefined);
  const [modalBoolean, setModal] = useState(false);

  const [messages, setMessages] = useState<Item[]>([]);
  useEffect(() => {
    const loadImages = async () => {
      try {
        const storageRef = ref(storage, path);
        const URL = await getDownloadURL(storageRef);
        const storageRef2 = ref(storage, matchPath);
        const URL2 = await getDownloadURL(storageRef2);
        console.log(URL, URL2);
        sets1(URL);
        sets2(URL2);
      } catch (error) {
        console.error("Error loading images:", error);
      }
    };

    loadImages();
  }, [matchPath, path]);

  const testInput = async () => {
    const tsObject = Timestamp.now();
    const q = query(messagesRef, orderBy("millisecond", "desc"), limit(1));
    const arraySnap = await getDoc(chatroomDocRef);
    const newMsgs = arraySnap.data()?.messages;
    const querySnapshot = await getDocs(q);
    var fresh = true;
    if (querySnapshot.size > 0) {
      // Get the data of the most recent document
      const mostRecentDocData = querySnapshot.docs[0].data().senderId;
      if (mostRecentDocData === client_ID) {
        fresh = false;
      }
    }
    if (sampleSend !== "") {
      //

      textInputRef.current?.clear();

      await addDoc(messagesRef, {
        text: sampleSend,
        timestamp: tsObject,
        senderId: client_ID,
        millisecond: tsObject.toMillis(),
        realTime: tsObject.toDate(),
        link: fresh,
        key: tsObject.toString() + client_ID,
      });
      await updateDoc(chatroomDocRef, {
        messages: arrayUnion({
          text: sampleSend,
          timestamp: tsObject,
          senderId: client_ID,
          millisecond: tsObject.toMillis(),
          realTime: tsObject.toDate(),
          link: fresh,
          key: tsObject.toString() + client_ID,
        }),
      });
      setSample("");
    }
  };
  const clientTest = async () => {
    const tsObject = Timestamp.now();

    await addDoc(messagesRef, {
      text: sampleSend,
      timestamp: tsObject,
      senderId: match_ID,
      millisecond: tsObject.toMillis(),
      realTime: tsObject.toDate(),
    });
  };

  useEffect(() => {
    async function initializeChat() {
      //get URL1 and URL2
      //if header <image url1> or <image url2>
      try {
        const chatroomDocSnapshot = await getDoc(chatroomDocRef);
        if (!chatroomDocSnapshot.exists()) {
        }

        if (!chatroomDocSnapshot.data()?.messages) {
          await setDoc(chatroomDocRef, {
            messages: [],
          });
        }
        const unsubscribe = onSnapshot(chatroomDocRef, (doc) => {
          const newMessages = doc.data()?.messages;
          console.log(newMessages);
          setMessages(newMessages.reverse() as Item[]);
        });
        // const q = query(messagesRef, orderBy("millisecond", "desc"));
        // const unsubscribe = onSnapshot(q, (snapshot) => {
        //   // Create a copy of the current messages
        //   const newMessages = snapshot.docs.map((doc) => doc.data());
        //   setMessages(newMessages as Item[]);
        //   console.log("Listen")
        // });

        return () => {
          if (unsubscribe) {
            //if the component unmounts
            console.log("Returning unsubscribe");
            unsubscribe();
          }
        };
      } catch (error) {
        console.error("Error initializing chat:", error);
      }
    }

    initializeChat();
    console.log("Test");
  }, []);

  const handleClick = (item: Item) => {
    setSelectedItem(item);
    setModal(true);
  };

  const handleHoverIn = () => {
    console.log("Text Hovered!");
  };

  const handleHoverOut = () => {
    console.log("Hover Ended");
  };

  const hideModal = () => {
    setModal(false);
  };

  return (
    <KeyboardAvoidingView
      style={{ flex: 1, backgroundColor: "rgba(28,29,34,255)" }}
      behavior="padding"
    >
      <View style={{ flex: 1, flexDirection: "column" }}>
        <View style={[{ flex: 2, backgroundColor: "rgba(28,29,34,255)" }]}>
          <View
            style={{
              paddingTop: 15,
              flex: 1,
              flexDirection: "row",
              borderBottomWidth: 2,
              borderColor: "rgba(199,200,205,0.75)",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            {/* Top Row with Exit Button*/}
            <View
              style={{
                flex: 1,
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <AnimateIcon
                iconComponent={
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Feather name="stop-circle" size={64} color={theme} />
                  </View>
                }
                onPress={handleJilt}
              />
            </View>
          </View>

          {/* Middle Section with Chat */}
        </View>
        <View style={[{ flex: 10 }]}>
          <MyModal
            style={{
              flex: 1,
              position: "absolute",
              top: "33.3333333333%",
              alignSelf: "center",
              justifyContent: "center",
              alignItems: "center",
              padding: 24,
            }}
            children={
              <View
                style={{
                  flex: 1,
                }}
              >
                {selectedItem ? (
                  <View>
                    <View
                      style={{
                        width: "100%",
                        padding: 6,
                        flex: 1,
                      }}
                    >
                      <Text
                        style={[
                          { fontSize: 32 },
                          {
                            fontWeight: "700",
                            textAlign: "center",
                            color: "rgba(227,229,232,255)",
                          },
                        ]}
                      >
                        {`"${selectedItem.text}"`}
                      </Text>
                      <Text
                        style={[
                          { fontSize: 12 },
                          {
                            fontWeight: "700",
                            textAlign: "left",
                            color: "rgba(227,229,232,255)",
                          },
                        ]}
                      >
                        {"from: " + matchName + ""}
                      </Text>
                      <Text
                        style={[
                          { fontSize: 12 },
                          {
                            fontWeight: "700",
                            textAlign: "left",
                            color: "rgba(227,229,232,255)",
                          },
                        ]}
                      >
                        {"date: " + selectedItem.timestamp.toDate() + ""}{" "}
                      </Text>

                      <TextInput
            placeholder="Sample Note"
            placeholderTextColor="white"
            value={note}
            defaultValue="Sample Note"
            onChangeText={(text) => setNote(text)}
            style={styles.input}
          />
                      <FlashButton
                        pressFunc={() => addSave(selectedItem)}
                        text={"Save Message"}
                      ></FlashButton>

                    </View>
                  </View>
                ) : null}
              </View>
            }
            visible={modalBoolean}
            dismiss={hideModal}
          ></MyModal>
          <FlatList
            data={messages}
            inverted={true}
            keyExtractor={(item: any) => item.key}
            renderItem={({ item }) => (
              <View style={{ marginLeft: 10 }}>
                <View style={{}}>
                  {/* If unlinked and client's msg, print a new header with client image, and print the body below that*/}
                  {item.link && item.senderId === client_ID ? (
                    <View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          source={{ uri: surl1 }}
                          resizeMode="contain"
                          style={{
                            marginRight: 10,
                            backgroundColor: "rgba(28,29,35,1)",
                            width: 40,
                            height: 40,
                            borderRadius: 60,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            color: theme,
                            fontWeight: "600",
                            textAlign: "left",
                          }}
                        >
                          you
                        </Text>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 10,
                            fontWeight: "200",
                            color: "white",
                          }}
                        >
                          {item.timestamp.toDate().toLocaleDateString()}{" "}
                          {item.timestamp.toDate().toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </Text>
                      </View>

                      <Text
                        style={{
                          marginLeft: 50,
                          marginTop: -10,
                          color: "white",
                          fontWeight: "300",
                        }}
                      >
                        {item.text}
                      </Text>
                    </View>
                  ) : /* If unlinked and matchee's msg, print a new header with matchee image, and print the body below that*/
                  item.link && item.senderId === match_ID ? (
                    <View>
                      <View
                        style={{ flexDirection: "row", alignItems: "center" }}
                      >
                        <Image
                          source={{ uri: surl2 }}
                          resizeMode="contain"
                          style={{
                            marginRight: 10,
                            backgroundColor: "rgba(28,29,35,1)",
                            width: 40,
                            height: 40,
                            borderRadius: 60,
                          }}
                        />
                        <Text
                          style={{
                            fontSize: 16,
                            paddingBottom: -15,
                            color: matchTheme,
                            fontWeight: "600",
                            textAlign: "left",
                          }}
                        >
                          {matchName}
                        </Text>
                        <Text
                          style={{
                            marginLeft: 5,
                            fontSize: 10,
                            fontWeight: "200",
                            color: "white",
                          }}
                        >
                          {item.timestamp.toDate().toLocaleDateString()}{" "}
                          {item.timestamp.toDate().toLocaleString("en-US", {
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                          })}
                        </Text>
                      </View>
                      <Pressable
                        style={({ pressed }) => [
                          {
                            backgroundColor: pressed
                              ? "rgba(210, 230, 255, 0.2555)"
                              : "transparent",
                            borderRadius: 10,
                            marginTop: -10,
                            marginLeft: 40,
                          },
                        ]}
                        onLongPress={() => handleClick(item)}
                      >
                        <Text
                          style={{
                            marginLeft: 10,
                            color: "white",
                            fontWeight: "300",
                          }}
                        >
                          {item.text}
                        </Text>
                      </Pressable>
                    </View>
                  ) : /* If linked and matcheee, then just print the body with pressable only because the most recent msg in the chat is the author's*/
                  !item.link && item.senderId === match_ID ? (
                    <Pressable
                      style={({ pressed }) => [
                        {
                          backgroundColor: pressed
                            ? "rgba(210, 230, 255, 0.2555)"
                            : "transparent",
                          borderRadius: 10,
                        },
                      ]}
                      onLongPress={() => handleClick(item)}
                    >
                      <Text
                        style={{
                          marginLeft: 50,
                          color: "white",
                          fontWeight: "300",
                        }}
                      >
                        {item.text}
                      </Text>
                    </Pressable>
                  ) : /** Otherwise print without pressable if its client not matchee */
                  !item.link && item.senderId === client_ID ? (
                    <Text
                      style={{
                        marginLeft: 50,
                        color: "white",
                        fontWeight: "300",
                      }}
                    >
                      {item.text}
                    </Text>
                  ) : null}
                </View>
              </View>
            )}
          />
        </View>

        {/* Row 3 with TextInput and Send Button*/}
        <View
          style={[
            {
              flex: 2,
              backgroundColor: "rgba(28,29,34,255)",
              borderTopWidth: 1,
              borderColor: "rgba(199,200,205,0.75)",
              padding: 5,
              marginTop: 10
            },
          ]}
        >
          <View style={[{ flex: 1, flexDirection: "row" }]}>
            <View style={{ flex: 2 }}>
              <TextInput
                ref={textInputRef}
                placeholder={"message " + matchName}
                placeholderTextColor="white"
                keyboardAppearance="dark"
                value={sampleSend}
                onChangeText={(text) => setSample(text)}
                style={[
                  styles.input,
                  {
                    fontSize: 16,
                    width: "100%",
                    borderRadius: 30,
                    color: "white",
                    alignSelf: "center",
                  },
                ]}
              />
            </View>
            <View style={{ flex: 1 }}>
              <AnimateIcon
                style={{}}
                iconComponent={
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <Feather name="send" size={64} color={theme} />
                  </View>
                }
                onPress={testInput}
              />
            </View>
          </View>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
};
export default JiltdChat;
