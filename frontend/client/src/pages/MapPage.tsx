import {
  NavigationContainer,
  useFocusEffect,
  useIsFocused,
} from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { Map } from "../components/Map";
import PickerInfo from "../components/PickerInfo";
import { useState } from "react";
import React from "react";
import { API } from "../api";
import ClearReport from "../components/ClearReport";

const Stack = createNativeStackNavigator();

interface MapPageProps {
  coord: any;
}

export default function MapPage({ coord }: MapPageProps) {
  const [marker, setMarker] = useState(null);
  const [data, setData] = useState([]);

  useFocusEffect(
    React.useCallback(() => {
      let isActive = true;
      const magick = async () => {
        try {
          let response = await API.getInstance().pickers();
          if (response.status === 200) {
            setData(response.data.data);
            console.log(response.data.data);
          }
        } catch (error) {}
      };

      magick();
      return () => {
        isActive = false;
      };
    }, [])
  );

  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="Map">
        {(props) => (
          <Map {...props} markers={data} setMarker={setMarker} coord={coord} />
        )}
      </Stack.Screen>
      <Stack.Screen name="PickerInfo">
        {(props) => <PickerInfo {...props} marker={marker} />}
      </Stack.Screen>
      <Stack.Screen name="ClearReport">
        {(props) => <ClearReport {...props} marker={marker} />}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
