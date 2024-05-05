import { Button, FAB } from "react-native-paper";
import { StyleSheet, View } from "react-native";
import ImagePickerComponent from "./ImagePicker";
import { useState } from "react";
import { API } from "../api";

interface ClearReportProps {
  marker: string | null;
  navigation: any;
}

export default function ClearReport({ navigation, marker }: ClearReportProps) {
  const [img, setImg] = useState<string>();

  function handleSend() {
    const sendReport = () => {
      API.getInstance()
        .user_confirm({
          img: img!,
          report_id: marker!,
        })
        .then(() => {
          console.log("Amogus2");
        })
        .catch((e) => console.log(e.request));
      return;
    };
    sendReport();
    navigation.goBack();
  }

  return (
    <>
      <ImagePickerComponent image={img} set={setImg} />
      <View style={styles.container}>
        <Button mode="contained" onPress={handleSend}>
          Я очистил
        </Button>
      </View>
      <FAB
        onPress={() => navigation.goBack()}
        icon="arrow-left"
        style={styles.button_back}
      />
    </>
  );
}

const styles = StyleSheet.create({
  button_back: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
  container: {
    flex: 1,
    alignContent: "center",
    padding: 50,
  },
});
