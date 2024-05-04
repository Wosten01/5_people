import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { DefaultTheme, PaperProvider } from "react-native-paper";
import { HomeScreen } from "./src/pages/Home";

import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MapPage from "./src/pages/MapPage";
import { SafeAreaView } from "react-native-safe-area-context";

if (process.env.NODE_ENV === "development" && Platform.OS === "web") {
  require("@expo/metro-runtime");
}
const theme = {
  ...DefaultTheme,
};
const Tab = createMaterialBottomTabNavigator();

function App() {
  return (
    <SafeAreaView style={styles.view}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen
              options={{ tabBarIcon: "home" }}
              name="Home"
              component={HomeScreen}
            />
            <Tab.Screen
              options={{ tabBarIcon: "map" }}
              name="MapPage"
              component={MapPage}
            />
          </Tab.Navigator>
        </NavigationContainer>
      </PaperProvider>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
});

export default App;
