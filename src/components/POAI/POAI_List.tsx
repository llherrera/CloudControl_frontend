// POAIList.tsx
import React from "react";
import { ProyectoPOAI } from "./POAI_Module";

interface Props {
  proyectos: ProyectoPOAI[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
}

const POAI_List: React.FC<Props> = ({ proyectos, onEdit, onDelete }) => {
  if (!proyectos.length) {
    return <p className="tw-text-gray-600">No hay proyectos aún.</p>;
  }

  return (
    <ul className="tw-space-y-4">
      {proyectos.map(p => (
        <li
          key={p.id}
          className="tw-bg-gray-50 tw-p-4 tw-rounded tw-shadow-sm tw-flex tw-justify-between tw-items-center"
        >
          <div>
            <h3 className="tw-text-lg tw-font-medium">{p.nombre}</h3>
            <p className="tw-text-sm tw-text-gray-700">
              {p.prioridad} • Vigencia: {p.vigencia} • ${p.presupuesto} • {p.fuenteFinanciacion}
            </p>
          </div>
          <div className="tw-space-x-2">
            <button
              onClick={() => onEdit(p.id)}
              className="tw-bg-yellow-500 tw-text-white tw-px-3 tw-py-1 tw-rounded hover:tw-bg-yellow-600 focus:tw-outline-none"
            >
              Editar
            </button>
            <button
              onClick={() => onDelete(p.id)}
              className="tw-bg-red-600 tw-text-white tw-px-3 tw-py-1 tw-rounded hover:tw-bg-red-700 focus:tw-outline-none"
            >
              Eliminar
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
};

export default POAI_List;
