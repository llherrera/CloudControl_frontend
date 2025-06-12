import { useState } from 'react';
import { thunkDeleteEvidence } from '@/store/evidence/thunks';
import { EvidenceDetailProps } from '@/interfaces';
import { useAppDispatch } from '@/store';

interface ShowEvidenceProps extends EvidenceDetailProps {
  handleEvidence: () => void;
}

export const ShowEvidence = ({ evi, handleEvidence }: ShowEvidenceProps) => {
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);

  const handleDeleteConfirm = () => {
    dispatch(thunkDeleteEvidence(evi.id_evidence));
    setShowModal(false);
    handleEvidence(); // Recarga evidencias desde el componente padre
  };

  return (
    <>
      <tr>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
          {evi.date.split('T')[0]}
        </th>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black tw-hidden lg:tw-table-cell">
          {evi.activitiesDesc}
        </th>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black tw-hidden lg:tw-table-cell">
          {evi.commune}
        </th>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black tw-hidden md:tw-table-cell">
          {evi.neighborhood}
        </th>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black tw-hidden md:tw-table-cell">
          {evi.unit}
        </th>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black tw-hidden md:tw-table-cell">
          {evi.amount}
        </th>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
          {evi.benefited_population}
        </th>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
          {evi.benefited_population_number}
        </th>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black tw-hidden md:tw-table-cell">
          {evi.date_file.split('T')[0]}
        </th>
        <th className="tw-bg-blue-200 tw-rounded tw-my-1 tw-border tw-border-black">
          <a href={evi.file_link} target="_blank" rel="noopener noreferrer">Visitar</a>
        </th>
        <th className="tw-bg-red-200 tw-rounded tw-my-1 tw-border tw-border-black">
          <button
            className="tw-bg-red-500 tw-text-white tw-px-2 tw-py-1 tw-rounded hover:tw-bg-red-700"
            onClick={() => setShowModal(true)}
          >
            Eliminar
          </button>
        </th>
      </tr>

      {showModal && (
        <div className="tw-fixed tw-inset-0 tw-bg-black/50 tw-flex tw-items-center tw-justify-center tw-z-50">
          <div className="tw-bg-white tw-rounded-lg tw-shadow-lg tw-p-6 tw-w-full tw-max-w-md">
            <h2 className="tw-text-xl tw-font-bold tw-mb-4">Confirmar eliminación</h2>
            <p className="tw-mb-4">¿Estás seguro de que deseas eliminar esta evidencia?</p>
            <div className="tw-flex tw-justify-end tw-gap-2">
              <button
                onClick={() => setShowModal(false)}
                className="tw-bg-gray-300 tw-px-4 tw-py-2 tw-rounded hover:tw-bg-gray-400"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteConfirm}
                className="tw-bg-red-600 tw-text-white tw-px-4 tw-py-2 tw-rounded hover:tw-bg-red-700"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
