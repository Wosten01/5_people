import * as React from "react";
import { useState } from "react";
import WebView from "react-native-webview";
import { StyleSheet } from "react-native";
import { FAB, Text } from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

interface MapProps {
  setMarker: any;
  navigation: any;
  markers: any;
  coord: any;
  magick: any;
}

export function Map({ markers, setMarker, navigation, coord, magick }: MapProps) {
  const [swtch, setSwitch] = useState(false);

  return (
    <>
      <WebView
        style={styles.view}
        source={{
          html: genHTML(coord, markers, swtch),
        }}
        onMessage={(e) => {
          setMarker(e.nativeEvent.data);
          navigation.navigate("PickerInfo");
        }}
        injectedJavaScript="document.querySelector('.leaflet-attribution-flag').remove()"
      />
      <FAB
        onPress={magick}
        style={styles.button}
        icon="refresh"
      />
    </>
  );
}

function genHTML(coord: { lat: number; lng: number }, markers: any, swtch: boolean) {
  const markers_html = markers
    .map((p: any) => {
      let [x, y] = p.geo.split(" ");
      return `var marker = L.marker([${x}, ${y}]).addTo(map);
     marker.getElement().onclick = () => {
      window.ReactNativeWebView.postMessage(${p.id});
    };`;
    })
    .join("\n");

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
          var map = L.map("map").setView([${coord.lat}, ${coord.lng}], 15);
          L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
            maxZoom: 19,
            attribution:
              '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
          }).addTo(map);
          ${markers_html}
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
  button: {
    position: "absolute",
    margin: 16,
    top: 0,
    right: 0,
  },
});
