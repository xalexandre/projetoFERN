import { useEffect, useState } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import * as Location from "expo-location";
import MapView, { Marker, MapPressEvent, LatLng, Region } from "react-native-maps";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalSearchParams, router, useNavigation } from "expo-router";

export default function LocationScreen() {
    const { latitude, longitude, nome } = useGlobalSearchParams<{ latitude?: string; longitude?: string; nome?: string }>();
    const navigation = useNavigation();

    const [markers, setMarkers] = useState<Array<{ latitude: number; longitude: number; title: string; color: string }>>([]);
    const [region, setRegion] = useState<Region>({
        latitude: latitude ? parseFloat(latitude) : 0,
        longitude: longitude ? parseFloat(longitude) : 0,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
    });

    // Atualizar o título da página com o nome da cidade
    useEffect(() => {
        const cityName = nome || "Localização"; // Nome da cidade ou "Localização" como fallback
        navigation.setOptions({
            title: nome,
        });
    }, [nome, navigation]);

    // Carregar marcadores do AsyncStorage
    useEffect(() => {
        const loadMarkers = async () => {
            const markersStorage = await AsyncStorage.getItem("markers");
            const markersList = markersStorage ? JSON.parse(markersStorage) : [];
            setMarkers(markersList);

            // Atualiza o centro do mapa para a cidade inicial
            if (latitude && longitude) {
                setRegion((prev) => ({
                    ...prev,
                    latitude: parseFloat(latitude),
                    longitude: parseFloat(longitude),
                }));
            } else if (markersList.length > 0) {
                const lastMarker = markersList[markersList.length - 1];
                setRegion((prev) => ({
                    ...prev,
                    latitude: lastMarker.latitude,
                    longitude: lastMarker.longitude,
                }));
            }
        };

        loadMarkers();
    }, [latitude, longitude]);

    // Funções de controle de zoom
    const zoomIn = () => {
        setRegion((prev) => ({
            ...prev,
            latitudeDelta: Math.max(prev.latitudeDelta / 2, 0.01), // Limita o zoom máximo
            longitudeDelta: Math.max(prev.longitudeDelta / 2, 0.01),
        }));
    };

    const zoomOut = () => {
        setRegion((prev) => ({
            ...prev,
            latitudeDelta: prev.latitudeDelta * 2,
            longitudeDelta: prev.longitudeDelta * 2,
        }));
    };

    const handleMapPress = (mapPress: MapPressEvent) => {
        const { coordinate } = mapPress.nativeEvent;

        // Redireciona para formMarker.tsx com os parâmetros
        router.push({
            pathname: "/formMarker",
            params: {
                latitude: coordinate.latitude.toString(),
                longitude: coordinate.longitude.toString(),
                cityName: nome, // Passa o nome da cidade
            },
        });
    };

    return (
        <View style={{ flex: 1 }}>
            <Text>Localização</Text>
            <Text>Longitude: {region.longitude}</Text>
            <Text>Latitude: {region.latitude}</Text>
            <Text>Marcadores: {markers.length}</Text>
            <MapView
                style={styles.locationMapView}
                region={region}
                onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                showsUserLocation
                onPress={handleMapPress}
            >
                {markers.map((marker, index) => (
                    <Marker
                        key={index}
                        coordinate={{ latitude: marker.latitude, longitude: marker.longitude }}
                        title={marker.title}
                        pinColor={marker.color}
                    />
                ))}
            </MapView>
            <View style={styles.zoomControls}>
                <Pressable style={styles.zoomButton} onPress={zoomIn}>
                    <Text style={styles.zoomText}>+</Text>
                </Pressable>
                <Pressable style={styles.zoomButton} onPress={zoomOut}>
                    <Text style={styles.zoomText}>-</Text>
                </Pressable>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    locationMapView: {
        width: "100%",
        height: "70%",
    },
    zoomControls: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginVertical: 10,
    },
    zoomButton: {
        backgroundColor: "#8cd867",
        padding: 10,
        borderRadius: 5,
    },
    zoomText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#fff",
    },
    backButton: {
        fontSize: 16,
        color: "#007BFF",
        marginLeft: 10,
    },
});
