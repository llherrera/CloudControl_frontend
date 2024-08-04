import { useNavigate } from "react-router-dom";
import { PQRSForm, BackBtn } from "@/components";

export const PQRSStatePage = () => {
    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    return (
        <div>
            <BackBtn handle={handleBack} id={-1}/>
            <div>
                Aqui va un input y una peticion para ver como va el PQRS
            </div>
        </div>
    );
}