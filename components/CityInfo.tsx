import { StyleSheet, Text, View } from "react-native";
import Cidade from "@/models/Cidade";
import LocationsList from "./LocationsList";

export default function CityInfo(props: { cidade: Cidade }) {
    const { cidade } = props;
    const { nome, pais, pontos, data } = cidade;

    // Formatação da data
    const atualizadoFormat = data
        ? new Date(data).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
          })
        : "Data não disponível";

    return (
        <View style={styles.cityInfoContainer}>
            <Text style={styles.cityName}>{nome}</Text>
            <Text style={styles.cityCountry}>{pais}</Text>
            <Text style={styles.cityDate}>Última atualização: {atualizadoFormat}</Text>
            {pontos && <LocationsList pontos={pontos} />}
        </View>
    );
}

const styles = StyleSheet.create({
    cityInfoContainer: {
        flex: 1,
        paddingTop: 30,
        paddingHorizontal: 15,
    },
    cityName: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 5,
    },
    cityCountry: {
        fontSize: 16,
        color: "#555",
        marginBottom: 5,
    },
    cityDate: {
        fontSize: 14,
        color: "#888",
        marginBottom: 15,
    },
});
