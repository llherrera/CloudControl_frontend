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

    const handleStateEvi = (state: number) => (state === 1 ? "Aprobado" : "Rechazado");
    const handleColorCla = (state: number) => (state === 1 ? 'tw-bg-greenBtn': 'tw-bg-redBtn');

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
            <th className={`tw-rounded 
                            tw-my-1 tw-px-3
                            tw-border tw-border-black
                            ${evidence.state === 0 ? 
                            'tw-bg-gray-300': handleColorCla(evidence.state)}`}>
                {evidence.state === 0 ? "Pendiente" : handleStateEvi(evidence.state)}
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