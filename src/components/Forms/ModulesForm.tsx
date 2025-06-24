import { useState, useEffect, useMemo } from 'react';
import { useAppDispatch } from '@/store';
import { getPDTs } from '@/services/api';
import { thunkUpdateModulesMask } from '@/store/plan/thunks';
import { notify } from '@/utils';
import { Tooltip } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

// The 6 new modules
interface IModules {
    indicative_plan: boolean;
    action_plan: boolean;
    project_bank: boolean;
    poai: boolean;
    citizen_service: boolean;
    intervention_map: boolean;
}

// Corresponds to the database schema
interface IPlan {
    id_plan: number;
    name: string;
    start_date: string;
    end_date: string;
    description: string;
    department: string;
    municipality: string;
    modules?: number | null; // Integer representation of binary module flags
}

const moduleOrder: (keyof IModules)[] = [
    'indicative_plan', 'action_plan', 'project_bank', 'poai', 'citizen_service', 'intervention_map'
];

const modulesName: { [key in keyof IModules]: string } = {
    indicative_plan: 'Plan Indicativo',
    action_plan: 'Plan de Acción',
    project_bank: 'Banco de Proyectos',
    poai: 'POAI',
    citizen_service: 'Atención Ciudadana',
    intervention_map: 'Mapa de Intervención',
};

