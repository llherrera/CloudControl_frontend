export interface Secretary {
    id_plan: number;
    name: string;
    email: string;
    phone: number;
}

export interface PropsSecretary {
    id_plan: number;
    secretaries: Secretary[];
}