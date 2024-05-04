import { Button, Text, FAB } from "react-native-paper";
import { StyleSheet, View, Image } from "react-native";

interface PickerInfoProps {
  marker: string | null;
  navigation: any;
}

export default function PickerInfo({ marker, navigation }: PickerInfoProps) {
  const data = {
    text: "WHEN IMPOSTER IS SUS",
    img: "http://www.naturephoto-cz.com/photos/others/thumb-himalayan-brown-bear-149564.jpg",
    status: "Done",
  };

  return (
    <View style={styles.view}>
      <Image source={{ uri: data.img }} style={styles.image} />
      <Text variant="headlineSmall" style={styles.status}>
        Статус: {data.status}
      </Text>
      <Text variant="bodyLarge">{data.text}</Text>
      <FAB
        icon="arrow-left"
        style={styles.button}
        onPress={() => navigation.goBack()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  view: {
    flex: 1,
    alignItems: "center",
  },
  button: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  image: {
    margin: 16,
    width: 300,
    height: 300,
    borderRadius: 10,
  },
  status: {
    color: "red",
  },
});