export const ModulesForm = () => {
    const dispatch = useAppDispatch();
    const [plans, setPlans] = useState<IPlan[]>([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlan, setSelectedPlan] = useState<IPlan | null>(null);
    const [editedModules, setEditedModules] = useState<IModules | null>(null);

    useEffect(() => {
        getPDTs()
            .then(data => {
                setPlans(data);
            })
            .catch(err => {
                console.error("Error fetching plans:", err);
            });
    }, []);

    const filteredPlans = useMemo(() => {
        if (!searchQuery) {
            return plans;
        }
        return plans.filter(plan =>
            plan.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
            plan.municipality.toLowerCase().includes(searchQuery.toLowerCase())
        );
    }, [plans, searchQuery]);

    const handleSelectPlan = (plan: IPlan) => {
        if (selectedPlan && selectedPlan.id_plan === plan.id_plan) {
            setSelectedPlan(null);
            setEditedModules(null);
        } else {
            setSelectedPlan(plan);
            setEditedModules(decimalToModules(plan.modules));
        }
    };

    const handleCheckboxChange = (moduleName: keyof IModules) => {
        if (editedModules) {
            setEditedModules(prevModules => ({
                ...prevModules!,
                [moduleName]: !prevModules![moduleName]
            }));
        }
    };

    const handleSubmit = () => {
        if (!selectedPlan || !editedModules) return;

        const newModulesMask = modulesToDecimal(editedModules);
        
        dispatch(thunkUpdateModulesMask({ id_plan: selectedPlan.id_plan, modules_mask: newModulesMask }))
            .unwrap()
            .then(() => {
                setPlans(plans.map(p => 
                    p.id_plan === selectedPlan.id_plan 
                        ? { ...p, modules: newModulesMask } 
                        : p
                ));
                setSelectedPlan(null);
                setEditedModules(null);
                notify('Módulos actualizados correctamente', 'success');
            })
            .catch(() => {
                notify('Hubo un error al actualizar los módulos', 'error');
            });
    };

    return (
        <div className="tw-bg-white tw-p-4 tw-m-4 tw-rounded-lg tw-shadow-md">
            <h2 className="tw-text-2xl tw-font-bold tw-mb-4">Configuración de Módulos por Plan</h2>
            <p className="tw-text-base tw-text-gray-600 tw-mb-6">
                Haga clic sobre un plan para expandir/contraer y administrar sus módulos. Pase el cursor sobre los indicadores de color para ver el nombre del módulo.
            </p>
            <div className="tw-mb-6">
                <input
                    type="text"
                    placeholder="Buscar por nombre, departamento o municipio..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="tw-w-full tw-p-3 tw-border tw-border-gray-300 tw-rounded-lg focus:tw-outline-none focus:tw-ring-2 focus:tw-ring-blue-500 tw-transition-shadow"
                />
            </div>
            <div className="tw-space-y-4">
                {filteredPlans.map(plan => {
                    const isSelected = selectedPlan && selectedPlan.id_plan === plan.id_plan;
                    const planModules = decimalToModules(plan.modules);

                    return (
                        <div key={plan.id_plan} className="tw-border tw-rounded-lg tw-overflow-hidden tw-transition-shadow hover:tw-shadow-lg">
                            <div className="tw-cursor-pointer tw-p-4" onClick={() => handleSelectPlan(plan)}>
                                <div className='tw-flex tw-justify-between tw-items-center'>
                                    <div>
                                        <h3 className="tw-text-xl tw-font-semibold">{plan.name}</h3>
                                        <p className='tw-text-base tw-text-gray-500'>{plan.department} - {plan.municipality}</p>
                                        <p className='tw-text-sm tw-text-gray-400'>Periodo: {plan.start_date} a {plan.end_date}</p>
                                    </div>
                                    <div className="tw-flex tw-items-center tw-gap-4">
                                        <div className="tw-text-sm tw-text-gray-400 tw-mr-2">
                                            (Mask: {plan.modules || 0})
                                        </div>
                                        <div className="tw-flex tw-gap-2">
                                            {moduleOrder.map(moduleKey => (
                                                <Tooltip key={moduleKey} title={modulesName[moduleKey]} placement="top">
                                                    <div className={`tw-w-6 tw-h-6 tw-rounded ${planModules[moduleKey] ? 'tw-bg-green-500' : 'tw-bg-red-500'}`}></div>
                                                </Tooltip>
                                            ))}
                                        </div>
                                        <ExpandMoreIcon
                                            className={`tw-transform tw-transition-transform tw-duration-300 ${isSelected ? 'tw-rotate-180' : ''}`}
                                        />
                                    </div>
                                </div>
                            </div>
                            <div
                                className={`tw-transition-all tw-duration-300 tw-ease-in-out ${
                                    isSelected ? 'tw-max-h-[500px]' : 'tw-max-h-0'
                                }`}
                            >
                                {isSelected && editedModules && (
                                    <div className="tw-bg-gray-50 tw-p-6 tw-border-t tw-border-gray-200">
                                        <p className='tw-text-base tw-text-gray-700 tw-mb-4'>{plan.description}</p>
                                        <div className="tw-grid tw-grid-cols-2 md:tw-grid-cols-3 lg:tw-grid-cols-3 tw-gap-y-4 tw-gap-x-6">
                                            {moduleOrder.map(moduleKey => (
                                                <div key={moduleKey} className="tw-flex tw-items-center">
                                                    <input
                                                        type="checkbox"
                                                        id={`${plan.id_plan}-${moduleKey}`}
                                                        checked={editedModules[moduleKey]}
                                                        onChange={() => handleCheckboxChange(moduleKey)}
                                                        className="tw-form-checkbox tw-h-5 tw-w-5 tw-text-blue-600 tw-rounded focus:tw-ring-blue-500"
                                                    />
                                                    <label htmlFor={`${plan.id_plan}-${moduleKey}`} className="tw-ml-3 tw-text-base tw-text-gray-700">
                                                        {modulesName[moduleKey]}
                                                    </label>
                                                </div>
                                            ))}
                                        </div>
                                        <div className="tw-flex tw-justify-end tw-mt-8">
                                            <button
                                                onClick={handleSubmit}
                                                className="tw-bg-blue-600 hover:tw-bg-blue-700 tw-text-white tw-font-bold tw-py-2 tw-px-4 tw-rounded tw-shadow-md hover:tw-shadow-lg tw-transition-all tw-duration-200 tw-text-base"
                                            >
                                                Guardar Cambios
                                            </button>
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

// --- Conversion Helpers ---
const decimalToModules = (mask: number | undefined | null): IModules => {
    const validMask = mask || 0;
    const binaryString = validMask.toString(2).padStart(moduleOrder.length, '0');
    const modules: any = {};
    moduleOrder.forEach((key, index) => {
        modules[key] = binaryString[index] === '1';
    });
    return modules;
};

const modulesToDecimal = (modules: IModules): number => {
    const binaryString = moduleOrder.map(key => (modules[key] ? '1' : '0')).join('');
    return parseInt(binaryString, 2);
};
