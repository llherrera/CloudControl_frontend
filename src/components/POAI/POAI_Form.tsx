// POAIForm.tsx
import React, { useState, useEffect } from "react";
import { FuenteFinanciacion, ProyectoPOAI } from "./POAI_Module";

export interface FormData {
  nombre: string;
  descripcion: string;
  prioridad: "Alta" | "Media" | "Baja";
  vigencia: number;
  presupuesto: number;
  fuenteFinanciacion: FuenteFinanciacion;
}

interface Props {
  initialData?: ProyectoPOAI;
  onSubmit: (data: FormData) => void;
}

const POAI_Form: React.FC<Props> = ({ initialData, onSubmit }) => {
  const [form, setForm] = useState<FormData>({
    nombre: "",
    descripcion: "",
    prioridad: "Media",
    vigencia: new Date().getFullYear(),
    presupuesto: 0,
    fuenteFinanciacion: "Recursos propios"
  });

  useEffect(() => {
    if (initialData) {
      const { nombre, descripcion, prioridad, vigencia, presupuesto, fuenteFinanciacion } = initialData;
      setForm({ nombre, descripcion, prioridad, vigencia, presupuesto, fuenteFinanciacion });
    }
  }, [initialData]);

  const handleChange = (e: React.ChangeEvent<any>) => {
    const { name, value } = e.target;
    setForm(f => ({
      ...f,
      [name]: name === "presupuesto" || name === "vigencia" ? Number(value) : value
    }));
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit(form);
    if (!initialData) {
      // reset solo si es nuevo
      setForm({
        nombre: "",
        descripcion: "",
        prioridad: "Media",
        vigencia: new Date().getFullYear(),
        presupuesto: 0,
        fuenteFinanciacion: "Recursos propios"
      });
    }
  };

  return (
    <form onSubmit={submit} className="tw-space-y-6 tw-border tw-p-6 tw-rounded tw-shadow">
      <div className="tw-flex tw-flex-col">
        <label htmlFor="nombre" className="tw-font-medium tw-mb-2">Nombre del proyecto</label>
        <input
          id="nombre"
          name="nombre"
          type="text"
          value={form.nombre}
          onChange={handleChange}
          required
          className="tw-w-full tw-p-3 tw-border tw-rounded focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
        />
      </div>

      <div className="tw-flex tw-flex-col">
        <label htmlFor="descripcion" className="tw-font-medium tw-mb-2">Descripción</label>
        <textarea
          id="descripcion"
          name="descripcion"
          value={form.descripcion}
          onChange={handleChange}
          required
          className="tw-w-full tw-p-3 tw-border tw-rounded h-24 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
        />
      </div>

      <div className="tw-grid tw-grid-cols-2 tw-gap-6">
        <div className="tw-flex tw-flex-col">
          <label htmlFor="prioridad" className="tw-font-medium tw-mb-2">Prioridad</label>
          <select
            id="prioridad"
            name="prioridad"
            value={form.prioridad}
            onChange={handleChange}
            className="tw-w-full tw-p-3 tw-border tw-rounded focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
          >
            <option>Alta</option>
            <option>Media</option>
            <option>Baja</option>
          </select>
        </div>

        <div className="tw-flex tw-flex-col">
          <label htmlFor="vigencia" className="tw-font-medium tw-mb-2">Vigencia (Año)</label>
          <input
            id="vigencia"
            name="vigencia"
            type="number"
            value={form.vigencia}
            onChange={handleChange}
            required
            className="tw-w-full tw-p-3 tw-border tw-rounded focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
          />
        </div>

        <div className="tw-flex tw-flex-col">
          <label htmlFor="presupuesto" className="tw-font-medium tw-mb-2">Presupuesto</label>
          <input
            id="presupuesto"
            name="presupuesto"
            type="number"
            value={form.presupuesto}
            onChange={handleChange}
            required
            className="tw-w-full tw-p-3 tw-border tw-rounded focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
          />
        </div>

        <div className="tw-flex tw-flex-col">
          <label htmlFor="fuenteFinanciacion" className="tw-font-medium tw-mb-2">Fuente de financiación</label>
          <select
            id="fuenteFinanciacion"
            name="fuenteFinanciacion"
            value={form.fuenteFinanciacion}
            onChange={handleChange}
            className="tw-w-full tw-p-3 tw-border tw-rounded focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
          >
            <option>Recursos propios</option>
            <option>SGP</option>
            <option>Regalías</option>
            <option>Cofinanciación</option>
          </select>
        </div>
      </div>

      <div className="tw-text-right">
        <button
          type="submit"
          className="tw-bg-blue-600 tw-text-white tw-px-6 tw-py-3 tw-rounded-lg hover:tw-bg-blue-700 focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-400"
        >
          {initialData ? "Actualizar proyecto" : "Agregar proyecto"}
        </button>
      </div>
    </form>
  );
};

export default POAI_Form;
