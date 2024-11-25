import { Picker } from "@react-native-picker/picker";
import { useState, useEffect } from "react";
import { Pressable, StyleSheet, Switch, Text, TextInput, View, Alert } from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import { router } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useNavigation } from "@react-navigation/native";
import MapView, { Marker, MapPressEvent, Region } from "react-native-maps";

export default function FormCityScreen() {
    const navigation = useNavigation();

    useEffect(() => {
        navigation.setOptions({ title: "Adicionar Cidade" });
    }, [navigation]);

    const [inputNome, setInputNome] = useState("");
    const [inputPais, setInputPais] = useState("Brasil");
    const [inputData, setInputData] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);
    const [inputPassaporte, setInputPassaporte] = useState(false);
    const [latitude, setLatitude] = useState(0);
    const [longitude, setLongitude] = useState(0);
    const [region, setRegion] = useState<Region>({
        latitude: -14.235, // Centro do Brasil
        longitude: -51.925, // Centro do Brasil
        latitudeDelta: 30, // Ajustado para um zoom que cobre mais área
        longitudeDelta: 30,
    });

    const listaPais = [
        { label: "Brasil", value: "BR" },
        { label: "Estados Unidos", value: "EUA" },
        { label: "França", value: "FR" },
        { label: "Espanha", value: "ES" },
        { label: "Portugal", value: "PT" },
        { label: "Itália", value: "IT" },
    ];

    const salvarCidade = async () => {
        if (!inputNome || latitude === 0 || longitude === 0) {
            Alert.alert("Erro", "Preencha todos os campos e selecione uma localização no mapa.");
            return;
        }

        try {
            const novaCidade = {
                id: Date.now().toString(),
                nome: inputNome,
                pais: inputPais,
                data: inputData.toISOString(),
                passaporte: inputPassaporte,
                latitude,
                longitude,
            };

            const cidadesExistentes = await AsyncStorage.getItem("cidades");
            const cidades = cidadesExistentes ? JSON.parse(cidadesExistentes) : [];
            cidades.push(novaCidade);
            await AsyncStorage.setItem("cidades", JSON.stringify(cidades));

            router.push("/(private)/");
        } catch (error) {
            console.error("Erro ao salvar cidade:", error);
        }
    };

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

    return (
        <View style={styles.formContainer}>
            <TextInput
                style={styles.formTextInput}
                placeholder="Nome"
                value={inputNome}
                onChangeText={setInputNome}
            />
            <View style={styles.formPickerContainer}>
                <Text>Pais: </Text>
                <Picker
                    style={styles.formPicker}
                    selectedValue={inputPais}
                    onValueChange={setInputPais}
                >
                    {listaPais.map((pais) => (
                        <Picker.Item key={pais.value} {...pais} />
                    ))}
                </Picker>
            </View>
            <Pressable
                style={styles.formDateTimePicker}
                onPress={() => setShowDatePicker(true)}
            >
                <Text style={styles.formDateTimePickerLabel}>Data</Text>
                <Text>{inputData.toLocaleDateString("pt-BR")}</Text>
            </Pressable>
            {showDatePicker && (
                <DateTimePicker
                    value={inputData}
                    onChange={(_, date) => {
                        setShowDatePicker(false);
                        if (date) setInputData(date);
                    }}
                />
            )}
            <View style={styles.switchContainer}>
                <Text style={styles.switchLabel}>Passaporte:</Text>
                <View style={styles.switchOption}>
                    <Text>Não</Text>
                    <Switch
                        value={inputPassaporte}
                        onValueChange={setInputPassaporte}
                    />
                    <Text>Sim</Text>
                </View>
            </View>
            <Text style={styles.mapInstruction}>
                Selecione uma localização no mapa:
            </Text>
            <MapView
                style={styles.map}
                region={region}
                onRegionChangeComplete={(region) => setRegion(region)}
                onPress={(event: MapPressEvent) => {
                    const { latitude, longitude } = event.nativeEvent.coordinate;
                    setLatitude(latitude);
                    setLongitude(longitude);
                }}
            >
                {latitude !== 0 && longitude !== 0 && (
                    <Marker coordinate={{ latitude, longitude }} />
                )}
            </MapView>
            <View style={styles.zoomControls}>
                <Pressable style={styles.zoomButton} onPress={zoomIn}>
                    <Text style={styles.zoomText}>+</Text>
                </Pressable>
                <Pressable style={styles.zoomButton} onPress={zoomOut}>
                    <Text style={styles.zoomText}>-</Text>
                </Pressable>
            </View>
            <Pressable style={styles.formPressableSubmit} onPress={salvarCidade}>
                <Text style={styles.formPressableSubmitLabel}>Salvar</Text>
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    formContainer: {
        paddingVertical: 5,
        paddingHorizontal: 10,
        flex: 1,
    },
    formTextInput: {
        margin: 4,
        padding: 8,
        borderRadius: 5,
        backgroundColor: "#caf0f8",
    },
    formPickerContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    formPicker: {
        flex: 1,
    },
    formDateTimePicker: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    formDateTimePickerLabel: {
        flex: 1,
    },
    switchContainer: {
        flexDirection: "row",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    switchLabel: {
        flex: 1,
    },
    switchOption: {
        flexDirection: "row",
        alignItems: "center",
    },
    map: {
        width: "100%",
        height: 200,
        marginVertical: 10,
    },
    mapInstruction: {
        textAlign: "center",
        marginVertical: 5,
        fontSize: 16,
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
    formPressableSubmit: {
        backgroundColor: "#8cd867",
        margin: 20,
        padding: 5,
        borderRadius: 5,
    },
    formPressableSubmitLabel: {
        textAlign: "center",
    },
});
