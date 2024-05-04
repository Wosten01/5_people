import * as React from "react";
// import { ViewProps, View, StyleProp, ViewStyle } from "react-native";
// import { Avatar, Button, Card, Text } from "react-native-paper";
import { IconSource } from "react-native-paper/lib/typescript/components/Icon";
import { ThemeProp } from "react-native-paper/lib/typescript/types";

interface ReportsProps {
  navigation: any;
}

const statusOptions = [
  "Confirmation of contamination",
  "Confirmed of contamination",
  "Сonfirmation of cleaning",
  "Done",
];

import { View, StyleSheet, ScrollView } from "react-native";
import { Card, Title, Paragraph } from "react-native-paper";
import { REPORTS_DATA } from "../data_samples/moderation_panel";

const data = REPORTS_DATA;

interface Data {
  id: number;
  comment: string;
  status: number;
  coordinates: string;
  photo: string;
}

const getStatusColor = (status: number) => {
  switch (status) {
    case 0:
      return { backgroundColor: "#F0F0F0" }; // Change color based on status
    case 1:
      return { backgroundColor: "#FFECB3" }; // Change color based on status
    case 2:
      return { backgroundColor: "#FFD1DC" };
    case 3:
      return { backgroundColor: "#C8E6C9" };
    default:
      return { backgroundColor: "#FFCDD2" }; // Default color
  }
};

export function Reports({ navigation }: ReportsProps) {
  return (
    <ScrollView style={styles.container}>
      {data.map((item: Data) => (
        <Card key={item.id} style={[styles.card, getStatusColor(item.status)]}>
          <Card.Content>
            <Title>{`Status: ${statusOptions[item.status]}`}</Title>
            <Paragraph>{`Comment: ${item.comment}`}</Paragraph>
            <Paragraph>{`Coordinates: ${item.coordinates}`}</Paragraph>
          </Card.Content>
        </Card>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  card: {
    marginBottom: 10,
  },
});

export default Reports;
