import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {
    InitialStatePlanInterface, Node, levelsPlan_,
    Coordinates, LevelInterface } from "@/interfaces";
import {
    setGenericState, getGenericState,
    removeGenericState, notify } from "@/utils";

import {
    thunkAddPDT, thunkGetColors, thunkAddColors,
    thunkAddActivityActionPlan, thunkupdatePDTFill,
    thunkGetPDTid, thunkGetPDTByDept, thunkGetLastPDT,
    thunkUpdateColors, thunkGetNodes, thunkUpdateYears,
    thunkUpdateActivityActionPlan, thunkGetActionPlans,
    thunkAddLocations, thunkGetLocations, thunkAddLevel,
    thunkAddActionPlan, thunkUpdateActionPlan, removePDT,
    thunkGetProjects, thunkAddProjects, thunkUpdateProjects,
    thunkGetLevelsById, thunkGetLevelName, thunkUpdateWeight,
    thunkAddNodes, thunkUpdateLocations, thunkUpdateDeadline,
    thunkGetSecretaries, thunkAddSecretaries, thunkUpdateSecretaries,
    thunkGetActivityActionPlan, thunkGetCountProjects, thunkGetPDTByUuid, thunkUpdateNodes
    } from "./thunks";

const getInitialState = (): InitialStatePlanInterface => {
    const planState = getGenericState('plan');
    if (planState) return planState;
    return {
        loadingPlan: false,
        loadingColors: false,
        loadingNodes: false,
        loadingLevels: false,
        loadingNamesTree: false,
        loadingLogo: false,
        loadingSecretaries: false,
        loadingLocations: false,
        loadingReport: false,
        loadingProjects: false,
        loadingActionPlan: false,
        loadingActivityActionPlan: false,
        errorLoadingPlan: undefined,
        errorLoadingColors: undefined,
        errorLoadingNodes: undefined,
        errorLoadingLevels: undefined,
        errorLoadingNamesTree: undefined,
        errorLoadingLogo: undefined,
        errorLoadingSecretaries: undefined,
        errorLoadingLocations: undefined,
        errorLoadingProjects: undefined,
        errorLoadingActionPlan: undefined,
        errorLoadingActivityActionPlan: undefined,
        plan: undefined,
        colorimeter: [],
        color: undefined,
        nodes: [],
        nodesReport: [],
        years: [],
        yearSelect: undefined,
        levels: [],
        indexLevel: 0,
        parent: null,
        progressNodes: [],
        financial: [],
        namesTree: [{
            nodo: 'Social',
            nivel: 'Dimension'
        }],
        rootTree: [],
        radioBtn: 'fisica',
        secretaries: undefined,
        locations: undefined,
        planLocation: undefined,
        bounding1: 0,
        bounding2: 0,
        bounding3: 0,
        bounding4: 0,
        projects: undefined,
        proje_s: 0,
        actionPlan: undefined,
        selectedPlan: undefined,
        done: false,
        calcDone: false
    };
};

const errorMSGUpdate = 'ha ocurrido un error al actualizar, intente mas tarde';

