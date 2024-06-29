import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {InitialStatePlanInterface, 
        NodeInterface, 
        Node, 
        Coordinates, 
        LevelInterface} from "@/interfaces";
import { setGenericState, getGenericState, removeGenericState, notify } from "@/utils";

import {thunkGetPDTid,
        thunkGetLastPDT,
        thunkAddPDT,
        thunkGetColors,
        thunkAddColors,
        thunkUpdateColors,
        thunkGetNodes,
        thunkUpdateYears,
        thunkGetLevelsById, 
        thunkGetLevelName,
        thunkUpdateWeight,
        thunkGetSecretaries,
        thunkAddSecretaries,
        thunkUpdateSecretaries,
        thunkAddLocations,
        thunkGetLocations,
        thunkAddLevel,
        thunkAddNodes,
        removePDT,
        thunkUpdateLocations,
        thunkUpdateDeadline } from "./thunks";

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
        errorLoadingPlan: undefined,
        errorLoadingColors: undefined,
        errorLoadingNodes: undefined,
        errorLoadingLevels: undefined,
        errorLoadingNamesTree: undefined,
        errorLoadingLogo: undefined,
        errorLoadingSecretaries: undefined,
        errorLoadingLocations: undefined,
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
        namesTree: [['Dimension', 'Nivel']],
        rootTree: [],
        radioBtn: 'fisica',
        secretaries: [],
        locations: [],
        planLocation: undefined,
        bounding1: 0,
        bounding2: 0,
        bounding3: 0,
        bounding4: 0,
    };
};

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
            //state.financial = [];
            //state.nodes = [];
            //state.nodesReport = [];
            //state.secretaries = [];
            //state.colorimeter = [];
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetPDTid.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
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
            state.secretaries = [];
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
            state.secretaries = [];
            state.colorimeter = [];
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddPDT.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
            if (action.payload) {
                switch (action.payload.status) {
                    case 401:
                        alert("No está permitido acceder aquí.");
                        break;
                    case 404:
                        alert("Usuario o contraseña incorrecto.");
                        break;
                    case 500:
                        alert("Ha habido un error, pruebe más tarde.");
                        break;
                    default:
                        break;
                }
            }
        });

        
        builder.addCase(thunkAddColors.pending, state => {
            if (!state.loadingColors) state.loadingColors = true;
            state.errorLoadingColors = undefined;
        });
        builder.addCase(thunkAddColors.fulfilled, (state, action) => {
            state.loadingColors = false;
            state.color = true;
            state.colorimeter = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddColors.rejected, (state, action) => {
            state.loadingColors = false;
            state.color = false;
            state.errorLoadingColors = action.payload;
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
            setGenericState('plan', state);
        });
        builder.addCase(thunkUpdateColors.rejected, (state, action) => {
            state.loadingColors = false;
            state.color = false;
            state.errorLoadingColors = action.payload;
        });


        builder.addCase(thunkGetNodes.pending, state => {
            if (!state.loadingNodes) state.loadingNodes = true;
            state.errorLoadingNodes = undefined;
        });
        builder.addCase(thunkGetNodes.fulfilled, (state, action) => {
            state.loadingNodes = false;
            const temp = [] as NodeInterface[]
            action.payload.forEach((item:Node) => {
                temp.push({
                    id_node: item.id_node,
                    name: item.name,
                    description: item.description,
                    parent: item.parent,
                    id_level: item.id_level,
                    weight: item.weight,
                })
            });
            state.nodes = temp;
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
            const temp = [] as NodeInterface[]
            action.payload.forEach((item:Node) => {
                temp.push({
                    id_node: item.id_node,
                    name: item.name,
                    description: item.description,
                    parent: item.parent,
                    id_level: item.id_level,
                    weight: item.weight,
                })
            });
            state.nodes = temp;
            setGenericState('plan', state);
        });
        builder.addCase(thunkAddNodes.rejected, (state, action) => {
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
            if (action.payload) {
                switch (action.payload.status) {
                    case 401:
                        alert("No está permitido acceder aquí.");
                        break;
                    case 403:
                        alert("No tienes permitido realizar esta acción.");
                        break;
                    case 404:
                        alert("Usuario o contraseña incorrecto.");
                        break;
                    case 500:
                        alert("Ha habido un error, pruebe más tarde.");
                        break;
                    default:
                        break;
                }
            }
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
            if (action.payload) {
                switch (action.payload.status) {
                    case 401:
                        alert("No está permitido acceder aquí.");
                        break;
                    case 403:
                        alert("No tienes permitido realizar esta acción.");
                        break;
                    case 404:
                        alert("Plan no existe.");
                        break;
                    case 500:
                        alert("Ha habido un error, pruebe más tarde.");
                        break;
                    default:
                        break;
                }
            }
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
            if (action.payload) {
                switch (action.payload.status) {
                    case 401:
                        alert("No está permitido acceder aquí.");
                        break;
                    case 403:
                        alert("No tienes permitido realizar esta acción.");
                        break;    
                    case 404:
                        alert("Plan no existe.");
                        break;
                    case 500:
                        alert("Ha habido un error, pruebe más tarde.");
                        break;
                    default:
                        break;
                }
            }
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
            if (state.secretaries) notify("Secretarias actualizadas");
            else notify("Secretarias añadidas");
            setGenericState('plan', state);
        });
        builder.addCase(thunkUpdateSecretaries.rejected, (state, action) => {
            state.loadingSecretaries = false;
            let error_text = 'Ha occurido un error.';
            if (action.payload) {
                switch (action.payload.status) {
                    case 401:
                        alert("No está permitido acceder aquí.");
                        break;
                    case 403:
                        alert("No tienes permitido realizar esta acción.");
                        break;    
                    case 404:
                        alert("No se ha encontrado el recurso.");
                        break;
                    case 500:
                        alert("Ha habido un error, pruebe más tarde.");
                        break;
                    default:
                        break;
                }
                state.errorLoadingSecretaries = {
                    status: action.payload.status,
                    error_code: action.payload.error_code ?? action.payload.error,
                    error_description: error_text
                };
            } else {
                state.errorLoadingSecretaries = {
                    error_code: action.error.code,
                    error_description: error_text
                };
            }
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
        });
        builder.addCase(thunkUpdateDeadline.rejected, (state, action) => {
            state.loadingPlan = false;
            state.errorLoadingPlan = action.payload;
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
    resetPlan } = planSlice.actions;
export default planSlice.reducer;