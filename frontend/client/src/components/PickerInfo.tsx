import { Button, Text, FAB } from "react-native-paper";
import { StyleSheet, View, Image } from "react-native";
import { useState } from "react";
import { API } from "../api";
import React from "react";

interface PickerInfoProps {
  marker: string | null;
  navigation: any;
}

export default function PickerInfo({ marker, navigation }: PickerInfoProps) {
  const [data, setData] = useState({
    text: "anderground",
    geo: "52 52",
    img: "ce53f92555a5662d7c46e45a266d565ec492fc02e0d41ec2c7448e870a0cb644.jpeg",
    status: 1,
    user_id: 1,
    value: 1337,
  });

  const magick = async () => {
    try {
      let response = await API.getInstance().get_picker({ id: marker });
      if (response.status === 200) {
        setData(response.data.data[0]);
        console.log(response.data.data);
      }
    } catch (error) {}
  };
  React.useEffect(() => {
    magick();
  }, []);

  const image_link = API.image_link(data.img);
  console.log(data);
  console.log(image_link);

  return data ? (
    <View style={styles.view}>
      <Image source={{ uri: image_link }} style={styles.image} />
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
  ) : (
    <></>
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
