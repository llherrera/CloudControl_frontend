export interface Secretary {
    id_secretary?: number;
    id_plan: number;
    name: string;
    email: string;
    phone: number;
}

export interface PropsSecretary {
    id_plan: number;
    secretaries: Secretary[];
}

export interface PropsUpdateSecretary {
    secretaries: Secretary[];
}

export interface NodesSecretary {
    id_node: string;
    name: string;
    parent: string | null;
    children?: NodesSecretary[];
}