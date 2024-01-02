import { useNavigate } from "react-router-dom";

import { useAppDispatch, useAppSelector } from "@/store";
import { setEvidence } from "@/store/evidence/evidenceSlice";

import { EvidenceForm, BackBtn } from "@/components";

export const UpdateEvidence = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { evi_selected } = useAppSelector(store => store.evidence);

    const handleCancel = () => {
        dispatch(setEvidence(undefined));
        navigate(-1);
    };

    return (
        (evi_selected !== undefined) ? (
            <div>
                <p className="  tw-text-center tw-text-2xl
                                tw-font-bold
                                tw-mt-3 ">
                    <BackBtn id={evi_selected.id_evidence} handle={handleCancel} />
                    Actualizar Evidencia
                </p>
                <EvidenceForm/>
            </div>
        ) : (
            <div>
                <BackBtn id={0} handle={handleCancel} />
                <h1>No hay evidencia seleccionada</h1>
            </div>
        )
    );
}