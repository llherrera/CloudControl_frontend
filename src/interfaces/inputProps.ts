export interface InputProps {
    type: string;
    label: string;
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>, index:(number | void)) => void;
    isRequired?: boolean;
}
