interface CommentProps {
  message: string;
  set: React.Dispatch<React.SetStateAction<string>>;
}

// export default MessengerInput;
import React, { useState, useEffect } from "react";
import { View, TextInput, StyleSheet, Keyboard, Platform } from "react-native";

const MessengerInput = ({ message, set }: CommentProps) => {
  // const [message, set] = useState("");
  const [keyboardHeight, setKeyboardHeight] = useState(0);

  useEffect(() => {
    const keyboardDidShowListener = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
      (event) => {
        setKeyboardHeight(event.endCoordinates.height);
      }
    );
    const keyboardDidHideListener = Keyboard.addListener(
      Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
      () => {
        setKeyboardHeight(0);
      }
    );

    return () => {
      keyboardDidShowListener.remove();
      keyboardDidHideListener.remove();
    };
  }, []);

  return (
    <View style={[styles.container, { bottom: keyboardHeight }]}>
      <TextInput
        placeholder="Введите сообщение"
        value={message}
        onChangeText={set}
        style={styles.input}
        multiline={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#f4f4f4",
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
  },
  input: {
    paddingHorizontal: 10,
    paddingVertical: 8,
    backgroundColor: "#fff",
    borderRadius: 20,
    fontSize: 16,
  },
});

export default MessengerInput;

// // import React, { useState, useEffect } from "react";
// // import {
// //   View,
// //   TextInput,
// //   StyleSheet,
// //   Keyboard,
// //   Platform,
// //   Modal,
// //   Button,
// // } from "react-native";

// // interface CommentProps {
// //   message: string;
// //   set: React.Dispatch<React.SetStateAction<string>>;
// // }

// // const MessengerInput = ({ message, set }: CommentProps) => {
// //   const [keyboardHeight, setKeyboardHeight] = useState(0);
// //   const [modalVisible, setModalVisible] = useState(false);

// //   useEffect(() => {
// //     const keyboardDidShowListener = Keyboard.addListener(
// //       Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
// //       (event) => {
// //         setKeyboardHeight(event.endCoordinates.height);
// //       }
// //     );
// //     const keyboardDidHideListener = Keyboard.addListener(
// //       Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
// //       () => {
// //         setKeyboardHeight(0);
// //       }
// //     );

// //     return () => {
// //       keyboardDidShowListener.remove();
// //       keyboardDidHideListener.remove();
// //     };
// //   }, []);

// //   const openModal = () => {
// //     setModalVisible(true);
// //   };

// //   const closeModal = () => {
// //     setModalVisible(false);
// //   };

// //   const handleInputChange = (text: string) => {
// //     set(text);
// //   };

// //   return (
// //     <View style={[styles.container, { bottom: keyboardHeight }]}>
// //       <TextInput
// //         placeholder="Введите сообщение"
// //         value={message}
// //         onChangeText={handleInputChange}
// //         style={styles.input}
// //         multiline={true}
// //         onPressIn={openModal}
// //       />
// //       <Modal
// //         visible={modalVisible}
// //         animationType="slide"
// //         transparent={true}
// //         onRequestClose={closeModal}
// //       >
// //         <View style={styles.modalContainer}>
// //           <View style={styles.modalContent}>
// //             <TextInput
// //               placeholder="Введите данные"
// //               style={styles.modalInput}
// //               autoFocus={true}
// //               onChangeText={handleInputChange}
// //             />
// //             <Button title="Закрыть" onPress={closeModal} />
// //           </View>
// //         </View>
// //       </Modal>
// //     </View>
// //   );
// // };

// // const styles = StyleSheet.create({
// //   container: {
// //     backgroundColor: "#f4f4f4",
// //     padding: 10,
// //     borderTopWidth: 1,
// //     borderTopColor: "#ccc",
// //   },
// //   input: {
// //     paddingHorizontal: 10,
// //     paddingVertical: 8,
// //     backgroundColor: "#fff",
// //     borderRadius: 20,
// //     fontSize: 16,
// //   },
// //   modalContainer: {
// //     flex: 1,
// //     justifyContent: "center",
// //     alignItems: "center",
// //     backgroundColor: "rgba(0, 0, 0, 0.5)",
// //   },
// //   modalContent: {
// //     backgroundColor: "#fff",
// //     padding: 20,
// //     borderRadius: 10,
// //     elevation: 5,
// //     minWidth: 300,
// //   },
// //   modalInput: {
// //     marginBottom: 10,
// //     padding: 10,
// //     borderWidth: 1,
// //     borderColor: "#ccc",
// //     borderRadius: 5,
// //   },
// // });

// // export default MessengerInput;

