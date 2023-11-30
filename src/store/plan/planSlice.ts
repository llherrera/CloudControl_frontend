import { PayloadAction, createSlice } from "@reduxjs/toolkit";

import { InitialStatePlanInterface, NodoInterface, Node } from "@/interfaces";

import { thunkGetPDTid, thunkAddPDT, 
    thunkGetColors, thunkAddColors,
    thunkGetNodes, thunkUpdateYears, 
    thunkGetLevelsById, thunkGetLevelName,
    thunkGetLogo, thunkGetSecretaries } from "./thunks";

const getInitialState = (): InitialStatePlanInterface => {
    return {
        loadingPlan: false,
        loadingColors: false,
        loadingNodes: false,
        loadingLevels: false,
        loadingNamesTree: false,
        loadingLogo: false,
        loadingSecretaries: false,
        loadingReport: false,
        errorLoadingPlan: undefined,
        errorLoadingColors: undefined,
        errorLoadingNodes: undefined,
        errorLoadingLevels: undefined,
        errorLoadingNamesTree: undefined,
        errorLoadingLogo: undefined,
        errorLoadingSecretaries: undefined,
        plan: undefined,
        colorimeter: [],
        color: undefined,
        nodes: [],
        nodesReport: [],
        years: [],
        yearSelect: undefined,
        levels: [],
        indexLevel: undefined,
        parent: null,
        progressNodes: [],
        financial: [],
        namesTree: [['Dimension', 'Nivel']],
        radioBtn: 'fisica',
        url: undefined,
        secretaries: [],
    };
};

export const planSlice = createSlice({
    name: "plan",
    initialState: getInitialState,
    reducers: {
        selectYear: (state, action: PayloadAction<number>) => {
            state.yearSelect = action.payload
        },
        incrementLevelIndex: (state, action: PayloadAction<number>) => {
            state.indexLevel = action.payload
        },
        decrementLevelIndex: (state, action: PayloadAction<number>) => {
            state.indexLevel = action.payload
        },
        setParent: (state, action: PayloadAction<string | null>) => {
            state.parent = action.payload
        },
        setRadioBtn: (state, action: PayloadAction<string>) => {
            state.radioBtn = action.payload
        },
        setProgressNodes: (state, action: PayloadAction<number[]>) => {
            state.progressNodes = action.payload
        },
        setFinancial: (state, action: PayloadAction<number[]>) => {
            state.financial = action.payload
        },
        setLoadingReport: (state, action: PayloadAction<boolean>) => {
            state.loadingReport = action.payload
        },
        setNodesReport: (state, action: PayloadAction<Node[]>) => {
            state.nodesReport = action.payload
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
            })
            state.nodes = temp;
        });
        builder.addCase(thunkGetNodes.rejected, (state, action) => {
            state.loadingNodes = false;
            state.errorLoadingNodes = action.payload;
        });


        builder.addCase(thunkUpdateYears, (state, action) => {
            state.years = action.payload;
        });


        builder.addCase(thunkGetLevelsById.pending, state => {
            if (!state.loadingLevels) state.loadingLevels = true;
            state.errorLoadingLevels = undefined;
        });
        builder.addCase(thunkGetLevelsById.fulfilled, (state, action) => {
            state.loadingLevels = false;
            state.levels = action.payload;
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
        });
        builder.addCase(thunkGetLogo.rejected, (state, action) => {
            state.loadingLogo = false;
            state.errorLoadingLogo = action.payload;
        });


        builder.addCase(thunkGetSecretaries.pending, state => {
            if (!state.loadingSecretaries) state.loadingSecretaries = true;
            state.errorLoadingSecretaries = undefined;
        });
        builder.addCase(thunkGetSecretaries.fulfilled, (state, action) => {
            state.loadingSecretaries = false;
            state.secretaries = action.payload;
        });
        builder.addCase(thunkGetSecretaries.rejected, (state, action) => {
            state.loadingSecretaries = false;
            state.errorLoadingSecretaries = action.payload;
        });
    }
});
export const { selectYear, incrementLevelIndex, decrementLevelIndex, 
        setParent, setRadioBtn, setProgressNodes, setFinancial, 
        setLoadingReport, setNodesReport } = planSlice.actions;
export default planSlice.reducer;