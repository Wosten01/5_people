import React, { useEffect, useState } from "react";
import { Alert, Modal, Pressable, ScrollView, View } from "react-native";
import { Button, Text } from "react-native-paper";
import ImagePickerComponent from "../components/ImagePicker";
import { StyleSheet } from "react-native";

interface HomeScreenProps {
  navigation: any;
  coords: {
    lat: number;
    lng: number;
  };
}

export function HomeScreen({ coords, navigation }: HomeScreenProps) {
  const [image, setImage] = useState<string>();
  const [comment, setComment] = useState<string>("qhdsjshd");
  const [modalVisible, setModalVisible] = useState(false);

  const accept = () => {
    setModalVisible(true);
  };

  const close = () => {
    setModalVisible(false);
  };

  const sendReport = () => {
    console.log(image);
    console.log(comment);
    return;
  };

  return (
    <ScrollView contentContainerStyle={styles.contentContainer}>
      <ImagePickerComponent image={image} set={setImage} />
      {/* <CommentSection set={setComment} /> */}

      <Button onPress={() => navigation.navigate("MapPicker")}>
        {JSON.stringify(coords)}
      </Button>

      {image != undefined && comment != "" ? (
        <Button mode="outlined" onPress={() => accept()} style={styles.button}>
          Отправить
        </Button>
      ) : (
        <></>
      )}

      <View style={styles.centeredView}>
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => {
            Alert.alert("Modal has been closed.");
            setModalVisible(!modalVisible);
          }}
        >
          <View style={styles.centeredView}>
            <View style={styles.modalView}>
              <Text style={styles.modalText}>
                Уверены что хотите отправить данные?
              </Text>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => {
                  sendReport();
                  setModalVisible(!modalVisible);
                }}
              >
                <Text style={styles.textStyle}>Подтвердить</Text>
              </Pressable>
              <Pressable
                style={[styles.button, styles.buttonClose]}
                onPress={() => setModalVisible(!modalVisible)}
              >
                <Text style={styles.textStyle}>Отменить</Text>
              </Pressable>
            </View>
          </View>
        </Modal>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  text: {
    color: "#006400",
    justifyContent: "center",
    alignItems: "center",
  },
  contentContainer: {
    paddingVertical: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  centeredView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 22,
  },
  modalView: {
    margin: 20,
    backgroundColor: "white",
    borderRadius: 20,
    padding: 35,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonOpen: {
    backgroundColor: "#F194FF",
  },
  buttonClose: {
    backgroundColor: "#2196F3",
  },
  textStyle: {
    color: "white",
    fontWeight: "bold",
    textAlign: "center",
  },
  modalText: {
    marginBottom: 15,
    textAlign: "center",
  },
});
