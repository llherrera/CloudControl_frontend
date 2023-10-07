export interface NodoProps {
    index: number;
    id: number;
    Padre: string | null;
    callback: (index: number, Padre: (string | null)) => void;
}