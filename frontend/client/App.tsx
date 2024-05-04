import * as React from "react";
import { Platform, StyleSheet } from "react-native";
import { NavigationContainer } from "@react-navigation/native";

import { DefaultTheme, PaperProvider } from "react-native-paper";

import { createMaterialBottomTabNavigator } from "react-native-paper/react-navigation";
import MapPage from "./src/pages/MapPage";
import { SafeAreaView } from "react-native-safe-area-context";
import { MapPicker } from "./src/components/MapPicker";
import HomePage from "./src/pages/HomePage";
import Reports from "./src/pages/Reports";

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
              name="HomePage"
              component={HomePage}
            />
            <Tab.Screen
              options={{ tabBarIcon: "map" }}
              name="MapPage"
              component={MapPage}
            />
            <Tab.Screen
              options={{ tabBarIcon: "book-account" }}
              name="ReportPage"
              component={Reports}
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
