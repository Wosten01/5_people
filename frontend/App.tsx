import * as React from "react";
import { View, Text, Button, Platform } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "./pages/Home";
import { StyleSheet, Platform, AppRegistry, View } from "react-native";
import {
  Appbar,
  Button,
  Card,
  DefaultTheme,
  FAB,
  MD3LightTheme,
  PaperProvider,
  Text,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

if (process.env.NODE_ENV === "development" && Platform.OS === "web") {
  require("@expo/metro-runtime"); // #23104 (comment)
}

const theme = {
  ...DefaultTheme,
};

if (process.env.NODE_ENV === "development" && Platform.OS === "web") {
  require("@expo/metro-runtime"); // #23104 (comment)
}

const Stack = createNativeStackNavigator();

interface DeatailScreenProps {
  navigation: any;
}

function DetailsScreen({ navigation }: DeatailScreenProps) {
  return (
    <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
      <Text>Details Screen</Text>
      <Button
        title="Go to Details... again"
        onPress={() => navigation.push("Details")}
      />
      <Button title="Go to Home" onPress={() => navigation.navigate("Home")} />
      <Button title="Go back" onPress={() => navigation.goBack()} />
    </View>
    
  );
}
function App() {
  return (
    <PaperProvider theme={theme}>
      
      <SafeAreaView>
        <NavigationContainer>
      <Stack.Navigator>
        <Stack.Screen name="Home" options={{ title: "Main" }}>
          {(props) => <HomeScreen {...props} />}
        </Stack.Screen>
        <Stack.Screen name="Details" component={DetailsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
      </SafeAreaView>
    </PaperProvider>
    
  );
}

export default App;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});

