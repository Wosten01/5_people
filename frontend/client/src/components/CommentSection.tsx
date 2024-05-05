interface CommentProps {
  message: string;
  set: React.Dispatch<React.SetStateAction<string>>;
}

import { View, TextInput, StyleSheet } from "react-native";

const CommentInput = ({ message, set }: CommentProps) => {
  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Введите ваш комментарий"
        onChangeText={set}
        value={message}
        multiline={true}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 30,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f0f0",
  },
  input: {
    width: 275, // Фиксированная ширина
    height: 50, // Фиксированная высота
    borderWidth: 1,
    padding: 10,
    marginBottom: 10,
    borderRadius: 10,
  },
});

export default CommentInput;
