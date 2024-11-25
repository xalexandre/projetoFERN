import { useContext, useState, useEffect } from "react";
import {
    StyleSheet,
    View,
    Text,
    useWindowDimensions,
    Pressable,
    Alert,
    Dimensions,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Cidade from "@/models/Cidade";
import CitiesList from "@/components/CitiesList";
import MapView, { Marker, Region } from "react-native-maps"; // Mapa Geral
import { useRouter } from "expo-router";
import { CitiesContext, CitiesContextState } from "@/context/CitiesContext";
import { useFocusEffect } from "@react-navigation/native";

export default function PrivateScreen() {
    const { cities: initialCidades } = useContext(CitiesContext) as CitiesContextState;
    const [cidades, setCidades] = useState(initialCidades);
    const [cidadeSelecionada, setCidadeSelecionada] = useState<Cidade | null>(null);
    const { width, height } = useWindowDimensions();
    const isPortrait = height > width; // Verifica orientação
    const router = useRouter();
    const [markers, setMarkers] = useState<
        Array<{ latitude: number; longitude: number; title: string; color: string }>
    >([]);
    const [region, setRegion] = useState<Region>({
        latitude: -14.235, // Centralizado no Brasil
        longitude: -51.925,
        latitudeDelta: 50,
        longitudeDelta: 50,
    });

    // Carregar marcadores do AsyncStorage
    useEffect(() => {
        const loadMarkers = async () => {
            try {
                const markersStorage = await AsyncStorage.getItem("markers");
                const markersList = markersStorage ? JSON.parse(markersStorage) : [];
                setMarkers(markersList);
            } catch (error) {
                console.error("Erro ao carregar marcadores:", error);
            }
        };

        loadMarkers();
    }, []);

    // Função para carregar as cidades do AsyncStorage
    const loadCidades = async () => {
        try {
            const storedCidades = await AsyncStorage.getItem("cidades");
            const parsedCidades = storedCidades ? JSON.parse(storedCidades) : [];
            setCidades(parsedCidades);
        } catch (error) {
            console.error("Erro ao carregar cidades:", error);
        }
    };

    // Recarregar cidades ao montar o componente
    useEffect(() => {
        loadCidades();
    }, []);

    // Recarregar cidades ao retornar para a tela
    useFocusEffect(() => {
        loadCidades();
    });

    const selecionarCidade = (cidade: Cidade) => {
        setCidadeSelecionada(cidade);

        // No modo paisagem, centraliza o mapa na cidade clicada
        if (!isPortrait) {
            setRegion((prevRegion) => ({
                ...prevRegion,
                latitude: cidade.latitude,
                longitude: cidade.longitude,
                latitudeDelta: 0.05, // Ajusta o zoom para centralizar na cidade
                longitudeDelta: 0.05,
            }));
        } else {
            // No modo retrato, redireciona para a tela de localização
            router.push({
                pathname: "/(private)/location",
                params: {
                    latitude: cidade.latitude.toString(),
                    longitude: cidade.longitude.toString(),
                    nome: cidade.nome.toString(),
                },
            });
        }
    };

    const limparStorage = async () => {
        try {
            await AsyncStorage.clear();
            Alert.alert("Sucesso", "Todos os dados foram removidos!", [
                {
                    text: "OK",
                    onPress: () => {
                        setCidades([]); // Atualiza a lista local
                        setMarkers([]); // Remove marcadores também
                    },
                },
            ]);
        } catch (error) {
            Alert.alert("Erro", "Não foi possível limpar os dados.");
            console.error("Erro ao limpar o AsyncStorage:", error);
        }
    };

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

    return (
        <View style={styles.container}>
            {/* Lista de cidades */}
            <View style={isPortrait ? styles.containerListPortaint : styles.containerListLandscape}>
                <Text style={styles.headerText}>Cidades</Text>

                {/* Exibir lista de cidades ou mensagem de vazio */}
                {cidades.length === 0 ? (
                    <Text style={styles.emptyText}>Adicione a cidade!</Text>
                ) : (
                    <CitiesList cidades={cidades} onSelected={selecionarCidade} />
                )}

                {/* Botão para adicionar cidade */}
                <Pressable style={styles.fabToForm} onPress={() => router.push("/(private)/formCity")}>
                    <Text style={styles.fabToLocationLabel}>Adicionar Cidade</Text>
                </Pressable>

                {/* Botão para limpar o AsyncStorage */}
                <Pressable style={styles.clearButton} onPress={limparStorage}>
                    <Text style={styles.clearButtonText}>Remover Cidades</Text>
                </Pressable>
            </View>

            {/* Mapa Geral no modo paisagem */}
            {!isPortrait && (
                <View style={styles.containerMapLandscape}>
                    <MapView
                        style={styles.mapView}
                        region={region}
                        onRegionChangeComplete={(newRegion) => setRegion(newRegion)}
                    >
                        {markers.map((marker, index) => (
                            <Marker
                                key={index}
                                coordinate={{
                                    latitude: marker.latitude,
                                    longitude: marker.longitude,
                                }}
                                title={marker.title}
                                pinColor={marker.color || "red"}
                                onPress={() => {
                                    // Redireciona para edição do marcador
                                    router.push({
                                        pathname: "/formMarker",
                                        params: {
                                            latitude: marker.latitude.toString(),
                                            longitude: marker.longitude.toString(),
                                            cityName: marker.title, // Nome do marcador
                                            color: marker.color, // Cor do marcador
                                        },
                                    });
                                }}
                            />
                        ))}
                        {cidadeSelecionada && (
                            <Marker
                                coordinate={{
                                    latitude: cidadeSelecionada.latitude,
                                    longitude: cidadeSelecionada.longitude,
                                }}
                                title={cidadeSelecionada.nome}
                                pinColor="blue"
                            />
                        )}
                    </MapView>

                    {/* Botões de controle de zoom */}
                    <View style={styles.zoomControls}>
                        <Pressable style={styles.zoomButton} onPress={zoomIn}>
                            <Text style={styles.zoomText}>+</Text>
                        </Pressable>
                        <Pressable style={styles.zoomButton} onPress={zoomOut}>
                            <Text style={styles.zoomText}>-</Text>
                        </Pressable>
                    </View>
                </View>
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 15,
        flexDirection: "row",
    },
    containerListPortaint: {
        width: "100%",
    },
    containerListLandscape: {
        width: "30%",
    },
    containerMapLandscape: {
        flex: 1,
        marginLeft: 10,
    },
    mapView: {
        width: "100%",
        height: "70%", // Reduz a altura do mapa
        borderRadius: 10,
    },
    zoomControls: {
        flexDirection: "row",
        justifyContent: "space-evenly",
        marginTop: 10,
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
    fabToForm: {
        position: "absolute",
        right: 10,
        bottom: 80,
        backgroundColor: "#7cb518",
        padding: 10,
        borderRadius: 50,
    },
    fabToLocationLabel: {
        fontSize: 20,
        color: "#fff",
        textAlign: "center",
    },
    clearButton: {
        position: "absolute",
        left: 10,
        bottom: 80,
        backgroundColor: "#ff6b6b",
        padding: 10,
        borderRadius: 50,
    },
    clearButtonText: {
        fontSize: 16,
        color: "#fff",
        textAlign: "center",
    },
    headerText: {
        fontSize: 24,
        fontWeight: "bold",
        marginBottom: 10,
    },
    emptyText: {
        fontSize: 18,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
});
