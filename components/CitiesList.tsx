import { FlatList } from 'react-native';
import Cidade from "@/models/Cidade";
import CitiesItemList from '@/components/CitiesItemList';

export default function CitiesList(
    props: { 
        cidades: Array<Cidade> | null, 
        onSelected: (cidade: Cidade) => void 
    }) {
    const { cidades, onSelected } = props;
    return (
        <FlatList
            data={cidades}
            renderItem={({ item }) => <CitiesItemList item={item} onSelected={onSelected} />}
            keyExtractor={item => (item as Cidade).id.toString()}
        />
    );
};