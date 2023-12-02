export interface Secretary {
    id_plan: number;
    name: string;
    email: string;
    phone: string;
}

export interface PropsSecretary {
    id_plan: number;
    secretaries: Secretary[];
}