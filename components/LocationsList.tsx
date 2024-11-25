import ItemList from '@/components/CitiesItemList';
import { FlatList } from 'react-native';
import Pontos from '@/models/Pontos';
import LocationsItemList from './LocationsItemList';

export default function LocationsList(props: { pontos: Array<Pontos> | null }) {
    const { pontos } = props;
    return (
            <FlatList
                data={pontos}
                renderItem={({ item }) => <LocationsItemList item={item} />}
                keyExtractor={(_, index) => `pontos_${index}`}
            />
    );
};