import { useEffect, useState } from "react";

import * as Location from "expo-location";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../components/Home";
import { MapPicker } from "../components/MapPicker";

const Stack = createNativeStackNavigator();

interface HomeScreenProps {
  navigation: any;
}

export default function HomePage({ navigation }: HomeScreenProps) {
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
    <Stack.Navigator>
      <Stack.Screen name="Home">
        {(props) => <HomeScreen {...props} coords={coords} />}
      </Stack.Screen>
      <Stack.Screen name="MapPicker">
        {(props) => (
          <MapPicker {...props} coords={coords} setCoords={setCoords} />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
}
