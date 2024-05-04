import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Map } from "../components/Map";
import PickerInfo from "../components/PickerInfo";
import { useState } from "react";

const Stack = createNativeStackNavigator();

export default function MapPage() {
  const [marker, setMarker] = useState(null);

  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Map">
          {(props) => <Map {...props} setMarker={setMarker} />}
        </Stack.Screen>
        <Stack.Screen name="PickerInfo">
          {(props) => <PickerInfo {...props} marker={marker} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
