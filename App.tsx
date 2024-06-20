import { StatusBar } from "expo-status-bar";
import { StyleSheet, Text, View } from "react-native";
import LoginScreen from "./screens/LoginScreen";
import HomePage from "./screens/HomePage";
import MatchScreen from "./screens/MatchScreen";
import RatingScreen from "./screens/RatingScreen";
import RegisterScreen from "./screens/RegisterScreen";
import SecondRegister from "./screens/SecondRegister";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Auth } from "./Firebase";
export type RootStackParamList = {
  Login: undefined;
  HomePage: undefined;
  MatchScreen: { match: string; self: string; theme: string; path: string };
  RatingScreen: { ratee: string };
  RegisterScreen: undefined;
  SecondRegister: { name: string };
  // Cmen: undefined;
  //<Stack.Screen options={{ headerShown: false}} name="Cmen" component={Cmen} />
};

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen
          options={{ headerShown: false }}
          name="Login"
          component={LoginScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="HomePage"
          component={HomePage}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="MatchScreen"
          component={MatchScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="RatingScreen"
          component={RatingScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="RegisterScreen"
          component={RegisterScreen}
        />
        <Stack.Screen
          options={{ headerShown: false }}
          name="SecondRegister"
          component={SecondRegister}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
});
