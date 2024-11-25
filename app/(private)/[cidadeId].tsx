import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useGlobalSearchParams, router } from "expo-router";

export default function FormMarkerScreen() {
    const { latitude, longitude } = useGlobalSearchParams<{ latitude?: string; longitude?: string }>();

    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#FF0000");

    const saveMarker = async () => {
        try {
            const newMarker = {
                latitude: parseFloat(latitude || "0"),
                longitude: parseFloat(longitude || "0"),
                title,
                color,
            };

            const markersStorage = await AsyncStorage.getItem("markers");
            const markers = markersStorage ? JSON.parse(markersStorage) : [];
            markers.push(newMarker);
            await AsyncStorage.setItem("markers", JSON.stringify(markers));

            Alert.alert("Sucesso", "Marcador salvo com sucesso!");
            router.push("/location");
        } catch (error) {
            console.error("Erro ao salvar marcador:", error);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Título</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite o título do marcador"
                value={title}
                onChangeText={setTitle}
            />
            <Text style={styles.label}>Latitude</Text>
            <Text style={styles.info}>{latitude}</Text>
            <Text style={styles.label}>Longitude</Text>
            <Text style={styles.info}>{longitude}</Text>
            <Text style={styles.label}>Cor</Text>
            <TextInput
                style={styles.input}
                placeholder="Digite a cor (ex: #FF0000)"
                value={color}
                onChangeText={setColor}
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
        padding: 20,
    },
    label: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 5,
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 5,
        padding: 10,
        marginBottom: 15,
    },
    info: {
        fontSize: 16,
        marginBottom: 15,
    },
    saveButton: {
        backgroundColor: "#007BFF",
        padding: 15,
        borderRadius: 5,
        alignItems: "center",
    },
    saveButtonText: {
        color: "#FFF",
        fontSize: 16,
        fontWeight: "bold",
    },
});
