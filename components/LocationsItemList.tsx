import { View, Text, StyleSheet } from "react-native";
import Pontos from "@/models/Pontos";

export default function LocationsItemList({ item }: any) {
    const { nome, latitude, longitude} = item as Pontos;
    return (
        <View style={styles.itemListContainer}>
            <View style={styles.itemListHeader}>
                <Text style={styles.itemListHeaderText}>{nome}</Text>
            </View>
            <View style={styles.itemListContent}>
                <Text style={styles.itemListHeaderText}>{latitude}</Text>
                <Text style={styles.itemListHeaderText}>{longitude}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    itemListContainer: {
        padding: 5,
        borderWidth: 1,
        borderRadius: 5,
        marginBottom: 5,
    },
    itemListHeader: {
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    itemListHeaderText: {
        fontSize: 20,
    },
    itemListContent: {
        alignItems: 'flex-end',
    }
})