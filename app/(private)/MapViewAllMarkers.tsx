import React, { useEffect, useState } from "react";
import { StyleSheet, View, Text } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import MapView, { Marker } from "react-native-maps";

export default function MapViewAllMarkers() {
    const [markers, setMarkers] = useState<
        Array<{ latitude: number; longitude: number; title: string; color: string }>
    >([]);

    const [region, setRegion] = useState({
        latitude: -14.235,
        longitude: -51.925,
        latitudeDelta: 50, // Zoom para visualizar todo o Brasil
        longitudeDelta: 50,
    });

    useEffect(() => {
        const loadMarkers = async () => {
            try {
                const markersStorage = await AsyncStorage.getItem("markers");
                const savedMarkers = markersStorage ? JSON.parse(markersStorage) : [];
                setMarkers(savedMarkers);

                if (savedMarkers.length > 0) {
                    // Ajusta o mapa para mostrar os marcadores se houverem
                    setRegion((prev) => ({
                        ...prev,
                        latitude: savedMarkers[0].latitude,
                        longitude: savedMarkers[0].longitude,
                    }));
                }
            } catch (error) {
                console.error("Erro ao carregar marcadores:", error);
            }
        };

        loadMarkers();
    }, []);

    return (
        <View style={{ flex: 1 }}>
            <Text style={styles.headerText}>Mapa Geral</Text>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.title}
                        pinColor={marker.color || "red"}
                    />
                ))}
            </MapView>
        </View>
    );
}

const styles = StyleSheet.create({
    map: {
        width: "100%",
        height: "100%",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        textAlign: "center",
        marginVertical: 10,
    },
});