export const planSlice = createSlice({
    name: "plan",
    initialState: getInitialState,
    reducers: {
        selectYear: (state, action: PayloadAction<number>) => {
            state.yearSelect = action.payload;
            setGenericState('plan', state);
        },
        incrementLevelIndex: (state, action: PayloadAction<number>) => {
            state.indexLevel = action.payload;
            setGenericState('plan', state);
        },
        decrementLevelIndex: (state, action: PayloadAction<number>) => {
            state.indexLevel = action.payload;
            setGenericState('plan', state);
        },
        setZeroLevelIndex: (state) => {
            state.indexLevel = 0;
            state.parent = null;
            setGenericState('plan', state);
        },
        setParent: (state, action: PayloadAction<string | null>) => {
            state.parent = action.payload;
            setGenericState('plan', state);
        },
        setRadioBtn: (state, action: PayloadAction<string>) => {
            state.radioBtn = action.payload;
            setGenericState('plan', state);
        },
        setProgressNodes: (state, action: PayloadAction<number[]>) => {
            state.progressNodes = action.payload;
            setGenericState('plan', state);
        },
        setFinancial: (state, action: PayloadAction<number[]>) => {
            state.financial = action.payload;
            setGenericState('plan', state);
        },
        setLoadingReport: (state, action: PayloadAction<boolean>) => {
            state.loadingReport = action.payload;
            setGenericState('plan', state);
        },
        setNodesReport: (state, action: PayloadAction<Node[]>) => {
            state.nodesReport = action.payload;
            setGenericState('plan', state);
        },
        setPlanLocation: (state, action: PayloadAction<Coordinates>) => {
            state.planLocation = action.payload;
            setGenericState('plan', state);
        },
        setBoundingbox: (state, action: PayloadAction<number[]>) => {
            state.bounding1 = action.payload[0];
            state.bounding2 = action.payload[1];
            state.bounding3 = action.payload[2];
            state.bounding4 = action.payload[3];
            setGenericState('plan', state);
        },
        setLevels: (state, action: PayloadAction<LevelInterface[]>) => {
            state.levels = action.payload;
            setGenericState('plan', state);
        },
        AddRootTree: (state, action: PayloadAction<string[][]>) => {
            state.rootTree = action.payload;
            setGenericState('plan', state);
        },
        setSelectedActionPlan: (state, action: PayloadAction<number>) => {
            let val = action.payload;
            if (val < 0) {
                state.selectedPlan = undefined;
                state.done = false;
            } else {
                state.selectedPlan = state.actionPlan![action.payload];
            }
            setGenericState('plan', state);
        },
        setDone: (state, action: PayloadAction<boolean>) => {
            state.done = action.payload;
            setGenericState('plan', state);
        },
        setCalcDone: (state, action: PayloadAction<boolean>) => {
            state.calcDone = action.payload;
            setGenericState('plan', state);
        },
        resetPlan: () => {
            removeGenericState("plan");
            return getInitialState();
        }
    },
    extraReducers: builder => {
        builder.addCase(thunkGetPDTid.pending, state => {
            if (!state.loadingPlan) state.loadingPlan = true;
            state.errorLoadingPlan = undefined;
        });
        builder.addCase(thunkGetPDTid.fulfilled, (state, action) => {
            state.loadingPlan = false;
            state.plan = action.payload;
            state.progressNodes = [];
            state.financial = [];
            state.nodes = [];
            state.nodesReport = [];
            state.secretaries = undefined;
            state.colorimeter = [];
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetPDTid.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
        });


        builder.addCase(thunkGetPDTByDept.pending, state => {
            if (!state.loadingPlan) state.loadingPlan = true;
            state.errorLoadingPlan = undefined;
        });
        builder.addCase(thunkGetPDTByDept.fulfilled, (state, action) => {
            state.loadingPlan = false;
            state.plan = action.payload;
            state.progressNodes = [];
            state.financial = [];
            state.nodes = [];
            state.nodesReport = [];
            state.secretaries = undefined;
            state.colorimeter = [];
            setGenericState('plan', state);
            state.plan.toString() != '' ?
                notify('Redirigiendo', 'info') :
                notify('No se ha encontrado un Plan de Desarrollo en esta localidad', 'error');
        });
        builder.addCase(thunkGetPDTByDept.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
            notify('Ha ocurrido un error buscando el Plan Territorial', 'error');
        });


        builder.addCase(thunkGetPDTByUuid.pending, state => {
            if (!state.loadingPlan) state.loadingPlan = true;
            state.errorLoadingPlan = undefined;
        });
        builder.addCase(thunkGetPDTByUuid.fulfilled, (state, action) => {
            state.loadingPlan = false;
            state.plan = action.payload.toString() == '' ? undefined : action.payload;
            state.progressNodes = [];
            state.financial = [];
            state.nodes = [];
            state.nodesReport = [];
            state.secretaries = undefined;
            state.colorimeter = [];
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetPDTByUuid.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
            state.plan = undefined;
            notify('Ha ocurrido un error buscando el Plan Territorial', 'error');
        });


        builder.addCase(thunkGetLastPDT.pending, state => {
            if (!state.loadingPlan) state.loadingPlan = true;
            state.errorLoadingPlan = undefined;
        });
        builder.addCase(thunkGetLastPDT.fulfilled, (state, action) => {
            state.loadingPlan = false;
            state.plan = action.payload;
            state.progressNodes = [];
            state.financial = [];
            state.nodes = [];
            state.nodesReport = [];
            state.secretaries = undefined;
            state.colorimeter = [];
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetLastPDT.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
        });


        builder.addCase(thunkAddPDT.pending, state => {
            if (!state.loadingPlan) state.loadingPlan = true;
            state.errorLoadingPlan = undefined;
        });
        builder.addCase(thunkAddPDT.fulfilled, (state, action) => {
            state.loadingPlan = false;
            state.plan = action.payload;
            state.levels = [];
            state.indexLevel = 0;
            state.parent = null;
            state.progressNodes = [];
            state.financial = [];
            state.nodes = [];
            state.nodesReport = [];
            state.secretaries = undefined;
            state.colorimeter = [];
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddPDT.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
            notify(action.payload?.error_description ?? 'Ha occurido un error', 'error');
        });

        
        builder.addCase(thunkAddColors.pending, state => {
            if (!state.loadingColors) state.loadingColors = true;
            state.errorLoadingColors = undefined;
        });
        builder.addCase(thunkAddColors.fulfilled, (state, action) => {
            state.loadingColors = false;
            state.color = true;
            state.colorimeter = action.payload;
            notify("Colorimetria guardados correctamente");
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddColors.rejected, (state, action) => {
            state.loadingColors = false;
            state.color = false;
            state.errorLoadingColors = action.payload;
            notify(action.payload?.error_description ?? 'Ha occurido un error', 'error');
        });


        builder.addCase(thunkGetColors.pending, state => {
            if (!state.loadingColors) state.loadingColors = true;
            state.errorLoadingColors = undefined;
        });
        builder.addCase(thunkGetColors.fulfilled, (state, action) => {
            state.loadingColors = false;
            state.color = true;
            state.colorimeter = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetColors.rejected, (state, action) => {
            state.loadingColors = false;
            state.color = false;
            state.errorLoadingColors = action.payload;
        });


        builder.addCase(thunkUpdateColors.pending, state => {
            if (!state.loadingColors) state.loadingColors = true;
            state.errorLoadingColors = undefined;
        });
        builder.addCase(thunkUpdateColors.fulfilled, (state, action) => {
            state.loadingColors = false;
            state.color = true;
            state.colorimeter = action.payload;
            notify("Colorimetria actualizados correctamente");
            setGenericState('plan', state);
        });
        builder.addCase(thunkUpdateColors.rejected, (state, action) => {
            state.loadingColors = false;
            state.color = false;
            state.errorLoadingColors = action.payload;
            notify(action.payload?.error_description ?? 'Ha occurido un error', 'error');
        });


        builder.addCase(thunkGetNodes.pending, state => {
            if (!state.loadingNodes) state.loadingNodes = true;
            state.errorLoadingNodes = undefined;
        });
        builder.addCase(thunkGetNodes.fulfilled, (state, action) => {
            state.loadingNodes = false;
            state.nodes = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetNodes.rejected, (state, action) => {
            state.loadingNodes = false;
            state.errorLoadingNodes = action.payload;
        });


        builder.addCase(thunkAddNodes.pending, state => {
            if (!state.loadingNodes) state.loadingNodes = true;
            state.errorLoadingNodes = undefined;
        });
        builder.addCase(thunkAddNodes.fulfilled, (state, action) => {
            state.loadingNodes = false;
            state.nodes = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddNodes.rejected, (state, action) => {
            state.loadingNodes = false;
            state.errorLoadingNodes = action.payload;
        });


        builder.addCase(thunkUpdateNodes.pending, state => {
            if (!state.loadingNodes) state.loadingNodes = true;
            state.errorLoadingNodes = undefined;
        });
        builder.addCase(thunkUpdateNodes.fulfilled, (state, action) => {
            state.loadingNodes = false;
            state.nodes = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkUpdateNodes.rejected, (state, action) => {
            state.loadingNodes = false;
            state.errorLoadingNodes = action.payload;
        });


        builder.addCase(thunkAddLevel.pending, state => {
            if (!state.loadingLevels) state.loadingLevels = true;
            state.errorLoadingLevels = undefined;
        });
        builder.addCase(thunkAddLevel.fulfilled, (state, action) => {
            state.loadingLevels = false;
            state.levels = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddLevel.rejected, (state, action) => {
            state.loadingLevels = false;
            state.errorLoadingLevels = action.payload;
        });


        builder.addCase(thunkUpdateYears, (state, action) => {
            state.years = action.payload;
            setGenericState('plan', state);
        });


        builder.addCase(thunkGetLevelsById.pending, state => {
            if (!state.loadingLevels) state.loadingLevels = true;
            state.errorLoadingLevels = undefined;
        });
        builder.addCase(thunkGetLevelsById.fulfilled, (state, action) => {
            state.loadingLevels = false;
            state.levels = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetLevelsById.rejected, (state, action) => {
            state.loadingLevels = false;
            state.errorLoadingLevels = action.payload;
        });


        builder.addCase(thunkGetLevelName.pending, state => {
            if (!state.loadingNamesTree) state.loadingNamesTree = true;
            state.errorLoadingNamesTree = undefined;
        });
        builder.addCase(thunkGetLevelName.fulfilled, (state, action) => {
            state.loadingNamesTree = false;
            state.namesTree = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetLevelName.rejected, (state, action) => {
            state.loadingNamesTree = false;
            state.errorLoadingNamesTree = action.payload;
        });


        builder.addCase(thunkAddSecretaries.pending, state => {
            if (!state.loadingSecretaries) state.loadingSecretaries = true;
            state.errorLoadingSecretaries = undefined;
        });
        builder.addCase(thunkAddSecretaries.fulfilled, (state, action) => {
            state.loadingSecretaries = false;
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddSecretaries.rejected, (state, action) => {
            state.loadingSecretaries = false;
            state.errorLoadingSecretaries = action.payload;
            notify(action.payload?.error_description ?? 'Ha occurido un error', 'error');
        });


        builder.addCase(thunkAddLocations.pending, state => {
            if (!state.loadingLocations) state.loadingLocations = true;
            state.errorLoadingLocations = undefined;
        });
        builder.addCase(thunkAddLocations.fulfilled, (state, action) => {
            state.loadingLocations = false;
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddLocations.rejected, (state, action) => {
            state.loadingLocations = false;
            state.errorLoadingLocations = action.payload;
            notify(action.payload?.error_description ?? 'Ha occurido un error', 'error');
        });


        builder.addCase(thunkGetLocations.pending, state => {
            if (!state.loadingLocations) state.loadingLocations = true;
            state.errorLoadingLocations = undefined;
        });
        builder.addCase(thunkGetLocations.fulfilled, (state, action) => {
            state.loadingLocations = false;
            state.locations = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetLocations.rejected, (state, action) => {
            state.loadingLocations = false;
            state.errorLoadingLocations = action.payload;
        });


        builder.addCase(thunkUpdateLocations.pending, state => {
            if (!state.loadingLocations) state.loadingLocations = true;
            state.errorLoadingLocations = undefined;
        });
        builder.addCase(thunkUpdateLocations.fulfilled, (state, action) => {
            state.loadingLocations = false;
            setGenericState('plan', state);
        });
        builder.addCase(thunkUpdateLocations.rejected, (state, action) => {
            state.loadingLocations = false;
            state.errorLoadingLocations = action.payload;
            notify(action.payload?.error_description ?? 'Ha occurido un error', 'error');
        });


        builder.addCase(thunkGetSecretaries.pending, state => {
            if (!state.loadingSecretaries) state.loadingSecretaries = true;
            state.errorLoadingSecretaries = undefined;
        });
        builder.addCase(thunkGetSecretaries.fulfilled, (state, action) => {
            state.loadingSecretaries = false;
            state.secretaries = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetSecretaries.rejected, (state, action) => {
            state.loadingSecretaries = false;
            state.errorLoadingSecretaries = action.payload;
        });


        builder.addCase(thunkUpdateSecretaries.pending, state => {
            if (!state.loadingSecretaries) state.loadingSecretaries = true;
            state.errorLoadingSecretaries = undefined;
        });
        builder.addCase(thunkUpdateSecretaries.fulfilled, (state, action) => {
            state.loadingSecretaries = false;
            if (state.secretaries) notify("Secretarias actualizadas", 'success');
            else notify("Secretarias añadidas", 'success');
            setGenericState('plan', state);
        });
        builder.addCase(thunkUpdateSecretaries.rejected, (state, action) => {
            state.loadingSecretaries = false;
            state.errorLoadingSecretaries = action.payload;
            notify(action.payload?.error_description ?? 'Ha occurido un error', 'error');
        });


        builder.addCase(thunkUpdateWeight.pending, state => {
            if (!state.loadingNodes) state.loadingNodes = true;
            state.errorLoadingNodes = undefined;
        });
        builder.addCase(thunkUpdateWeight.fulfilled, (state, action) => {
            state.loadingNodes = false;
        });
        builder.addCase(thunkUpdateWeight.rejected, (state, action) => {
            state.loadingNodes = false;
            state.errorLoadingNodes = action.payload;
        });


        builder.addCase(removePDT, state => {
            removeGenericState('plan');
            state.plan = undefined;
        });


        builder.addCase(thunkUpdateDeadline.pending, state => {
            if (!state.loadingPlan) state.loadingPlan = true;
            state.errorLoadingPlan = undefined;
        });
        builder.addCase(thunkUpdateDeadline.fulfilled, (state, action) => {
            state.plan!.deadline = action.meta.arg.date
            state.loadingPlan = false;
            notify('Fecha de corte actualizada', 'success');
        });
        builder.addCase(thunkUpdateDeadline.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
        });


        builder.addCase(thunkGetProjects.pending, state => {
            if (!state.loadingProjects) state.loadingProjects = true;
            state.errorLoadingProjects = undefined;
        });
        builder.addCase(thunkGetProjects.fulfilled, (state, action) => {
            state.loadingProjects = false;
            state.projects = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetProjects.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingProjects = action.payload;
        });


        builder.addCase(thunkGetCountProjects.pending, state => {
            if (!state.loadingProjects) state.loadingProjects = true;
            state.errorLoadingProjects = undefined;
        });
        builder.addCase(thunkGetCountProjects.fulfilled, (state, action) => {
            state.loadingProjects = false;
            state.proje_s = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetCountProjects.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingProjects = action.payload;
        });


        builder.addCase(thunkAddProjects.pending, state => {
            if (!state.loadingProjects) state.loadingProjects = true;
            state.errorLoadingProjects = undefined;
        });
        builder.addCase(thunkAddProjects.fulfilled, (state, action) => {
            state.loadingProjects = false;
            setGenericState('plan', state);
            notify('Se ha agregado correctamente', 'success');
        });
        builder.addCase(thunkAddProjects.rejected, (state, action) => {
            state.loadingProjects = false;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
            state.errorLoadingProjects = action.payload;
        });


        builder.addCase(thunkUpdateProjects.pending, state => {
            if (!state.loadingPlan) state.loadingPlan = true;
            state.errorLoadingPlan = undefined;
        });
        builder.addCase(thunkUpdateProjects.fulfilled, (state, action) => {
            state.loadingPlan = false;
            const index = state.projects!.findIndex(p => p.id_project = action.payload.id_project);
            if (index !== 1)
                state.projects![index] = action.payload;
            notify('Información del proyecto actualizado', 'success');
            setGenericState('plan', state);
        });
        builder.addCase(thunkUpdateProjects.rejected, (state, action) => {
            state.loadingPlan = false;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
            state.errorLoadingPlan = action.payload;
        });


        builder.addCase(thunkGetActionPlans.pending, state => {
            if (!state.loadingActionPlan) state.loadingActionPlan = true;
            state.errorLoadingActionPlan = undefined;
        });
        builder.addCase(thunkGetActionPlans.fulfilled, (state, action) => {
            state.loadingActionPlan = false;
            state.actionPlan = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetActionPlans.rejected, (state, action) => {
            state.loadingActionPlan = false;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
            state.errorLoadingActionPlan = action.payload;
        });


        builder.addCase(thunkGetActivityActionPlan.pending, state => {
            if (!state.loadingActivityActionPlan) state.loadingActivityActionPlan = true;
            state.errorLoadingActivityActionPlan = undefined;
        });
        builder.addCase(thunkGetActivityActionPlan.fulfilled, (state, action) => {
            state.loadingActivityActionPlan = false;
            state.selectedPlan!.actions = action.payload[0];
            state.selectedPlan!.rubros = action.payload[1];
            state.selectedPlan!.nodes = action.payload[2];
            for (let i = 0; i < action.payload[3].length; i++) {
                const str = `level_${i + 1}` as keyof levelsPlan_;
                state.selectedPlan![str] = action.payload[3][i].name;
            }
            state.selectedPlan!.nodesResult = action.payload[4];
            state.done = true;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetActivityActionPlan.rejected, (state, action) => {
            state.loadingActivityActionPlan = false;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
            state.errorLoadingActivityActionPlan = action.payload;
        });


        builder.addCase(thunkAddActionPlan.pending, state => {
            if (!state.loadingActionPlan) state.loadingActionPlan = true;
            state.errorLoadingActionPlan = undefined;
        });
        builder.addCase(thunkAddActionPlan.fulfilled, (state, action) => {
            state.loadingActionPlan = false;
            state.actionPlan = action.payload;
            notify('Ficha registrada', 'success');
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddActionPlan.rejected, (state, action) => {
            state.loadingActionPlan = false;
            state.errorLoadingActionPlan = action.payload;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
        });


        builder.addCase(thunkAddActivityActionPlan.pending, state => {
            if (!state.loadingActivityActionPlan) state.loadingActivityActionPlan = true;
            state.errorLoadingActivityActionPlan = undefined;
        });
        builder.addCase(thunkAddActivityActionPlan.fulfilled, (state, action) => {
            state.loadingActivityActionPlan = false;
            state.selectedPlan!.actions = action.payload;
            notify('Actividad registrada', 'success');
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddActivityActionPlan.rejected, (state, action) => {
            state.loadingActivityActionPlan = false;
            state.errorLoadingActivityActionPlan = action.payload;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
        });


        builder.addCase(thunkUpdateActionPlan.pending, state => {
            if (!state.loadingActionPlan) state.loadingActionPlan = true;
            state.errorLoadingActionPlan = undefined;
        });
        builder.addCase(thunkUpdateActionPlan.fulfilled, (state, action) => {
            state.loadingActionPlan = false;
            state.actionPlan = action.payload;
            notify('Ficha actualizada', 'success');
            setGenericState('plan', state);
        });
        builder.addCase(thunkUpdateActionPlan.rejected, (state, action) => {
            state.loadingActionPlan = false;
            state.errorLoadingActionPlan = action.payload;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
        });


        builder.addCase(thunkUpdateActivityActionPlan.pending, state => {
            if (!state.loadingActivityActionPlan) state.loadingActivityActionPlan = true;
            state.errorLoadingActivityActionPlan = undefined;
        });
        builder.addCase(thunkUpdateActivityActionPlan.fulfilled, (state, action) => {
            state.loadingActivityActionPlan = false;
            state.selectedPlan!.actions = action.payload;
            notify('Actividad registrada', 'success');
            setGenericState('plan', state);
        });
        builder.addCase(thunkUpdateActivityActionPlan.rejected, (state, action) => {
            state.loadingActivityActionPlan = false;
            state.errorLoadingActivityActionPlan = action.payload;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
        });


        builder.addCase(thunkupdatePDTFill.pending, state => {
            if (!state.loadingPlan) state.loadingPlan = true;
            state.errorLoadingPlan = undefined;
        });
        builder.addCase(thunkupdatePDTFill.fulfilled, (state, action) => {
            state.loadingPlan = false;
            state.plan!.fill = action.payload;
            notify('Actualizado', 'success');
            setGenericState('plan', state);
        });
        builder.addCase(thunkupdatePDTFill.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
            notify(action.payload?.error_description ?? errorMSGUpdate, 'error');
        });
    }
});


export const {
    selectYear,
    incrementLevelIndex,
    decrementLevelIndex,
    setZeroLevelIndex,
    setParent,
    setRadioBtn,
    setProgressNodes,
    setFinancial,
    setLoadingReport,
    setNodesReport,
    setPlanLocation,
    setBoundingbox,
    setLevels,
    AddRootTree,
    setSelectedActionPlan,
    resetPlan,
    setDone,
    setCalcDone } = planSlice.actions;
export default planSlice.reducer;