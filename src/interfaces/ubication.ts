import { LocationInterface } from "./formInterfaces";

export interface Coordinates {
    lat: number;
    lng: number;
}

export interface PropsLocations {
    id_plan: number;
    locations: LocationInterface[];
    location: LocationInterface;
}