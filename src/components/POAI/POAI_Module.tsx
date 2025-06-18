// POAIModule.tsx
import React, { useState } from "react";
import POAIForm from "./POAI_Form";
import POAIList from "./POAI_List";

export type FuenteFinanciacion = "Recursos propios" | "SGP" | "Regalías" | "Cofinanciación";

export interface ProyectoPOAI {
  id: string;
  nombre: string;
  descripcion: string;
  prioridad: "Alta" | "Media" | "Baja";
  vigencia: number;
  presupuesto: number;
  fuenteFinanciacion: FuenteFinanciacion;
  estado: "Borrador" | "Priorizado" | "Aprobado";
}

const POAIModule: React.FC = () => {
    const [proyectos, setProyectos] = useState<ProyectoPOAI[]>([]);
    const [editProyecto, setEditProyecto] = useState<ProyectoPOAI | null>(null);
    const [activeTab, setActiveTab] = useState<"list" | "form">("list");
  
    const addOrUpdateProyecto = (data: Omit<ProyectoPOAI, "id" | "estado">) => {
      if (editProyecto) {
        setProyectos(prev =>
          prev.map(p =>
            p.id === editProyecto.id ? { ...p, ...data } : p
          )
        );
        setEditProyecto(null);
      } else {
        const nuevo: ProyectoPOAI = {
          id: Date.now().toString(),
          estado: "Borrador",
          ...data
        };
        setProyectos(prev => [...prev, nuevo]);
      }
      // tras añadir o editar, volver a pestaña de listado
      setActiveTab("list");
    };
  
    const onEdit = (id: string) => {
      const p = proyectos.find(x => x.id === id) || null;
      setEditProyecto(p);
      setActiveTab("form");
    };
  
    const onDelete = (id: string) => {
      setProyectos(prev => prev.filter(p => p.id !== id));
      if (editProyecto?.id === id) {
        setEditProyecto(null);
        setActiveTab("list");
      }
    };
  
    return (
      <div className="tw-p-4 tw-bg-white tw-rounded-lg tw-shadow-lg tw-m-12">
        <h1 className="tw-text-2xl tw-font-bold tw-mb-6">Módulo POAI</h1>
  
        {/* Tabs */}
        <div className="tw-flex tw-border-b tw-mb-6">
          <button
            onClick={() => setActiveTab("list")}
            className={`
              tw-py-2 tw-px-4 tw-font-medium 
              ${activeTab === "list"
                ? "tw-border-b-2 tw-border-blue-600 tw-text-blue-600"
                : "tw-text-gray-600 hover:tw-text-blue-600"}
            `}
          >
            Ver proyectos
          </button>
          <button
            onClick={() => {
              setEditProyecto(null);
              setActiveTab("form");
            }}
            className={`
              tw-py-2 tw-px-4 tw-font-medium 
              ${activeTab === "form"
                ? "tw-border-b-2 tw-border-blue-600 tw-text-blue-600"
                : "tw-text-gray-600 hover:tw-text-blue-600"}
            `}
          >
            Añadir proyecto
          </button>
        </div>
  
        {/* Panels */}
        <div className="tw-relative tw-min-h-[300px]">
          {/* Listado */}
          <div
            className={`
              tw-transition-opacity tw-duration-500 
              ${activeTab === "list" ? "tw-opacity-100 tw-block" : "tw-opacity-0 tw-pointer-events-none tw-absolute tw-inset-0"}
            `}
          >
            <h2 className="tw-text-xl tw-font-semibold tw-mb-4">Proyectos registrados</h2>
            <POAIList
              proyectos={proyectos}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          </div>
  
          {/* Formulario */}
          <div
            className={`
              tw-transition-opacity tw-duration-500 
              ${activeTab === "form" ? "tw-opacity-100 tw-block" : "tw-opacity-0 tw-pointer-events-none tw-absolute tw-inset-0"}
            `}
          >
            <POAIForm
              key={editProyecto ? editProyecto.id : "new"}
              onSubmit={addOrUpdateProyecto}
              initialData={editProyecto || undefined}
            />
          </div>
        </div>
      </div>
    );
  };
  
export default POAIModule;
