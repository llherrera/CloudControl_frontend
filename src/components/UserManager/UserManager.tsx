import React, { useEffect, useState, useCallback } from "react";
import { useAppDispatch, useAppSelector } from "@/store";
import { RegisterFormUser } from "@/components/Forms/RegisterFormUser";
import UserTable from "./UserTable";
import UserEditModal from "./UserEditModal";
import { User } from "@/interfaces";
import {
  thunkGetModulosUsuarioById,
  thunkGetUsersByPlan,
  thunkGetActiveSessions,
} from "@/store/pqrs/thunks";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import ArrowBackIos from "@mui/icons-material/ArrowBackIos";
import SessionsTable from "./SessionTable";
import { useSessionActivity, useSessionEvents, useSessionCleanup } from "@/utils/sessionHooks";
import AdvancedSessionDataModal from "./AdvancedSessionDataModal";

export const UserManager: React.FC = () => {
  const navigate = useNavigate();
  const { id_plan } = useAppSelector((store) => store.content);
  const [selectedPanel, setSelectedPanel] = useState<"register" | "edit" | "sessions" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const dispatch = useAppDispatch();
  const [users, setUsers] = useState<User[]>([]);
  const [isAdvancedModalOpen, setIsAdvancedModalOpen] = useState(false);

  // Hooks de sesión
  const { updateTabsCount } = useSessionActivity();
  const { trackNavigation, trackClick } = useSessionEvents();
  useSessionCleanup(); // Manejar cierre de sesión al salir

  const fetchUsers = useCallback(async () => {
    try {
      const result: any = await dispatch(thunkGetUsersByPlan(id_plan)).unwrap();
      setUsers(result);
    } catch (error: any) {
      console.error("Error al obtener usuarios:", error);
    }
  }, [dispatch, id_plan]);

  useEffect(() => {
    fetchUsers();
  }, [fetchUsers]);

  const handlePanelChange = (panel: "register" | "edit" | "sessions" | null) => {
    setIsAnimating(true);
    setSelectedPanel(panel);

    // Tracking de navegación
    if (panel) {
      trackNavigation(`UserManager - ${panel}`);
    }

    if (panel === "edit" || panel === null) {
      fetchUsers();
    }

    setTimeout(() => setIsAnimating(false), 300);
  };

  const handleEditUser = (user: User) => {
    const userID = user.id_user;
    dispatch(thunkGetModulosUsuarioById(userID))
      .unwrap()
      .then((result: any) => {
        const modulesAccess = Object.values(result[0]) as boolean[];
        setEditingUser({ ...user, modulesAccess });
      })
      .catch((error: any) => {
        console.error("Error al obtener módulos:", error);
      });
  };

  const handleSaveUser = async (updatedUser: User) => {
    setEditingUser(null);
    await fetchUsers();
  };

  const handleBack = () => navigate(-1);

  return (
    <div className="tw-container tw-mx-auto tw-p-4 tw-pt-12">
      <div className="tw-bg-white tw-rounded-lg tw-shadow-md tw-p-6 tw-w-full">
        <div className="tw-relative tw-flex tw-items-center tw-justify-center tw-mb-6">
          <div className="tw-absolute tw-left-0">
            <IconButton
              aria-label="regresar"
              size="small"
              color="secondary"
              onClick={() => {
                trackClick("Back Button");
                handleBack();
              }}
              title="Regresar"
            >
              <ArrowBackIos />
            </IconButton>
          </div>
          <h1 className="tw-text-2xl tw-font-bold tw-text-gray-800">Gestión de Usuarios</h1>
        </div>

        <div className="tw-grid tw-grid-cols-3 tw-gap-8 tw-mb-6">
          <button
            onClick={() => {
              trackClick("Edit Users Button");
              handlePanelChange(selectedPanel === "edit" ? null : "edit");
            }}
            className={`tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold tw-text-center
              tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-shadow-lg
              ${
                selectedPanel === "edit"
                  ? "tw-bg-green-500 tw-text-white tw-scale-105 tw-shadow-md"
                  : "tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300"
              }`}
          >
            Editar Usuarios
          </button>

          <button
            onClick={() => {
              trackClick("Register User Button");
              handlePanelChange(selectedPanel === "register" ? null : "register");
            }}
            className={`tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold tw-text-center
              tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-shadow-lg
              ${
                selectedPanel === "register"
                  ? "tw-bg-green-500 tw-text-white tw-scale-105 tw-shadow-md"
                  : "tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300"
              }`}
          >
            Registrar Usuario
          </button>

          <button
            onClick={() => {
              trackClick("View Sessions Button");
              handlePanelChange(selectedPanel === "sessions" ? null : "sessions");
            }}
            className={`tw-px-6 tw-py-3 tw-rounded-lg tw-font-semibold tw-text-center
              tw-transition-all tw-duration-300 tw-ease-in-out hover:tw-shadow-lg
              ${
                selectedPanel === "sessions"
                  ? "tw-bg-green-500 tw-text-white tw-scale-105 tw-shadow-md"
                  : "tw-bg-gray-200 tw-text-gray-700 hover:tw-bg-gray-300"
              }`}
          >
            Visualizar Sesiones
          </button>
        </div>

        <div className="tw-relative tw-overflow-hidden">
          <div
            className={`tw-transition-all tw-duration-300 tw-ease-in-out
              ${
                selectedPanel
                  ? "tw-max-h-[2000px] tw-opacity-100"
                  : "tw-max-h-0 tw-opacity-0"
              }
              ${isAnimating ? "tw-blur-[1px]" : ""}`}
          >
            {/* Panel Editar */}
            <div
              className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out
                ${
                  selectedPanel === "edit"
                    ? "tw-translate-x-0 tw-relative"
                    : "tw-translate-x-full tw-absolute tw-inset-0"
                }
                ${!selectedPanel ? "tw-hidden" : ""}`}
            >
              <div className="tw-p-4 tw-bg-gray-50 tw-rounded-lg tw-shadow-inner">
                <UserTable users={users} onEdit={handleEditUser} />
              </div>
            </div>

            {/* Panel Registrar */}
            <div
              className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out
                ${
                  selectedPanel === "register"
                    ? "tw-translate-x-0 tw-relative"
                    : "tw-translate-x-full tw-absolute tw-inset-0"
                }
                ${!selectedPanel ? "tw-hidden" : ""}`}
            >
              <div className="tw-p-4 tw-bg-gray-50 tw-rounded-lg tw-shadow-inner">
                <RegisterFormUser id={id_plan} />
              </div>
            </div>

            {/* Panel Sesiones */}
            <div
              className={`tw-transform tw-transition-all tw-duration-300 tw-ease-in-out
                ${
                  selectedPanel === "sessions"
                    ? "tw-translate-x-0 tw-relative"
                    : "tw-translate-x-full tw-absolute tw-inset-0"
                }
                ${!selectedPanel ? "tw-hidden" : ""}`}
            >
              <div className="tw-p-4 tw-bg-gray-50 tw-rounded-lg tw-shadow-inner">
                <SessionsTable 
                  onShowAdvancedData={() => setIsAdvancedModalOpen(true)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {editingUser && (
        <UserEditModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={handleSaveUser}
        />
      )}

      <AdvancedSessionDataModal
        isOpen={isAdvancedModalOpen}
        onClose={() => setIsAdvancedModalOpen(false)}
      />
    </div>
  );
};
