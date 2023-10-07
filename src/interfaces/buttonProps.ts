export interface ButtonProps {
    lado : String,
    dir : String
}

export interface ButtonPlanProps {
    handleButton: (e: React.MouseEvent<HTMLButtonElement>) => void;
    text: string;
}