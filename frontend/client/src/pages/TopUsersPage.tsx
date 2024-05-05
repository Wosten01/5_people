import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import { API } from "../api";

interface User {
  id: number;
  fio: string;
  rank: number;
}

const sampleUsers: User[] = [
  { id: 1, fio: "Иван Иванов  Владиславович", rank: 3 },
  { id: 2, fio: "Петр Петров  Владиславович", rank: 1 },
  { id: 3, fio: "Сидор Сидоров  Владиславович", rank: 2 },
  { id: 4, fio: "Иван Иванов  Владиславович", rank: 3 },
  { id: 5, fio: "Петр Петров  Владиславович", rank: 1 },
  { id: 6, fio: "Сидор Сидоров  Владиславович", rank: 2 },
  { id: 7, fio: "Петр Петров  Владиславович", rank: 1 },
  { id: 8, fio: "Сидор Сидоров  Владиславович", rank: 2 },
  { id: 9, fio: "Сидор Сидоров  Владиславович", rank: 2 },
  { id: 711, fio: "Петр Петров  Владиславович", rank: 1 },
  { id: 8123, fio: "Сидор Сидоров  Владиславович", rank: 2 },
];

const TopUsersPage = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        let response = await API.getInstance().top();
        if (response.status === 200) {
          setUsers(response.data.top_users);
          console.log(response.data.top_users);
          setIsLoading(false);
        }
      } catch (error) {}
    };

    fetchData();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Топ 10 пользователей</Text>
      {isLoading ? (
        <>
          <ActivityIndicator size="large" color="#0000ff" />
        </>
      ) : (
        <ScrollView>
          {users.map((user) => (
            <View key={user.id} style={styles.userItem}>
              <Text style={styles.label}>Очки:</Text>
              <Text style={styles.rank}>{user.rank}</Text>
              <Text style={styles.label}>Имя:</Text>
              <Text style={styles.userName}>{user.fio}</Text>
            </View>
          ))}
        </ScrollView>
      )}
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
    justifyContent: "space-between",
    flexDirection: "column",
    alignItems: "flex-start",
    marginBottom: 10,
    borderRadius: 10,
    borderWidth: 2,
    padding: 20,
  },
  rank: {
    fontSize: 20,
    fontWeight: "400",
    marginRight: 10,
  },
  label: {
    fontSize: 14,
    fontWeight: "300",
    marginRight: 10,
  },
  userName: {
    fontSize: 20,
    fontWeight: "400",
  },
});

export default TopUsersPage;
