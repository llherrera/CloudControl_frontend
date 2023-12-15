import { createAction, createAsyncThunk } from "@reduxjs/toolkit";

import { UnitInterface, ErrorBasicInterface, GetUnitProps, AddUnitProps } from "@/interfaces";
import { parseErrorAxios } from "@/utils";

import { getUnitNodeAndYears, addUnitNodeAndYears } from "@/services/api";

export const thunkGetUnit = createAsyncThunk<UnitInterface, GetUnitProps, { rejectValue: ErrorBasicInterface}>(
    "unit/getUnit", 
    async (props: GetUnitProps, { rejectWithValue }) => {
        try {
            const res = await getUnitNodeAndYears(props.idPDT, props.idNode);
            if (res.Years.length === 0) {
                return rejectWithValue({'error_code': '404', 'error_description': 'No se encontró la unidad'});
            }
            
            let years = res.Years;
            years = years.map((item:any) => {
                return {
                    year: new Date(item.Año).getUTCFullYear(),
                    programed: item.Programacion_fisica,
                    phisicalExecuted: item.Ejecucion_fisica,
                    finalcialExecuted: item.Ejecucion_financiera
                }
            });
            res.years = years;
            const {Codigo, Descripcion, Indicador, Linea_base, Meta, responsable} = res.Node;
            const para = {
                code: Codigo,
                description: Descripcion,
                indicator: Indicador,
                base: Linea_base,
                goal: Meta,
                responsible: responsable,
            }
            const result: UnitInterface = {...para, years};

            return result;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkAddUnit = createAsyncThunk<UnitInterface, AddUnitProps, { rejectValue: ErrorBasicInterface}>(
    "unit/addUnit", 
    async (props: AddUnitProps, { rejectWithValue }) => {
        try {
            const res = await addUnitNodeAndYears(props.idPDT, props.idNode, props.unit, props.years);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);