import React, { useEffect, useState, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Modal,
  Alert,
  Animated,
  GestureResponderEvent,
  Dimensions,
  FlatList,
  Share,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { AntDesign } from "@expo/vector-icons";

import { MaterialIcons } from "@expo/vector-icons";
import MyModal from "../essentialComponents/MyModal";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import type { RootStackParamList } from "../App";
import { FontAwesome5 } from "@expo/vector-icons";
import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
import styles from "../essentialComponents/Style";
import IconButton from "../essentialComponents/IconButton";
import { matchMake } from "./matchMake";
import {
  auth,
  db,
  ref,
  storage,
  getDownloadURL,
  doc,
  getDoc,
  Timestamp,
  setDoc,
  updateDoc
} from "../Firebase";
import AnimateIcon from "../essentialComponents/AnimateIcon";
// import Dropdown from 'react-native-input-select';
//https://www.typescriptlang.org/tsconfig#strict
//FINISH INVENTORY MODAL
//ADD save memory feature
//implement chat styles

//should also contain display information about each avatar
interface ImageData {
  url: string; //The Firebase URL of the image
  message: string[];
  path: string;
  selected: boolean;
  theme: string[];
}
interface InventoryItem {
  count: number;
  message: string[];
  name: string;
  path: string;
  selected: boolean;
  theme: string;
}
interface SavedObject {
  author: string;
  body: string;
  date: Timestamp | null;
  note: string;
}

interface UserObject {
  name: string;
  inventory: InventoryItem[];
  saves: SavedObject[];
  rewards: string[];
  rating: number;
}

interface StateObject {
  theme: string;
  path: string;
  url: string | undefined;
  info: string[];
}

const HomePage = () => {
  const userID = auth.currentUser?.uid;
  const navigation =
    useNavigation<NativeStackNavigationProp<RootStackParamList>>();

  //State that needs to fetch on mount, and every time user navigates
  //Contains user metadata and inventory information, including saved messages
  const [userObject, setUser] = useState<UserObject>({
    name: "",
    inventory: [],
    saves: [],
    rewards: [],
    rating: 0,
  });

  const [loading, setLoading] = useState(true);
  const [clientIndex, setIndex] = useState(0);

  //State that changes every time the user picks a different item
  const [stateObject, setState] = useState<StateObject>({
    theme: "rgba(216, 151, 158, 1)",
    path: "",
    url: undefined,
    info: [""],
  });
  //State that changes every time the user picks a different message
  const [curMsg, setMsg] = useState<SavedObject>({
    author: "",
    body: "",
    note: "",
    date: null,
  }); //Current Message -- based on Saves array of saved messages

  //Two essential UI Modals
  const [queueVisible, setQueueVisible] = useState(false); // Modal -- based on whether user in queue or not
  const [inventoryVisible, setInventoryVisible] = useState(false); //Modal -- based on whether user clicked on edit button or not

  //band aid that extracts URLS from inventory array on inventory load
  const [inventoryList, setInventoryList] = useState<ImageData[]>([]); //URLS extracted from Inventory array of avatars along with most convenient metadata to display in Inventory page

  var pointer = useRef(0);
  var inventoryListInfo: ImageData[] = [];

  //Main transition animation defined
  const [flashValue] = useState(new Animated.Value(0));
  const [flashValue2] = useState(new Animated.Value(0));

  const startFlashAnimation = () => {
    Animated.sequence([
      Animated.timing(flashValue, {
        toValue: 0,
        duration: 325,
        useNativeDriver: false,
      }),
      Animated.timing(flashValue, {
        toValue: 1,
        duration: 325,
        useNativeDriver: false,
      }),
    ]).start();
  };

  const startFlashAnimation2 = () => {
    Animated.sequence([
      Animated.timing(flashValue2, {
        toValue: 0,
        duration: 325,
        useNativeDriver: false,
      }),
      Animated.timing(flashValue2, {
        toValue: 1,
        duration: 325,
        useNativeDriver: false,
      }),
    ]).start();
  };

  //TouchGestures
  const [touchStart, setTouchStart] = React.useState<number | null>(null);
  const [touchStartY, setTouchStartY] = React.useState<number | null>(null);
  const [touchEnd, setTouchEnd] = React.useState<number | null>(null);
  const [touchEndY, setTouchEndY] = React.useState<number | null>(null);
  const minSwipeDistance = 100;

  const onTouchStart = (e: GestureResponderEvent) => {
    setTouchEnd(null);
    setTouchStart(e.nativeEvent.touches[0].pageX);
    setTouchEndY(null);
    setTouchStartY(e.nativeEvent.touches[0].pageY);
  };

  const onTouchMove = (e: GestureResponderEvent) => {
    setTouchEnd(e.nativeEvent.touches[0].pageX);
    setTouchEndY(e.nativeEvent.touches[0].pageY);
  };
  const setPointer = (val: number) => {
    if (val > userObject.saves.length - 1 || val < 0) {
      console.log("error");
      return;
    }
    pointer.current = val;
    startFlashAnimation();
    setMsg(userObject.saves[pointer.current]);
    return;
  };
  const incrementPointer = () => {
    if (pointer.current === userObject.saves.length - 1) {
      pointer.current = 0;
      startFlashAnimation();
      setMsg(userObject.saves[pointer.current]);
      return;
    }
    pointer.current = pointer.current + 1;
    console.log(pointer);
    console.log(userObject.rating);
    console.log(userObject.rewards);

    startFlashAnimation();
    setMsg(userObject.saves[pointer.current]);
    return;
  };

  const decrementPointer = () => {
    if (pointer.current === 0) {
      pointer.current = userObject.saves.length - 1;
      startFlashAnimation();
      setMsg(userObject.saves[pointer.current]);
      return;
    }
    pointer.current = pointer.current - 1;
    console.log(pointer);
    startFlashAnimation();
    setMsg(userObject.saves[pointer.current]);
    return;
  };

  const onTouchEnd = () => {
    // const distanceX = touchStart !== null && touchEnd !== null ? touchStart - touchEnd : 0;

    const distanceX = touchStart && touchEnd ? touchStart - touchEnd : 0;
    const distanceY = touchStartY && touchEndY ? touchStartY - touchEndY : 0;
    const isLeftSwipe = distanceX > minSwipeDistance;
    const isRightSwipe = distanceX < -minSwipeDistance;

    if (isRightSwipe && Math.abs(distanceX) > distanceY) {
      decrementPointer();
      // add your conditional logic here
    }
    if (isLeftSwipe && distanceX > distanceY) {
      incrementPointer();
      // add your conditional logic here
    }
  };

  // Interact with Inventory
  /**
   * _____
   * updateDisplay(path, color, story)
   *
   * @param
   * @param
   * @param
   */
  const updateDisplay = async (
    path: string,
    color: string,
    story: string[],
  ) => {
    console.log("updateDisplay()", path, "MESSAGE:", story);
    startFlashAnimation2();
    try {
      const storageRef = ref(storage, path);
      const URL = await getDownloadURL(storageRef);
      setIndex(inventoryList.findIndex(obj => obj.path === path));
      setState({ theme: color, path: path, url: URL, info: story });
    } catch (e) {
      console.log(e);
    }
  };
  const renderItem = ({ item }: { item: ImageData }) => (
    <AnimateIcon
      iconComponent={
        <View style={{ alignSelf: "center", padding: 10 }}>
          <Image
            source={{ uri: item.url }}
            resizeMode="contain"
            style={{
              backgroundColor: "rgba(28,29,35,1)",
              padding: 25,
              width: 50,
              height: 50,
              borderWidth:
                stateObject && stateObject.path === item.path ? 2 : 4,
              borderColor:
                stateObject && stateObject.path === item.path
                  ? stateObject.theme
                  : "rgba(28,29,35,255)",
              borderRadius: 8,
            }}
          />
        </View>
      }
      onPress={() => updateDisplay(item.path, item.theme[0], item.message)}
    ></AnimateIcon>
  );

  const iterateSave = async (save: SavedObject) => {
    setMsg(save);
  };

  /** Enters the user into matchmaking queue */
  const talkButton = async () => {
    if (userID && stateObject && stateObject.path && stateObject.theme) {
      setQueueVisible(true);
      await matchMake(userID, navigation, stateObject.theme, stateObject.path);
      setQueueVisible(false);
    } else {
      console.log("Null?");
    }
  };

  const editButton = () => {
    setInventoryVisible(true);
  };
  const showInventory = () => {
    setInventoryVisible(true);
  };
  const hideInventory = () => {
    setInventoryVisible(false);
  };

  const levelHelper = (level: number, selection: string) => {
    var newUser = userObject;
    newUser.rewards[level - 1] = selection;
    setUser(newUser);
    //fetch object from DB for given level/selection
    //add object to state inventory
    //write new userObject back to firestore
  };
  const levelUp = async (level: number) => {
    const docSnap = await getDoc(doc(db, "objects", "level" + level));
    if (docSnap.exists()) {
      const objects = docSnap.data().rewards;
      console.log(objects);
      navigation.navigate("LevelUp", {
        objList: objects,
        levelVal: level,
      });
    }

    // navigate to level up screen passing Objectlist and level
    // After user picks reward, update firebase and send back to this screen
    // this should update everything
    //update firebase HERE
  };
  const exportButton = async () => {
    /** I need to write an export function
     * It should send an email to the user's email
     * Include the quote
     * Include the sender
     * Include the date
     * Include the picture
     */
  };
  const onShare = async () => {
    try {
      if (curMsg && curMsg.date) {
        const result = await Share.share(
          {
            message:
              "From: " +
              curMsg.author +
              "\n" +
              "Message: " +
              curMsg.body +
              "\n" +
              "Your Note: " +
              curMsg.note +
              "\n" +
              "On: " +
              curMsg.date.toDate().toLocaleDateString(),
          },
          { tintColor: "#000000" },
        );
      } else {
        const result = await Share.share(
          {
            message:
              "React Native | A framework for building native apps using React",
          },
          { tintColor: "#000000" },
        );
        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      }
    } catch (error: any) {
      Alert.alert(error.message);
    }
  };

  //useEffects
  /** useEffect for react-navigation focus paradigm
   * useFocusEffect is provided by react-navigation
   * It runs every time the screen component is in focus
   * and returns cleanup for out of focus
   */
  const writeIndex = async () => {

  }
  useFocusEffect(
    React.useCallback(() => {
      const init = async () => {
        try {
          setLoading(true);
          // Set active image to placeholder!
          const storageRef = ref(storage, "items/black.webp");
          const URL = await getDownloadURL(storageRef);
          // set default state
          setState({
            theme: "black",
            path: "",
            url: URL,
            info: [""],
          });
  
          // Retrieve inventory
          if (userID) {
            const clientUserDocRefMain = doc(db, "users", userID);
            const clientSnap = await getDoc(clientUserDocRefMain);
            const inventoryData = clientSnap?.data()?.inventory;
            const savesData = clientSnap?.data()?.saves;
            const userName = clientSnap?.data()?.displayName;
            const rewardsData = clientSnap?.data()?.rewards;
            const ratingData = clientSnap?.data()?.rating;
            const curIndex = clientSnap?.data()?.index;
            setUser({
              name: userName,
              inventory: inventoryData,
              saves: savesData,
              rewards: rewardsData,
              rating: ratingData,
            });
            setIndex(curIndex);
            console.log("usefocus");
          } else {
            console.log("Null userID?");
          }
        } catch (e) {
          console.log(e);
        } finally {
        }
      };
  
      init();
  
      return () => {
        //update
        if (userID){
          const clientUserDocRefMain = doc(db, 'users', userID);
          updateDoc(clientUserDocRefMain, {
            index: clientIndex,
            // Add any other fields you need to update
          }).then(() => {
            console.log('Document successfully updated on unmount');
          }).catch((error) => {
            console.error('Error updating document on unmount: ', error);
          });
        }

      };
    }, [userID])
  );

  /** Updates states when inventory is loaded (changes only once). Add setImage here
   *  Updates selected item
   *  Updates the displayed message to the default one
   *  This should also update the image to the default one
   */
  useEffect(() => {
    const displayDefaults = async () => {
      if (userObject.inventory.length > 0) {
        const storageRef = ref(storage, userObject.inventory[0].path);
        const URL = await getDownloadURL(storageRef);
        for (const item of userObject.inventory) {
          const storageRef = ref(storage, item.path);
          try {
            const url = await getDownloadURL(storageRef);

            inventoryListInfo.push({
              url: url,
              path: item.path,
              message: item.message,
              theme: [item.theme],
              selected: item.selected,
            });
          } catch (error) {
            console.error("Error fetching URL for path:", item.path, error);
            // Handle error if necessary
          }
        }
        //lets grab URLs from paths and put them in an array
        // set the state here!// set the state here!
        setState({
          theme: userObject.inventory[clientIndex].theme,
          path: userObject.inventory[clientIndex].path,
          url: inventoryListInfo[clientIndex].url,
          info: userObject.inventory[clientIndex].message,
        });
        // set the state here!// set the state here!
        setInventoryList(inventoryListInfo);
        setLoading(false);
      }
      //check if user leveld to 1
      if (userObject.rating > 9) {
        if (!userObject.rewards[0]){
          levelUp(2);
        }
      }
      if (userObject.saves.length > 0) {
        setMsg(userObject.saves[0]);
      }
    };
    displayDefaults();
  }, [userObject]);

  useEffect(() => {
    // Start flash animation when component mounts
    startFlashAnimation();
    startFlashAnimation2();
  }, []);

  //Depcrated

  const urls: string[] = [];
  //convert all paths to URLS on init
  //use array of URLS to toggle images
  var paths = ["items/starters/blueDog.webp", "items/randoms/common/iron.webp"];
  const fetchUrls = async () => {
    for (const path of paths) {
      const storageRef = ref(storage, path);
      try {
        const url = await getDownloadURL(storageRef);
        urls.push(url);
      } catch (error) {
        console.error("Error fetching URL for path:", path, error);
        // Handle error if necessary
      }
    }
  };

  return (
    <View style={[tStyle.container, { flexDirection: "column" }]}>
      {loading ? (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <Text
            style={[
              styles.bold,
              styles.size4,
              { color: "rgba(253,254,253,255)" },
            ]}
          >
            welcome to memory
          </Text>
          <Text
            style={[
              styles.bold,
              styles.size3,
              { color: "rgba(253,254,253,255)", marginBottom: 20 },
            ]}
          >
            {userObject.name}
          </Text>
          <ActivityIndicator size="large" />
        </View>
      ) : (
        <View style={{ flex: 1 }}>
          <View
            style={[
              {
                flex: 1.5,
                flexDirection: "row",
                backgroundColor: stateObject ? stateObject.theme : "grey",
                borderWidth: 0,
              },
            ]}
          >
            <View
              style={{
                flex: 1,
                borderWidth: 0,
                flexDirection: "row",
                marginTop: 30,
                justifyContent: "flex-end",
                margin: 30,
              }}
            >
              <View style={{ marginTop: 10 }}>
                <MaterialIcons
                  name="home-filled"
                  size={32}
                  color={"rgba(253,254,253,255)"}
                />
              </View>
              <View style={{ flexDirection: "column" }}>
                <Text
                  style={[
                    styles.bold,
                    styles.size3,
                    { color: "rgba(253,254,253,255)" },
                  ]}
                >
                  memory.
                </Text>

                <Text
                  style={[
                    styles.bold,
                    styles.size5,
                    { color: "rgba(253,254,253,255)" },
                  ]}
                ></Text>
              </View>
            </View>
            {/* {clientName !== '' ?
    (<Text style={[styles.size3, {fontWeight: '600', color: theme}]}>{clientName}</Text>)
    : null
    } */}
          </View>

          <View
            style={[
              {
                flex: 10,
                flexDirection: "column",
                backgroundColor: "rgba(28,29,35,255)",
                borderTopColor: "red",
                borderTopWidth: 0,
                padding: 10,
              },
            ]}
          >
            {
              //start}
            }
            <View style={[{ flex: 8, flexDirection: "column", padding: 10 }]}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Animated.View
                  style={[
                    zx.overlay,
                    { padding: 0 },
                    {
                      opacity: flashValue2.interpolate({
                        inputRange: [
                          0, 0.25, 0.3, 0.35, 0.5, 0.6, 0.65, 0.75, 1,
                        ],
                        outputRange: [
                          0, 0.25, 0.3, 0.35, 0.5, 0.6, 0.65, 0.75, 1,
                        ],
                      }),
                    },
                  ]}
                >
                  <View>
                    <View style={{}}>
                      <Image
                        source={{ uri: stateObject.url }}
                        style={{
                          width: 100,
                          height: 100,
                          borderWidth: 8,
                          borderTopLeftRadius: 60,
                          borderTopRightRadius: 60,
                          borderColor: "rgba(28,29,35,255)",
                          top: -70,
                        }}
                      />

                      <AnimateIcon
                        style={{
                          height: 30,
                          width: 30,
                          top: -100,
                          left: 75,
                          backgroundColor: "rgba(28,29,35,255)",
                          borderColor: "rgba(56,58,67,255)",
                          borderWidth: 4,
                          borderRadius: 20,
                        }}
                        iconComponent={
                          <View
                            style={{
                              paddingTop: 2.5,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <MaterialIcons
                              name="edit"
                              size={18}
                              color={stateObject ? stateObject.theme : "red"}
                            />
                          </View>
                        }
                        onPress={editButton}
                      ></AnimateIcon>
                    </View>
                  </View>
                </Animated.View>
              </View>

              <MyModal
                style={{
                  flex: 0.75,
                  alignSelf: "center",
                  justifyContent: "center",
                  borderTopRightRadius: 100,
                  borderBottomRightRadius: 100,
                  borderWidth: 0,
                }}
                children={
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <View
                      style={{
                        flex: 0.4,
                        flexDirection: "column",
                        borderColor: "rgba(28,29,35,255)",
                        borderRightWidth: 16,
                        borderRadius: 0,
                      }}
                    >
                      <FlatList
                        data={inventoryList}
                        //Shopify Flatlist Does not trigger the re render we need sad
                        renderItem={renderItem}
                        keyExtractor={(item) => item.path}
                      />
                    </View>
                    <Animated.View
                      style={[
                        {
                          flex: 0.6,
                          flexDirection: "column",
                          borderWidth: 0,
                          padding: 20,
                        },
                        {
                          opacity: flashValue2.interpolate({
                            inputRange: [
                              0, 0.25, 0.3, 0.35, 0.5, 0.6, 0.65, 0.75, 1,
                            ],
                            outputRange: [
                              0, 0.25, 0.3, 0.35, 0.5, 0.6, 0.65, 0.75, 1,
                            ],
                          }),
                        },
                      ]}
                    >
                      <Text
                        style={[
                          styles.size4,
                          {
                            textAlign: "left",
                            color: stateObject ? stateObject.theme : "black",
                            padding: 0,
                            fontWeight: "800",
                          },
                        ]}
                      >
                        {userObject.name + "'s journal"}{" "}
                      </Text>
                      {/* <Text
                        style={[
                          styles.size4,
                          { textAlign: "center", color: "white" },
                        ]}
                      >
                        &lt;hero of the day&gt;
                      </Text> */}
                      <Image
                        source={{ uri: stateObject.url }}
                        resizeMode="contain"
                        style={{
                          backgroundColor: "rgba(28,29,35,1)",
                          padding: 25,
                          margin: 16,
                          width: 125,
                          alignSelf: "center",
                          height: 125,
                          borderRadius: 8,
                          borderWidth: 2,
                          borderColor: "white",
                        }}
                      />

                      <Text
                        style={[
                          styles.size3,
                          {
                            color: "white",
                            padding: 0,
                            fontWeight: "800",
                            marginTop: 12,
                          },
                        ]}
                      >
                        {stateObject.info[0]}{" "}
                      </Text>
                      <Text
                        style={[
                          styles.size4,
                          {
                            color: "white",
                            padding: 0,
                            fontWeight: "800",
                            marginTop: 12,
                          },
                        ]}
                      >
                        {stateObject.info[1]}{" "}
                      </Text>
                    </Animated.View>
                  </View>
                }
                visible={inventoryVisible}
                dismiss={hideInventory}
              ></MyModal>
              {
                //Future swipeable!
              }
              <View style={{ flex: 2, flexDirection: "column" }}>
                <Text
                  style={[
                    styles.size3,
                    {
                      textAlign: "center",
                      color: stateObject ? stateObject.theme : "white",
                      padding: 0,
                      fontWeight: "800",
                    },
                  ]}
                >
                  {userObject.name}{" "}
                </Text>

                <Text
                  style={[
                    styles.size4,
                    {
                      flexWrap: "wrap",
                      color: "rgba(227,229,232,255)",
                      fontWeight: "700",
                      textAlign: "left",
                    },
                  ]}
                >
                  {" "}
                  memories{" "}
                </Text>
              </View>

              <Animated.View
                style={[
                  { borderWidth: 0, flex: 6 },
                  {
                    opacity: flashValue.interpolate({
                      inputRange: [0, 0.25, 0.5, 0.75, 1],
                      outputRange: [0, 0.25, 0.5, 0.75, 1],
                    }),
                  },
                ]}
              >
                <View
                  style={[
                    {
                      alignSelf: "center",
                      padding: 20,
                      borderRadius: 10,
                      borderWidth: 0,
                      backgroundColor: "rgba(38,39,47,255)",
                      shadowColor: "#000",
                      elevation: 4,
                      width: "100%",
                    },
                  ]}
                  onTouchStart={onTouchStart}
                  onTouchMove={onTouchMove}
                  onTouchEnd={onTouchEnd}
                >
                  {curMsg && curMsg.body ? (
                    <Text
                      style={[
                        styles.size4,
                        {
                          flexWrap: "wrap",
                          color: "rgba(227,229,232,255)",
                          fontWeight: "700",
                          textAlign: "left",
                        },
                      ]}
                    >
                      {" "}
                      Saved Message{" "}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.size4,
                        {
                          flexWrap: "wrap",
                          color: "rgba(227,229,232,255)",
                          fontWeight: "700",
                          textAlign: "center",
                        },
                      ]}
                    >
                      {" "}
                      You have no memories.{" "}
                    </Text>
                  )}
                  {curMsg && curMsg.body ? (
                    <Text
                      style={[
                        styles.size4,
                        {
                          flexWrap: "wrap",
                          color: "rgba(211,212,216,255)",
                          fontWeight: "400",
                          textAlign: "center",
                        },
                        styles.italic,
                      ]}
                    >
                      {curMsg.body}
                    </Text>
                  ) : (
                    <Text
                      style={[
                        styles.size4,
                        {
                          flexWrap: "wrap",
                          color: "rgba(227,229,232,255)",
                          fontWeight: "400",
                          textAlign: "center",
                        },
                      ]}
                    >
                      {" "}
                      Click the play button below to start{" "}
                    </Text>
                  )}
                  {curMsg && curMsg.body ? (
                    <Text
                      style={[
                        styles.size4,
                        {
                          flexWrap: "wrap",
                          color: "rgba(227,229,232,255)",
                          fontWeight: "700",
                          textAlign: "left",
                        },
                      ]}
                    >
                      {" "}
                      Your note{" "}
                    </Text>
                  ) : null}
                  {curMsg && curMsg.body ? (
                    <Text
                      style={[
                        styles.size4,
                        {
                          flexWrap: "wrap",
                          color: "rgba(211,212,216,255)",
                          fontWeight: "400",
                          textAlign: "center",
                        },
                        styles.italic,
                      ]}
                    >
                      {curMsg.note}
                    </Text>
                  ) : null}

                  {curMsg && curMsg.body ? (
                    <Text
                      style={[
                        styles.size4,
                        {
                          flexWrap: "wrap",
                          color: "rgba(227,229,232,255)",
                          fontWeight: "700",
                          textAlign: "left",
                        },
                      ]}
                    >
                      {" "}
                      From{" "}
                    </Text>
                  ) : null}

                  {curMsg && curMsg.date ? (
                    <Text
                      style={[
                        styles.size4,
                        {
                          color: "rgba(211,212,216,255)",
                          textAlign: "center",
                          fontWeight: "400",
                        },
                      ]}
                    >
                      {curMsg.author} on{" "}
                      {curMsg.date.toDate().toLocaleDateString()}
                    </Text>
                  ) : null}

                  <View style={{}}>
                    {curMsg && curMsg.date ? (
                      <AnimateIcon
                        onPress={onShare}
                        iconComponent={
                          <View
                            style={[
                              {
                                flexDirection: "row",
                                alignSelf: "center",
                                paddingTop: 10,
                                paddingBottom: 10,
                                paddingHorizontal: 30,
                                borderRadius: 20,
                                backgroundColor: "rgba(56,58,67,255)",
                                shadowColor: "#000",
                                margin: 10,
                                elevation: 4,
                              },
                            ]}
                          >
                            <MaterialCommunityIcons
                              name="export-variant"
                              size={22}
                              color="rgba(198,200,206,255)"
                            />
                            <Text
                              style={[
                                styles.size4,
                                {
                                  flexWrap: "wrap",
                                  color: "rgba(198,200,206,255)",
                                  fontWeight: "700",
                                  textAlign: "center",
                                },
                              ]}
                            >
                              {" "}
                              Export
                            </Text>
                          </View>
                        }
                      ></AnimateIcon>
                    ) : null}
                  </View>
                </View>
                {curMsg ? (
                  <View
                    style={{
                      flex: 0.5,
                      flexDirection: "row",
                      alignContent: "center",
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    {/**Todo: get userObject.saves/length divided by 5
                     *
                     * make outer loop for i > savesdivided_5
                     * parent div flexDir col
                     * flexDir row
                     * inner loop
                     * for i till 5
                     * render userObject.save, renders 5 views inside a flexdirrow
                     * end inner loop
                     * render empty View still inside parent but not inside flexDir row
                     */}
                    {userObject.saves.map((_, index) => (
                      <TouchableOpacity
                        key={index}
                        style={[
                          {
                            maxWidth: "10%",
                            minWidth: "1%",
                            height: 12,
                            elevation: 4,
                            shadowColor: "#000",
                            margin: 4,
                          },
                          pointer.current === index
                            ? { backgroundColor: "rgba(227,229,232,255)" }
                            : { backgroundColor: "rgba(56,58,67,255)" },
                        ]}
                        onPress={() => setPointer(index)}
                      >
                        {/* TouchableOpacity needs a child, so we'll use an empty View */}
                      </TouchableOpacity>
                    ))}
                  </View>
                ) : null}
              </Animated.View>
            </View>

            {
              //end
            }

            <View
              style={[
                {
                  flex: 2,
                  flexDirection: "column",
                  backgroundColor: "rgba(28,29,35,255)",
                  padding: 10,
                },
              ]}
            >
              <AnimateIcon
                onPress={talkButton}
                iconComponent={
                  <View
                    style={[
                      {
                        flexDirection: "row",
                        alignSelf: "center",
                        paddingTop: 10,
                        paddingBottom: 10,
                        paddingHorizontal: 30,
                        borderRadius: 20,
                        backgroundColor: "rgba(56,58,67,255)",
                        shadowColor: "#000",
                        margin: 10,
                        marginBottom: 22,
                        elevation: 4,
                      },
                    ]}
                  >
                    <MaterialIcons
                      name="chat-bubble"
                      size={64}
                      color="rgba(227,229,232,255)"
                    />
                  </View>
                }
              ></AnimateIcon>

              <Modal
                animationType="slide"
                transparent={true}
                visible={queueVisible}
                onRequestClose={() => {
                  Alert.alert("Modal has been closed.");
                  setQueueVisible(!queueVisible);
                }}
              >
                <View style={styles.centeredView}>
                  <View
                    style={[
                      styles.modalView,
                      {
                        backgroundColor: stateObject
                          ? stateObject.theme
                          : "grey",
                      },
                    ]}
                  >
                    <Text style={[styles.modalText, styles.italic]}>
                      You are in the queue to find a match. Thank you for trying
                      Jiltd.
                    </Text>
                    <Text style={styles.modalText2}>
                      Do not deal with personal information.
                    </Text>
                    <Text style={styles.modalText2}>Be respectful.</Text>
                    {/* <Text style={styles.modalText2}>Try your best to help.</Text> */}
                  </View>
                </View>
              </Modal>
              {/**Start inner block */}
            </View>
          </View>

          <View style={[{ flex: 0.75 }, styles.primaryBGBlack]}>
            <View style={[{ flexDirection: "row" }]}>
              <IconButton
                active={"home"}
                theme={stateObject.theme}
                onPress={() => console.log("Sorry")}
                color={"white"}
              ></IconButton>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default HomePage;
const tStyle = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#1A1A1A",
  },
  fab: {
    right: 0,
    bottom: 0,
  },
});

const zx = StyleSheet.create({
  overlay: { backgroundColor: "rgba(0, 15, 8, 0)" },
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
});
