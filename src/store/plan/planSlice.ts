import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import {InitialStatePlanInterface, 
        NodoInterface, 
        Node, 
        Coordinates, 
        NivelInterface } from "@/interfaces";
import { setGenericState, getGenericState, removeGenericState } from "@/utils";

import {thunkGetPDTid, 
        thunkAddPDT, 
        thunkGetColors, 
        thunkAddColors,
        thunkGetNodes, 
        thunkUpdateYears, 
        thunkGetLevelsById, 
        thunkGetLevelName,
        thunkGetLogo, 
        thunkGetSecretaries, 
        thunkAddSecretaries, 
        thunkAddLocations, 
        thunkGetLocations } from "./thunks";

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
        radioBtn: 'fisica',
        url: undefined,
        secretaries: [],
        locations: [],
        planLocation: undefined
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
        setLevels: (state, action: PayloadAction<NivelInterface[]>) => {
            state.levels = action.payload;
            setGenericState('plan', state);
        },
    },
    extraReducers: builder => {
        builder.addCase(thunkGetPDTid.pending, state => {
            if (!state.loadingPlan) state.loadingPlan = true;
            state.errorLoadingPlan = undefined;
        });
        builder.addCase(thunkGetPDTid.fulfilled, (state, action) => {
            state.loadingPlan = false;
            state.plan = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetPDTid.rejected, (state, action) => {
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


        builder.addCase(thunkGetNodes.pending, state => {
            if (!state.loadingNodes) state.loadingNodes = true;
            state.errorLoadingNodes = undefined;
        });
        builder.addCase(thunkGetNodes.fulfilled, (state, action) => {
            state.loadingNodes = false;
            const temp = [] as NodoInterface[]
            action.payload.forEach((item:Node) => {
                temp.push({
                    id_node: item.id_nodo,
                    NodeName: item.Nombre,
                    Description: item.Descripcion,
                    Parent: item.Padre,
                    id_level: item.id_nivel,
                    Weight: 0,
                })
            });
            state.nodes = temp;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetNodes.rejected, (state, action) => {
            state.loadingNodes = false;
            state.errorLoadingNodes = action.payload;
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


        builder.addCase(thunkGetLogo.pending, state => {
            if (!state.loadingLogo) state.loadingLogo = true;
            state.errorLoadingLogo = undefined;
        });
        builder.addCase(thunkGetLogo.fulfilled, (state, action) => {
            state.loadingLogo = false;
            state.url = action.payload;
            setGenericState('plan', state);
        });
        builder.addCase(thunkGetLogo.rejected, (state, action) => {
            state.loadingLogo = false;
            state.errorLoadingLogo = action.payload;
        });


        builder.addCase(thunkAddSecretaries.pending, state => {
            if (!state.loadingSecretaries) state.loadingSecretaries = true;
            state.errorLoadingSecretaries = undefined;
        });
        builder.addCase(thunkAddSecretaries.fulfilled, (state, action) => {
            state.loadingSecretaries = false;
            setGenericState('plan', state);
            alert("Se han agregado las secretarías correctamente.");
        });
        builder.addCase(thunkAddSecretaries.rejected, (state, action) => {
            state.loadingSecretaries = false;
            state.errorLoadingSecretaries = action.payload;
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

        builder.addCase(thunkAddLocations.pending, state => {
            if (!state.loadingLocations) state.loadingLocations = true;
            state.errorLoadingLocations = undefined;
        });
        builder.addCase(thunkAddLocations.fulfilled, (state, action) => {
            state.loadingLocations = false;
            setGenericState('plan', state);
            alert("Se han agregado las localidades correctamente.");
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
    }
});


export const { 
    selectYear, 
    incrementLevelIndex, 
    decrementLevelIndex, 
    setParent, 
    setRadioBtn, 
    setProgressNodes, 
    setFinancial, 
    setLoadingReport, 
    setNodesReport, 
    setPlanLocation,
    setLevels } = planSlice.actions;
export default planSlice.reducer;