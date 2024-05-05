import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ActivityIndicator,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from "react-native";

interface UserData {
  fio: string;
  email: string;
  rank: number;
}

interface Achievements {
  reports: number;
  completes: number;
}

interface Props {
  navigation: any;
}

const UserProfile = ({ navigation }: Props) => {
  const [isLoading, setIsLoading] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [achievements, setAchievements] = useState<Achievements | null>(null);

  useEffect(() => {
    // Здесь можно использовать какой-то механизм для загрузки данных с сервера
    // Например, fetch или axios
    // Пока просто имитируем загрузку данных с помощью setTimeout
    setTimeout(() => {
      const fakeUserData = {
        fio: "Артур Артурович Фрутнинзя",
        email: "example@example.com",
        rank: 5000,
      };
      const fakeAchievements = {
        reports: 10,
        completes: 10,
      };
      setUserData(fakeUserData);
      setIsLoading(false);
      setAchievements(fakeAchievements);
    }, 300);
  }, []);

  return (
    <View style={styles.container}>
      {isLoading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : (
        <ScrollView>
          <View>
            <View style={styles.avatar}></View>
            <View style={styles.rank}>
              <Text style={styles.rankLetters}>Ваш ЭКО-Ранг:</Text>
              <Text style={styles.rankNumber}>{userData?.rank}</Text>
            </View>
          </View>
          <View style={{ padding: 20, gap: 10 }}>
            <View>
              <Text style={styles.usernameLabel}>ФИО:</Text>
              <Text style={styles.username}>{userData?.fio}</Text>
            </View>

            <View>
              <Text style={styles.userInfoLabel}>Почта:</Text>
              <Text style={styles.userInfo}>{userData?.email}</Text>
            </View>
            <View>
              <Text style={styles.userInfoLabel}>
                Количество сообщений о мусоре:
              </Text>
              <Text style={styles.rankNumber}>{achievements?.reports}</Text>
            </View>
            <View>
              <Text style={styles.userInfoLabel}>
                Количество убранных точек:
              </Text>
              <Text style={styles.rankNumber}>{achievements?.completes}</Text>
            </View>
            <TouchableOpacity
              style={styles.button}
              onPress={() => navigation.navigate("Top")}
            >
              <Text style={styles.buttonText}>Посмотреть топ</Text>
            </TouchableOpacity>
          </View>
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
    padding: 40,
  },
  avatar: {
    width: 150,
    height: 150,
    borderRadius: 75,
    backgroundColor: "#ccc",
    marginBottom: 10,
    alignSelf: "center",
  },

  usernameLabel: {
    fontSize: 20,
    fontWeight: "300",
    textAlign: "center",
    alignSelf: "center",
  },
  username: {
    fontSize: 24,
    textAlign: "center",
    alignSelf: "center",
  },
  userInfoLabel: {
    fontSize: 14,
    fontWeight: "300",
    textAlign: "center",
    alignSelf: "center",
  },
  userInfo: {
    fontSize: 20,
    fontWeight: "400",
    textAlign: "center",
    alignSelf: "center",
  },
  rank: {
    flexDirection: "column",
    alignItems: "center",
  },
  rankNumber: {
    fontSize: 25,
    fontWeight: "bold",
    color: "#5ad65a",
    textAlign: "center",
  },

  rankLetters: {
    fontSize: 10,
    color: "#333",
  },
  input: {
    flex: 1,
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    paddingLeft: 10,
  },
  button: {
    backgroundColor: "#5ad65a",
    padding: 10,
    borderRadius: 10,
    marginTop: 20,
    alignSelf: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default UserProfile;
