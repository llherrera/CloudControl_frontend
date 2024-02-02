import { Token } from "@/interfaces";
import jwtDecode from "jwt-decode";

export const decode = (token: string): Token => jwtDecode(token);
