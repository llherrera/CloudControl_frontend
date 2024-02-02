import React from "react";
import { useNavigate } from "react-router-dom";
import { Header, BackBtn } from "@/components";

export const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    const notFound: React.ReactNode[] = [
        <div key={0}>
            <h1>404</h1>
            <h2>Page not found</h2>
            <BackBtn handle={handleBack} id={1}/>
        </div>
    ];

    return (
        <Header components={notFound}/>
    );
};