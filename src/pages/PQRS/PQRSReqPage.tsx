import { BackBtn } from "@/components/Citizen";
import { useNavigate } from "react-router-dom";

export const PQRSReqPage = () => {
    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    return (
        <div>
            <BackBtn handle={handleBack} id={-1}/>
            Lista de radicados
        </div>
    );
}