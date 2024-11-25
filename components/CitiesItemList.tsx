import { View, Text, StyleSheet, Pressable } from "react-native";
import Cidade from "@/models/Cidade";

export default function CitiesItemList(props: { 
    item: Cidade | null; 
    onSelected: (cidade: Cidade) => void;
}) {
    const { item, onSelected } = props;

    // Garante que `item` não seja nulo
    if (!item) {
        return null;
    }

    const { nome, pais, data } = item;

    // Formatação da data com verificação de valor
    const atualizadoFormat = data
        ? new Date(data).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
          })
        : "Data não disponível";

    return (
        <Pressable 
            style={styles.itemListContainer} 
            onPress={() => onSelected(item)}
        >
            <View style={styles.itemListHeader}>
                <Text style={styles.itemListHeaderText}>{nome}</Text>
                <Text style={styles.itemListHeaderText}>{pais}</Text>
            </View>
            <View style={styles.itemListContent}>
                <Text>{atualizadoFormat}</Text>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    itemListContainer: {
        padding: 10,
        borderWidth: 1,
        borderRadius: 5,
        borderColor: "#ccc",
        marginBottom: 10,
        backgroundColor: "#f9f9f9",
    },
    itemListHeader: {
        paddingVertical: 5,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
    },
    itemListHeaderText: {
        fontSize: 18,
        fontWeight: "bold",
        color: "#333",
    },
    itemListContent: {
        alignItems: "flex-end",
        marginTop: 5,
    },
});
