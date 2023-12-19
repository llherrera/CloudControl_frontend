import { useNavigate } from "react-router-dom";

import { useAppDispatch } from "@/store";
import { setEvidence } from "@/store/evidence/evidenceSlice";

import { EvidenceInterface } from "@/interfaces";

interface Props {
    evidence: EvidenceInterface;
}

export const MyEvidence = (props: Props) => {
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const { evidence } = props;

    const handleUpdate = () => {
        dispatch(setEvidence(evidence));
        navigate(`/PlanIndicativo/evidencia`);
    };

    return (
        <tr>
            <th className="tw-bg-blue-200 tw-rounded 
                            tw-my-1 tw-px-3
                            tw-border tw-border-black">
                {evidence.id_evidencia}
            </th>
            <th className="tw-bg-blue-200 tw-rounded 
                            tw-my-1 tw-px-3 
                            tw-border tw-border-black">
                {evidence.codigo}
            </th>
            <th className={`tw-rounded 
                            tw-my-1 tw-px-3
                            tw-border tw-border-black
                            ${evidence.estado === 0 ? 'tw-bg-gray-300': 
                            evidence.estado === 1 ? 'tw-bg-greenBtn': 'tw-bg-redBtn'}`}>
                {evidence.estado === 0 ? "Pendiente" : evidence.estado === 1 ? "Aprobado" : "Rechazado"}
            </th>
            <th className="tw-bg-blue-200 tw-rounded
                            tw-my-1 tw-px-3
                            tw-border tw-border-black">
                <button
                    onClick={handleUpdate}>
                    Ver
                </button>
            </th>
        </tr>
    );
};