import { useState } from "react";
import { Button, Text } from "react-native-paper";
import { Image, View, StyleSheet } from "react-native";

import * as ImagePicker from "expo-image-picker";

interface ImageProps {
  image: string | undefined;
  set: React.Dispatch<React.SetStateAction<string | undefined>>;
}

export default function ImagePickerComponent({ image, set }: ImageProps) {
  // const [image, setImage] = useState<string>();

  const pickImage = async () => {
    // No permissions request is necessary for launching the image library
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      // allowsEditing: true,
      // aspect: [4, 4],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      set(result.assets[0].uri);
    } else {
      alert("You did not select any image.");
    }
  };

  return (
    <View style={styles.container}>
      {image && <Image source={{ uri: image }} style={styles.image} />}
      <Button onPress={pickImage} mode="outlined">
        Выберите фото для загрузки
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  // container: {
  //   flex: 1,
  //   alignItems: "center",
  //   justifyContent: "center",
  // },
  image: {
    width: 300,
    height: 300,
    marginBottom: 20,
    borderRadius: 20,
  },
  container: {
    // flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
    padding: 20,
  },
  // image: {
  //   width: 200,
  //   height: 200,
  //   // borderRadius: 100,
  // },
  button: {
    width: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#007bff",
    borderRadius: 10,
    paddingVertical: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
  },
});
