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
import { useEffect, useState } from "react";
import * as Location from "expo-location";

if (process.env.NODE_ENV === "development" && Platform.OS === "web") {
  require("@expo/metro-runtime");
}
const theme = {
  ...DefaultTheme,
};
const Tab = createMaterialBottomTabNavigator();

function App() {
  const [location, setLocation] = useState<Location.LocationObject | undefined>(
    undefined
  );

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        return;
      }

      setLocation(await Location.getCurrentPositionAsync({}));
    })();
  }, []);

  const [coords, setCoords] = useState({ lat: 52, lng: 52 });

  useEffect(() => {
    location &&
      setCoords({
        lat: location!.coords.latitude,
        lng: location!.coords.longitude,
      });
  }, [location]);
  return (
    <SafeAreaView style={styles.view}>
      <PaperProvider theme={theme}>
        <NavigationContainer>
          <Tab.Navigator>
            <Tab.Screen options={{ tabBarIcon: "home" }} name="HomePage">
              {(props) => (
                <HomePage {...props} coords={coords} setCoords={setCoords} />
              )}
            </Tab.Screen>
            <Tab.Screen options={{ tabBarIcon: "map" }} name="MapPage">
              {(props) => <MapPage {...props} coord={coords} />}
            </Tab.Screen>
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
