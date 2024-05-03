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

export default function App() {
  return (
    <PaperProvider theme={theme}>
      <SafeAreaView>
        <View style={styles.container}>
          <Appbar>
            <Appbar.Content title="Amogus" />
          </Appbar>
          <Text>Text</Text>
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
  },
});

AppRegistry.registerComponent("Amogus", () => App);
