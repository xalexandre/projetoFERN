import Cidade from "@/models/Cidade";
import { ReactNode, createContext, useReducer, useEffect, Dispatch } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Interface para o estado do contexto
export interface CitiesContextState {
    cities: Array<Cidade>;
    city: Cidade | null;
}

// Tipagem das ações possíveis no reducer
export type CitiesAction =
    | { type: "set"; cities: Array<Cidade> }
    | { type: "added"; city: Cidade }
    | { type: "changed"; city: Cidade }
    | { type: "deleted"; city: Cidade };

// Contextos para estado e dispatch
export const CitiesContext = createContext<CitiesContextState | null>(null);
export const CitiesDispatchContext = createContext<Dispatch<CitiesAction> | null>(null);

// Reducer para gerenciar ações no estado de cidades
function CitiesReducer(state: Array<Cidade>, action: CitiesAction): Array<Cidade> {
    switch (action.type) {
        case "set":
            return action.cities || [];
        case "added":
            return action.city ? [...state, action.city] : state;
        case "changed":
            return state.map((t) => (t.id === action.city.id ? action.city : t));
        case "deleted":
            return state.filter((t) => t.id !== action.city.id);
        default:
            throw new Error(`Unknown action type: ${(action as any).type}`);
    }
}

// Provider do CitiesContext
export default function CitiesContextProvider(props: { children: ReactNode }) {
    const { children } = props;

    // Inicialização explícita do estado e do reducer
    const [cities, dispatch] = useReducer(CitiesReducer, []);

    // Função para carregar cidades do AsyncStorage
    const loadCities = async () => {
        try {
            const storedCities = await AsyncStorage.getItem("cidades");
            const parsedCities = storedCities ? JSON.parse(storedCities) : [];
            dispatch({ type: "set", cities: parsedCities });
        } catch (error) {
            console.error("Erro ao carregar cidades:", error);
        }
    };

    // Salva as cidades no AsyncStorage
    const saveToStorage = async (updatedCities: Array<Cidade>) => {
        try {
            await AsyncStorage.setItem("cidades", JSON.stringify(updatedCities));
        } catch (error) {
            console.error("Erro ao salvar no AsyncStorage:", error);
        }
    };

    // Carrega as cidades ao montar o componente
    useEffect(() => {
        loadCities();
    }, []);

    // Sincroniza automaticamente o estado com o AsyncStorage
    useEffect(() => {
        saveToStorage(cities);
    }, [cities]);

    return (
        <CitiesContext.Provider value={{ cities, city: null }}>
            <CitiesDispatchContext.Provider value={dispatch}>
                {children}
            </CitiesDispatchContext.Provider>
        </CitiesContext.Provider>
    );
}
