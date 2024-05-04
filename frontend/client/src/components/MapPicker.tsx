import * as React from "react";
import { useState } from "react";
import WebView from "react-native-webview";
import { StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";

interface MapProps {
  navigation: any;
  coords: { lat: number; lng: number };
  setCoords: any;
}

export function MapPicker({ coords, setCoords, navigation }: MapProps) {
  return (
    <>
      <WebView
        style={styles.view}
        source={{
          html: genHTML(),
        }}
        onMessage={(e) => {
          setCoords(JSON.parse(e.nativeEvent.data));
        }}
        injectedJavaScript="document.querySelector('.leaflet-attribution-flag').remove()"
      />
      <FAB style={styles.button} icon="plus" />
      <Text variant="bodyLarge" style={styles.text}>
        {JSON.stringify(coords)}
      </Text>
    </>
  );
}

function genHTML() {
  const location = [52, 52];
  const html = `<!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <title>Карта</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css"
          integrity="sha256-p4NxAoJBhIIN+hmNHrzRCf9tD/miZyoHS5obTRR9BMY="
          crossorigin=""
        />
        <script
          src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"
          integrity="sha256-20nQCchB9co0qIjJZRGuk2/Z9VM+kNiyxNV1lvTlZBo="
          crossorigin=""
        ></script>
        <style>
          body {
            padding: 0;
            margin: 0;
          }
          html,
          body,
          #map {
            height: 100%;
            width: 100vw;
          }
        </style>
      </head>
      <body>
        <div id="map"></div>
        <script>
          var map = L.map("map").setView([${location[0]}, ${location[1]}], 15);
          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);
          var marker = L.marker([52, 52], {draggable: true}).addTo(map);
          marker.on('dragend', function (e) {
            window.ReactNativeWebView.postMessage(JSON.stringify(e.target.getLatLng()));
          })
        </script>
      </body>
    </html>
    `;
  return html;
}

export const styles = StyleSheet.create({
  view: {
    flex: 1,
  },
  text: {
    position: "absolute",
    margin: 16,
    top: 0,
    right: 0,
  },
  button: {
    position: "absolute",
    margin: 16,
    right: 0,
    bottom: 0,
  },
});
