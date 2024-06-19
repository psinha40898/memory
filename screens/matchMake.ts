import {
    FirestoreError,
    deleteDoc,
    updateDoc,
    setDoc,
    getDoc,
    CollectionReference,
    QuerySnapshot,
    DocumentData,
    DocumentReference,
    DocumentSnapshot,
    QueryDocumentSnapshot,
    db,
    doc,
    getDocs,
    collection,
    runTransaction,
  } from "../Firebase";
  import type { RootStackParamList } from "../App";
  import type { NativeStackNavigationProp } from "@react-navigation/native-stack";
  
  export const matchMake = async (
    clientUserID: string,
    navigation: NativeStackNavigationProp<RootStackParamList>,
    RGBA: string,
    DIR: string,
  ) => {
    const clientUserDocRefMain: DocumentReference<DocumentData, DocumentData> =
      doc(db, "users", clientUserID);
    const clientUserDocRef: DocumentReference<DocumentData, DocumentData> = doc(
      db,
      "queue",
      clientUserID,
    );
    const clientUserDocSnap: DocumentSnapshot<DocumentData, DocumentData> =
      await getDoc(clientUserDocRef);
    await updateDoc(clientUserDocRefMain, { jilt: false });
    await updateDoc(clientUserDocRefMain, { curPath: DIR, curTheme: RGBA });
    let inQueue = true;
    let finalMatchID: string = "MATCH";
    let start = Date.now();
    while (inQueue) {
      let delta = Date.now() - start;
      if (delta > 12000) {
        console.log("Leave it now");
        await deleteDoc(clientUserDocRef);
        //delete doc
        break;
      }
      if (!clientUserDocSnap.exists()) {
        await setDoc(clientUserDocRef, {
          matchedID: "Open",
        });
      }
  
      let matchedUser: QueryDocumentSnapshot<DocumentData, DocumentData>;
      try {
        finalMatchID = await runTransaction(db, async (transaction) => {
          const matchMakingPoolRef: CollectionReference<
            DocumentData,
            DocumentData
          > = collection(db, "queue");
          const matchMakingPoolSnap: QuerySnapshot<DocumentData, DocumentData> =
            await getDocs(matchMakingPoolRef);
          const clientUserDocSnap = await transaction.get(clientUserDocRef);
          const clientUserMatchedID =
            clientUserDocSnap.data()?.matchedID ?? "Open";
          if (clientUserMatchedID !== "Open") {
            //the error im trying to debug occurs when chosen by someone
            console.log("Chosen by someone");
            return clientUserMatchedID;
          }
          for (const doc of matchMakingPoolSnap.docs) {
            const curUser = await transaction.get(doc.ref);
            if (!curUser.exists()) {
              throw "Document does not exist!";
            }
            console.log(curUser.id);
            if (
              curUser.exists() &&
              curUser.id !== clientUserID &&
              curUser.id !== "emptyQ" &&
              (curUser.data().matchedID === "Open" ||
                curUser.data().matchedID === clientUserID)
            ) {
              matchedUser = curUser;
              break;
            }
          }
          if (!matchedUser) {
            //bad code using falsy-ness
            inQueue = true;
            throw "Queue is empty! Nobody's home.";
          }
  
          const writetoMatch = clientUserID;
          //if open
          if (matchedUser.data().matchedID === "Open") {
            transaction.update(matchedUser.ref, { matchedID: writetoMatch });
            console.log("error is here");
            transaction.update(clientUserDocRef, { matchedID: matchedUser.id });
          }
          const matchedUserID = matchedUser.id;
          return matchedUserID;
        });
      } catch (e) {
        console.log("ERROR", e);
      }
  
      try {
        if (typeof finalMatchID === "undefined") {
          throw "Undefined!";
        }
        if (finalMatchID === "MATCH") {
          throw "Can't find a single valid match!";
        }
  
        const clientUserDocRefCheck: DocumentReference<
          DocumentData,
          DocumentData
        > = doc(db, "queue", clientUserID);
        const clientUserDocSnapCheck: DocumentSnapshot<
          DocumentData,
          DocumentData
        > = await getDoc(clientUserDocRefCheck);
        const matchUserDocRefCheck: DocumentReference<
          DocumentData,
          DocumentData
        > = doc(db, "queue", finalMatchID);
        const matchUserDocSnapCheck: DocumentSnapshot<
          DocumentData,
          DocumentData
        > = await getDoc(matchUserDocRefCheck);
        //scenario 1 -- someone wrote to you, and you didnt write to anybody finalMatch holds writer's valid ID
        //scenario 2 -- you wrote to somebody finalmatch holds their valid ID holds writee's ID
        //scenario 3 -- you didnt write to anybody, and nobody wrote to you (this is the case where you're matching with someone invalid)
  
        console.log(finalMatchID, clientUserID);
        //we can put a check here to verify the signatures
        //it's all about the signatures at this point and loop control.
        if (
          clientUserDocSnapCheck.data()?.matchedID === finalMatchID &&
          matchUserDocSnapCheck.data()?.matchedID === clientUserID
        ) {
          console.log("matchMake,ts", RGBA, DIR);
          navigation.navigate("HomePage");
          //have a field in chatroom doc
          //increment it
          //in the chatroom, remove people from queue if the value is equal to 2.
          console.log("I am", clientUserID, "match with", finalMatchID);
          inQueue = false;
        }
      } catch (e) {
        console.log(e);
        if (e instanceof FirestoreError) {
          if (e.code === "failed-precondition") {
          }
        }
      }
    }
    // const clientUserDocRefCheck: DocumentReference<DocumentData, DocumentData> = doc(db,'queue',clientUserID);
    // const clientUserDocSnapCheck: DocumentSnapshot<DocumentData, DocumentData> = await getDoc(clientUserDocRefCheck);
    // if (clientUserDocSnapCheck.exists())
    // {
    //   await deleteDoc(clientUserDocRefCheck); //deleting from the queue works -- but it throws a warning (not erorr) when a prospective match deletes
    //   console.log("LEFT QUEUE");              //can fix by leaving people in queue -- making that the "online pool" and seperating by fields? less efficient.
    // }
    // console.log("final execution") // see  if this executes
    // i can delete the document once we're in the chat
    // then, instead of deleting it here, simmply edit a field
    // make that field qualifying to a good match
  
    //mark as "active" after creating doc
    //the update is regular
    //mark inactive before proceeding
    //delete once in chat?
  };
  