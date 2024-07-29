import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

export const SearchPage = () => {
    const { uuid } = useParams();

    return (
        <div>
            <h1>uuid: {uuid}</h1>
        </div>
    );
}