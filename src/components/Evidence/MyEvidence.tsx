import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/store";
import { setEvidence, setPoints } from "@/store/evidence/evidenceSlice";

import { EvidenceProps } from "@/interfaces";

export const MyEvidence = ({evidence}: EvidenceProps) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleUpdate = () => {
        dispatch(setPoints([]));
        dispatch(setEvidence(evidence));
        navigate(`/PlanIndicativo/evidencia`);
    };

    return (
        <tr>
            <th className="tw-bg-blue-200 tw-rounded 
                            tw-my-1 tw-px-3
                            tw-border tw-border-black">
                {evidence.id_evidence}
            </th>
            <th className="tw-bg-blue-200 tw-rounded 
                            tw-my-1 tw-px-3 
                            tw-border tw-border-black">
                {evidence.code}
            </th>
            <th className="tw-bg-blue-200 tw-rounded
                            tw-my-1 tw-px-3
                            tw-border tw-border-black">
                <button onClick={handleUpdate}>
                    Editar
                </button>
            </th>
        </tr>
    );
};