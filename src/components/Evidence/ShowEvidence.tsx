import { useState, useEffect } from 'react';
import { thunkDeleteEvidence } from '@/store/evidence/thunks';
import { EvidenceDetailProps } from '@/interfaces';
import { useAppDispatch, useAppSelector } from '@/store';
import { decode } from "@/utils";

interface ShowEvidenceProps extends EvidenceDetailProps {
  handleEvidence: () => void;
}

export const ShowEvidence = ({ evi, handleEvidence }: ShowEvidenceProps) => {
  const dispatch = useAppDispatch();
  const { token_info } = useAppSelector(store => store.auth);
  const { id_plan } = useAppSelector(store => store.content);

  const [showModal, setShowModal] = useState(false);
  const [rol, setRol] = useState("");
  const [user, setUser] = useState("");
  const [id, setId] = useState(0);

  useEffect(() => {
    if (token_info?.token !== undefined) {
      const decoded = decode(token_info.token);
      setRol(decoded.rol);
      setId(decoded.id_plan);
      setUser(decoded.user);
    }
  }, []);

  const handleDeleteConfirm = () => {
    dispatch(thunkDeleteEvidence(evi.id_evidence));
    setShowModal(false);
    handleEvidence(); // Recarga evidencias desde el componente padre
  };

  return (
    <>
      <tr>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600">
          {evi.date.split('T')[0]}
        </th>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600 tw-hidden lg:tw-table-cell">
          {evi.activitiesDesc}
        </th>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600 tw-hidden lg:tw-table-cell">
          {evi.commune}
        </th>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600 tw-hidden md:tw-table-cell">
          {evi.neighborhood}
        </th>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600 tw-hidden md:tw-table-cell">
          {evi.unit}
        </th>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600 tw-hidden md:tw-table-cell">
          {evi.amount}
        </th>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600">
          {evi.benefited_population}
        </th>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600">
          {evi.benefited_population_number}
        </th>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600 tw-hidden md:tw-table-cell">
          {evi.date_file.split('T')[0]}
        </th>
        <th className="tw-bg-white tw-px-2 tw-rounded tw-my-1 tw-border tw-border-gray-600">
          <a href={evi.file_link} target="_blank" rel="noopener noreferrer">Visitar</a>
        </th>
        {rol === 'admin' || (rol === 'funcionario' && id === id_plan) ?
          <th className="tw-bg-red-200 tw-rounded tw-px-2 tw-my-1 tw-border tw-border-gray-600">
            <button
              className="tw-bg-red-500 tw-text-white tw-p-1 tw-rounded tw-transition tw-duration-150 hover:tw-bg-red-700 active:tw-bg-red-800 active:tw-scale-95 "
              onClick={() => setShowModal(true)}
            >
              Eliminar
            </button>
          </th> : null
        }
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
