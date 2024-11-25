import { useLocalSearchParams } from "expo-router";
import { Text, View } from "react-native";

export default function FormCityConfirmScreen() {

    const {nome, pais, data, passaporte} = useLocalSearchParams();

    return (
        <View>
            <Text>Confirmar Dados</Text>
            <Text>Nome: {nome}</Text>
            <Text>Pais: {pais}</Text>
            <Text>Data: {data}</Text>
            <Text>Passaporte: {passaporte}</Text>
        </View>
    );
}