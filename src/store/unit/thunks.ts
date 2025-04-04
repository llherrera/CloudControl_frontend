import { createAsyncThunk } from "@reduxjs/toolkit";

import {
    UnitInterface,
    ErrorBasicInterface,
    GetUnitProps,
    AddUnitProps,
    propsIndicator,
    PropsExecution,
    UnitNodeResultInterface,
    PropsAddUnitResult } from "@/interfaces";
import { parseErrorAxios } from "@/utils";

import {
    getUnitNodeAndYears,
    addUnitNodeAndYears,
    updateUnitNodeAndYears,
    updateIndicator,
    updateExecution,
    addUnitNodeResult,
    updateUnitNodeResult } from "@/services/api";

export const thunkGetUnit = createAsyncThunk<UnitInterface, GetUnitProps, { rejectValue: ErrorBasicInterface}>(
    "unit/getUnit", 
    async (props: GetUnitProps, { rejectWithValue }) => {
        try {
            const res = await getUnitNodeAndYears(props.id_plan, props.id_node);
            if (res.Years.length === 0) {
                return rejectWithValue({'error_code': '404', 'error_description': 'No se encontró la unidad'});
            }
            
            let years = res.Years;
            years = years.map((item:any) => {
                return {
                    year: new Date(item.year).getUTCFullYear(),
                    physical_programming: item.physical_programming,
                    physical_execution: item.physical_execution,
                    financial_execution: item.financial_execution
                }
            });
            res.years = years;
            const {code, id_node, description, indicator, base_line, goal, responsible, link_hv_indicator} = res.Node;
            const para = {
                code: code,
                id_node: id_node,
                description: description,
                indicator: indicator,
                base: base_line,
                goal: goal,
                responsible: responsible,
                hv_indicator: link_hv_indicator
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
            const res = await addUnitNodeAndYears(props.id_plan, props.id_node, props.unit, props.years, props.id_city!);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkUpdateUnit = createAsyncThunk<UnitInterface, AddUnitProps, { rejectValue: ErrorBasicInterface}>(
    "unit/updateUnit", 
    async (props: AddUnitProps, { rejectWithValue }) => {
        try {
            const res = await updateUnitNodeAndYears(props.id_plan, props.id_node, props.unit, props.years);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkUpdateIndicator = createAsyncThunk<string, propsIndicator, {rejectValue: ErrorBasicInterface}>(
    "unit/updateIndicator",
    async (props: propsIndicator, { rejectWithValue }) => {
        try {
            const res = await updateIndicator(props.id_node, props.file);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkUpdateExecution = createAsyncThunk<void, PropsExecution, { rejectValue: ErrorBasicInterface }>(
    'unit/updateExecution',
    async (props: PropsExecution, { rejectWithValue }) => {
        try {
            const res = await updateExecution(props.date, props.value, props.code, props.user_id, props.plan_id, props.reason);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkDenegateExecution = createAsyncThunk<void, PropsExecution, { rejectValue: ErrorBasicInterface }>(
    'unit/denegateExecution',
    async (props: PropsExecution, { rejectWithValue }) => {
        try {
            const res = await updateExecution(props.date, props.value, props.code, props.user_id, props.plan_id, props.reason);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkAddUnitNodeResult = createAsyncThunk<void, PropsAddUnitResult, { rejectValue: ErrorBasicInterface }>(
    'unit/addUnitNodeResult',
    async (props: PropsAddUnitResult, { rejectWithValue }) => {
        try {
            const res = await addUnitNodeResult(props.id_plan, props.id_node, props.node, props.nodes);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);

export const thunkUpdateUnitNodeResult = createAsyncThunk<void, PropsAddUnitResult, { rejectValue: ErrorBasicInterface }>(
    'unit/updateUnitNodeResult',
    async (props: PropsAddUnitResult, { rejectWithValue }) => {
        try {
            const res = await updateUnitNodeResult(props.node, props.nodes);
            return res;
        } catch (err) {
            const result = parseErrorAxios(err);
            return rejectWithValue(result);
        }
    }
);