import { StyleSheet } from "react-native";
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#070707",
    justifyContent: "center",
    alignItems: "center",
  },
  dropDown: {
    backgroundColor: "rgba(204, 41, 54, .85)",
    borderRadius: 5,
  },

  dropDownRow: {
    backgroundColor: "rgba(204, 41, 54, .85)",
    padding: 5,
    borderRadius: 5,
  },
  dropDownText: {
    fontSize: 8,
  },
  matchContainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "rgba(28,29,34,255)",
    borderBottomWidth: 2,
    borderColor: "rgba(199,200,205,0.75)",
  },
  chatroomContainer: {
    flex: 1,
    width: "100%",
  },
  inputContainer: {
    width: "60%",
  },
  headerContainer: {
    flexDirection: "row", // Make children (Text and Image) display in a row
    alignItems: "center", // Vertically center-align the children
  },
  input: {
    backgroundColor: "rgba(49,50,59,255)",
    color: "rgba(120,123,135,255)",
    fontWeight: "100",
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderRadius: 5,
    marginTop: 10,
  },
  buttonContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: 20,
  },
  button: {
    width: "100%",
    height: 50,
    alignItems: "center",
    backgroundColor: "rgba(204, 41, 54, .85)",
    paddingHorizontal: 10,
    paddingVertical: 12.5,
    borderRadius: 5,
  },
  buttonText: {
    color: "rgba(232, 180, 188, 1)",
    fontWeight: "900",
  },
  buttonOutline: {
    backgroundColor: "rgba(204, 41, 54, .85)",
    marginTop: 20,
  },
  buttonOutlineText: {
    color: "rgba(232, 180, 188, 1)",
    fontWeight: "200",
  },
  headerText: {
    fontSize: 64,
    color: "rgba(204, 41, 54, 1)",
    fontWeight: "100",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 0,
  },
  modalView: {
    margin: 20,
    backgroundColor: "rgba(204, 41, 54, .8)",
    borderRadius: 5,
    padding: 25,
    borderWidth: 1,

    shadowColor: "#000",
    shadowOffset: {
      width: 4,
      height: 4,
    },
    shadowOpacity: 0.85,
    shadowRadius: 4,
    elevation: 12,
  },
  modalText: {
    marginBottom: 15,
    fontSize: 12,
    textAlign: "center",
    color: "white",
    fontWeight: "400",
  },
  modalText2: {
    marginBottom: 15,
    textAlign: "left",
    color: "white",
    fontWeight: "600",
  },

  /**Chatbox */
  chatTextR: {
    borderRadius: 25,
    padding: 10,
    margin: 5,
    maxWidth: "70%",
    backgroundColor: "rgba(204, 41, 54, 1)",
  },
  chatTextL: {
    borderRadius: 25,
    padding: 10,
    margin: 5,
    maxWidth: "70%",
    backgroundColor: "#666666",
  },
  leftBubble: {
    justifyContent: "flex-start",
    alignSelf: "flex-start",
    marginLeft: 10,
  },
  rightBubble: {
    justifyContent: "flex-end",
    alignSelf: "flex-end",
    marginRight: 10,
  },
  leftText: {
    textAlign: "justify",
  },
  rightText: {
    textAlign: "justify",
  },

  /**Sizes*/
  size1: {
    fontSize: 128,
  },
  size2: {
    fontSize: 64,
  },
  size3: {
    fontSize: 32,
  },
  size4: {
    fontSize: 16,
  },
  size5: {
    fontSize: 8,
  },
  size6: {
    fontSize: 4,
  },
  size7: {
    fontSize: 2,
  },
  /** Text Colors */
  primaryBlack: {
    color: "rgba(7, 7, 7, 1)",
  },

  primaryRed: {
    color: "rgba(204, 41, 54, 1)",
  },

  bold: { fontWeight: "bold" },
  italic: { fontStyle: "italic" },
  underline: { textDecorationLine: "underline" },
  /** Text Weights */
  superHeavy: {},
  heavy: {},
  medium: {},
  normal: {},
  light: {},
  frail: {},
  secondaryWhite: {
    color: "white",
  },
  /**BG colors */
  primaryBGBlack: {
    backgroundColor: "rgba(7, 7, 7, 1)",
  },
  primaryBGoffBlack: {
    backgroundColor: "rgba(28, 28, 28, .925)",
  },
  primaryBGRed: {
    backgroundColor: "rgba(204, 41, 54, 1)",
  },
  secondaryBGoffBlack: {
    backgroundColor: "rgba(28, 28, 28, .65)",
  },
  half: {
    width: "100%",
    height: "50%",
    position: "absolute",
  },
  redHalf: {
    backgroundColor: "red",
    top: 0,
  },
  blueHalf: {
    backgroundColor: "blue",
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  text: {
    color: "white",
    fontSize: 18,
  },
});

export default styles;
