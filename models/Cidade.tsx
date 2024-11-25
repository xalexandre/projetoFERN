import Pontos from "./Pontos";

export default interface Cidade {
    id: number;
    nome: string;
    pais: string;
    atualizado: string | Date | null; // Permite string, Date ou null
    data: string | Date | null; // Permite string, Date ou null
    latitude: number;
    longitude: number;
    pontos: Array<Pontos>;
}
