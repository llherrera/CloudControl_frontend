import React from "react";
import { LoginForm } from "@/components";
import { Header } from "@/components/Header";

export const LoginPage = () => {
    
    const componentes: React.ReactNode[] = [
        <LoginForm key={0}/>
    ];

    return (
        <Header components={componentes}/>
    );
}