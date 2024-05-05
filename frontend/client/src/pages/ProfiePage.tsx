import UserProfile from "../components/Profile";
import TopUsersPage from "./TopUsersPage";

import { createNativeStackNavigator } from "@react-navigation/native-stack";
const Stack = createNativeStackNavigator();

interface HomeScreenProps {
  navigation: any;
}

export default function ProfilePage({ navigation }: HomeScreenProps) {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Profile">
        {(props) => <UserProfile {...props} />}
      </Stack.Screen>
      <Stack.Screen name="Top" component={TopUsersPage} />
    </Stack.Navigator>
  );
}
