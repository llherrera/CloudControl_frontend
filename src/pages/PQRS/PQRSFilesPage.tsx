import { useNavigate } from "react-router-dom";
import { PQRSForm, BackBtn, UnitFrame } from "@/components";

export const PQRSFiledPage = () => {
    const navigate = useNavigate();

    const handleBack = () => navigate(-1);

    return (
        <UnitFrame>
            <BackBtn handle={handleBack} id={-1}/>
            <PQRSForm/>
        </UnitFrame>
    );
}