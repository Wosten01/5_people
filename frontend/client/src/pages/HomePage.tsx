import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { HomeScreen } from "../components/Home";
import { MapPicker } from "../components/MapPicker";

const Stack = createNativeStackNavigator();

interface HomeScreenProps {
  navigation: any;
  coords: any;
  setCoords: any;
}

export default function HomePage({
  coords,
  setCoords,
  navigation,
}: HomeScreenProps) {
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
