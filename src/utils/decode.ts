import jwtDecode from "jwt-decode";

export const decode = (token: string) => jwtDecode(token);
