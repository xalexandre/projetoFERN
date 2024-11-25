import { useEffect, useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalSearchParams, useNavigation, router } from "expo-router";

export default function FormMarkerScreen() {
    const { latitude, longitude, cityName } = useGlobalSearchParams<{
        latitude: string;
        longitude: string;
        cityName: string;
    }>();

    const navigation = useNavigation();

    const [title, setTitle] = useState("");
    const [markerColor, setMarkerColor] = useState("#FF0000");

    useEffect(() => {
        // Atualiza o título da página com o nome do marcador
        navigation.setOptions({ title: cityName || "Editar Marcador" });

        // Carregar dados do marcador existente para edição
        const loadMarkerData = async () => {
            try {
                const markersStorage = await AsyncStorage.getItem("markers");
                const markersList = markersStorage ? JSON.parse(markersStorage) : [];

                const existingMarker = markersList.find(
                    (marker: any) =>
                        marker.latitude === parseFloat(latitude) &&
                        marker.longitude === parseFloat(longitude)
                );

                if (existingMarker) {
                    setTitle(existingMarker.title || "");
                    setMarkerColor(existingMarker.color || "#FF0000");
                }
            } catch (error) {
                console.error("Erro ao carregar os dados do marcador:", error);
                Alert.alert("Erro", "Não foi possível carregar os dados do marcador.");
            }
        };

        loadMarkerData();
    }, [latitude, longitude, navigation, cityName]);

    const saveMarker = async () => {
        try {
            const newMarker = {
                title,
                latitude: parseFloat(latitude),
                longitude: parseFloat(longitude),
                color: markerColor,
            };

            // Carregar marcadores existentes
            const markersStorage = await AsyncStorage.getItem("markers");
            const markersList = markersStorage ? JSON.parse(markersStorage) : [];

            // Verifica se o marcador já existe (edição)
            const markerIndex = markersList.findIndex(
                (marker: any) =>
                    marker.latitude === newMarker.latitude &&
                    marker.longitude === newMarker.longitude
            );

            if (markerIndex !== -1) {
                // Atualiza o marcador existente
                markersList[markerIndex] = newMarker;
            } else {
                // Adiciona um novo marcador
                markersList.push(newMarker);
            }

            // Salvar no AsyncStorage
            await AsyncStorage.setItem("markers", JSON.stringify(markersList));

            // Redirecionar de volta para o mapa geral
            router.back();
        } catch (error) {
            console.error("Erro ao salvar o marcador:", error);
            Alert.alert("Erro", "Não foi possível salvar o marcador.");
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título do Local</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o título do local"
                value={title}
                onChangeText={setTitle}
            />

            <Text style={styles.label}>Latitude</Text>
            <TextInput
                style={styles.input}
                value={latitude}
                editable={false} // Campo apenas para visualização
            />

            <Text style={styles.label}>Longitude</Text>
            <TextInput
                style={styles.input}
                value={longitude}
                editable={false} // Campo apenas para visualização
            />

            <Text style={styles.label}>Cor do Marcador</Text>
            <TextInput
                style={[styles.input, { backgroundColor: markerColor }]}
                placeholder="#FF0000"
                value={markerColor}
                onChangeText={setMarkerColor}
            />

            <Pressable style={styles.saveButton} onPress={saveMarker}>
                <Text style={styles.saveButtonText}>Salvar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 16,
        backgroundColor: "#fff",
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
    },
    input: {
        height: 40,
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        paddingHorizontal: 10,
        marginBottom: 16,
    },
    saveButton: {
        backgroundColor: "#8cd867",
        padding: 12,
        borderRadius: 5,
        alignItems: "center",
    },
    saveButtonText: {
        fontSize: 16,
        fontWeight: "bold",
        color: "#fff",
    },
});
