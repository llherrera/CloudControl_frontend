import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/store";
import { setEvidence, setPoints } from "@/store/evidence/evidenceSlice";

import { EvidenceInterface } from "@/interfaces";

interface Props {
    evidence: EvidenceInterface;
};

export const MyEvidence = ({evidence}: Props) => {
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