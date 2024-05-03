import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import { DefaultTheme, PaperProvider } from "react-native-paper";
import { HomeScreen } from "./src/pages/Home";
import { DetailsScreen } from "./src/pages/Detail";

if (process.env.NODE_ENV === "development" && Platform.OS === "web") {
  require("@expo/metro-runtime");
}
const theme = {
  ...DefaultTheme,
};

const Stack = createNativeStackNavigator();

function App() {
  return (
    <PaperProvider theme={theme}>
      <NavigationContainer>
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{ title: "Main" }}>
            {(props) => <HomeScreen {...props} />}
          </Stack.Screen>
          <Stack.Screen name="Details" component={DetailsScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </PaperProvider>
  );
}

export default App;
