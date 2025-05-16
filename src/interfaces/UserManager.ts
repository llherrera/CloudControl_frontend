export interface User {
    id_user: number;
    office: string;
    isActive: boolean;
    name: string;
    lastname: string;
    email: string;
    rol: string;
    modulesAccess: boolean[];
}