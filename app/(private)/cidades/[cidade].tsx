import { StyleSheet, View, Text } from 'react-native';
import Cidade from "@/models/Cidade";
import CityInfo from '@/components/CityInfo';
import { useLocalSearchParams, useNavigation } from 'expo-router';
import { useEffect, useState } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CidadePage() {
    const { cidade: id } = useLocalSearchParams<{ cidade?: string }>();
    const [cidade, setCidade] = useState<Cidade | null>(null);
    const navigation = useNavigation();

    // Atualiza o título da página
    useEffect(() => {
        if (id) {
            navigation.setOptions({ title: `Cidade #${id}` });
        }
    }, [id, navigation]);

    // Carrega os dados da cidade do AsyncStorage
useEffect(() => {
    const loadCidade = async () => {
        try {
            const storedCidades = await AsyncStorage.getItem("cidades");
            if (storedCidades) {
                const cidades: Array<Cidade> = JSON.parse(storedCidades);

                // Encontra a cidade e converte `atualizado` para objeto Date
                const selectedCidade = cidades.find((c) => c.id.toString() === id);
                if (selectedCidade) {
                    setCidade({
                        ...selectedCidade,
                        data: selectedCidade.data
                            ? new Date(selectedCidade.data) // Converte a string para Date
                            : null,
                    });
                }
            }
        } catch (error) {
            console.error("Erro ao carregar a cidade:", error);
        }
    };

    loadCidade();
}, [id]);


    

    return (
        <View style={styles.container}>
            {cidade ? (
                <CityInfo cidade={cidade} />
            ) : (
                <Text style={styles.emptyText}>Cidade não encontrada</Text>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 15,
        flexDirection: 'row',
    },
    emptyText: {
        fontSize: 18,
        color: "#888",
        textAlign: "center",
        marginTop: 20,
    },
});
