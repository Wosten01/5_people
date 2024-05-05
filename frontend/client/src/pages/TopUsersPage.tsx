import React, { useState, useEffect } from "react";
import { View, Text, StyleSheet, FlatList } from "react-native";

const sampleUsers = [
  { fio: "Иван Иванов", rank: 1 },
  { fio: "Петр Петров", rank: 2 },
  { fio: "Сидор Сидоров", rank: 3 },
];

interface UserRate {
  fio: string;
  rank: number;
}

const TopUsersPage = () => {
  const [users, setUsers] = useState<UserRate[] | null>();

  useEffect(() => {
    setUsers(sampleUsers);
  }, []);

  const renderUserItem = ({ item }: { item: UserRate }) => (
    <View style={styles.userItem}>
      <Text style={styles.rank}>{item.rank}</Text>
      <Text style={styles.userName}>{item.fio}</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Топ пользователей</Text>
      <FlatList
        data={users}
        renderItem={renderUserItem}
        keyExtractor={(item) => item.fio.toString()}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  userItem: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  rank: {
    fontSize: 20,
    fontWeight: "bold",
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
  },
});

export default TopUsersPage;
