import React from "react";
import { LoginForm } from "@/components";
import { Header } from "@/components/Header";

export const LoginPage = () => {
    
    const componentes: React.ReactNode[] = [
        <LoginForm/>
    ];

    return (
        <Header components={componentes}/>
    );
}