// import React, { useState, useEffect } from "react";
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   Keyboard,
//   Platform,
//   Button,
// } from "react-native";
// import Modal from "react-native-modal";

// interface CommentProps {
//   message: string;
//   set: React.Dispatch<React.SetStateAction<string>>;
// }

// const MessengerInput = ({ message, set }: CommentProps) => {
//   const [keyboardHeight, setKeyboardHeight] = useState(0);
//   const [modalVisible, setModalVisible] = useState(false);

//   useEffect(() => {
//     const keyboardDidShowListener = Keyboard.addListener(
//       Platform.OS === "android" ? "keyboardDidShow" : "keyboardWillShow",
//       (event) => {
//         setKeyboardHeight(event.endCoordinates.height);
//       }
//     );
//     const keyboardDidHideListener = Keyboard.addListener(
//       Platform.OS === "android" ? "keyboardDidHide" : "keyboardWillHide",
//       () => {
//         setKeyboardHeight(0);
//       }
//     );

//     return () => {
//       keyboardDidShowListener.remove();
//       keyboardDidHideListener.remove();
//     };
//   }, []);

//   const openModal = () => {
//     setModalVisible(true);
//   };

//   const closeModal = () => {
//     setModalVisible(false);
//   };

//   const handleInputChange = (text: string) => {
//     set(text);
//   };

//   return (
//     <View style={[styles.container, { bottom: keyboardHeight }]}>
//       <TextInput
//         placeholder="Введите сообщение"
//         value={message}
//         onChangeText={handleInputChange}
//         style={styles.input}
//         multiline={true}
//         onPressIn={openModal}
//       />
//       <Modal
//         isVisible={modalVisible}
//         animationIn="slideInUp"
//         animationOut="slideOutDown"
//       >
//         <View style={styles.modalContent}>
//           <TextInput
//             placeholder="Введите данные"
//             style={styles.modalInput}
//             autoFocus={true}
//             onChangeText={handleInputChange}
//           />
//           <Button title="Закрыть" onPress={closeModal} />
//         </View>
//       </Modal>
//     </View>
//   );
// };

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     backgroundColor: "#f4f4f4",
//     padding: 10,
//     borderTopWidth: 1,
//     borderTopColor: "#ccc",
//   },
//   input: {
//     paddingHorizontal: 10,
//     paddingVertical: 8,
//     backgroundColor: "#fff",
//     borderRadius: 20,
//     fontSize: 16,
//   },
//   modalContent: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     margin: 0,
//   },
//   modalInput: {
//     marginBottom: 10,
//     padding: 10,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     width: "80%",
//   },
// });

// export default MessengerInput;
// import React, { SetStateAction, useState } from "react";
// import {
//   View,
//   TextInput,
//   StyleSheet,
//   KeyboardAvoidingView,
// } from "react-native";
// import { Button } from "react-native-paper";
// import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

// interface CommentProps {
//   set: React.Dispatch<React.SetStateAction<string>>;
// }

// export function CommentSection({ set }: CommentProps) {
//   const [disable, setDisable] = useState<boolean>(false);
//   const [comment, setComment] = useState("");

//   const handleAddComment = () => {
//     if (comment.trim() !== "") {
//       console.log(1);
//       set(comment);
//       setDisable(true);
//     }
//   };

//   const handleEditComment = () => {
//     setDisable(false);
//   };

//   return (
//     <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
//       <KeyboardAwareScrollView
//         contentContainerStyle={styles.container}
//         scrollEnabled={false}
//       >
//         <TextInput
//           style={styles.input}
//           value={comment}
//           onChangeText={(text) => setComment(text)}
//           placeholder="Введите комментарий"
//           placeholderTextColor="#666"
//           multiline
//           editable={!disable}
//         />
//         <Button
//           mode="contained"
//           onPress={disable ? handleEditComment : handleAddComment}
//           style={styles.button}
//         >
//           {disable ? "Редактировать" : "Добавить комментарий"}
//         </Button>
//       </KeyboardAwareScrollView>
//     </KeyboardAvoidingView>
//   );
// }

// const styles = StyleSheet.create({
//   container: {
//     padding: 10,
//     backgroundColor: "#fff",
//     borderRadius: 10,
//     shadowColor: "#000",
//     shadowOffset: {
//       width: 0,
//       height: 2,
//     },
//     shadowOpacity: 0.25,
//     shadowRadius: 3.84,
//     elevation: 5,
//   },
//   input: {
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 5,
//     padding: 10,
//     marginBottom: 10,
//     fontSize: 16,
//     minHeight: 100,
//   },
//   button: {
//     borderRadius: 5,
//     paddingVertical: 10,
//   },
// });

// export default CommentSection;
