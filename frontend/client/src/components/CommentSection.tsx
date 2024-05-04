import React, { SetStateAction, useState } from "react";
import { View, TextInput, StyleSheet } from "react-native";
import { Button } from "react-native-paper";

interface CommentProps {
  set: React.Dispatch<React.SetStateAction<string>>;
}

export function CommentSection({ set }: CommentProps) {
  const [disable, setDisable] = useState<boolean>(false);
  const [comment, setComment] = useState("");

  const handleAddComment = () => {
    if (comment.trim() !== "") {
      console.log(1);
      set(comment);
      setDisable(true);
    }
  };

  const handleEditComment = () => {
    setDisable(false);
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        value={comment}
        onChangeText={(text) => setComment(text)}
        placeholder="Введите комментарий"
        placeholderTextColor="#666"
        multiline
        editable={!disable}
      />
      <Button
        mode="outlined"
        onPress={disable ? handleEditComment : handleAddComment}
      >
        {disable ? "Редактировать" : "Добавить комментарий"}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
});

export default CommentSection;
