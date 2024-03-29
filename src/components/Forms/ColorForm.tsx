import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { ToastContainer } from 'react-toastify';
import { notify } from '@/utils';

import { useAppDispatch, useAppSelector } from '@/store';
import { 
    thunkAddColors, 
    thunkGetColors,
    thunkUpdateColors } from '@/store/plan/thunks';

import { ColorFromProps } from '@/interfaces';

export const ColorForm = ( props : ColorFromProps ) => {
    const dispatch = useAppDispatch();
    const { colorimeter } = useAppSelector((state) => state.plan);
    const { id_plan } = useAppSelector((state) => state.content);
    
    const [value, setValue] = useState(
        colorimeter.length === 0 ? [[0, 24], [25, 49], [50, 74], [75, 100]] :
        colorimeter.map((item: number, index) => [colorimeter[(index-1) < 0 ? 0 : index-1]+1, item])
    );

    useEffect(() => {
        if (colorimeter.length === 0) {
            dispatch(thunkGetColors(id_plan.toString()))
            .unwrap()
            .then((res: number[]) => {
                if (res) {
                    const colors = res.map((item: number, index) => [res[(index-1) < 0 ? 0 : index-1]+1, item]);
                    setValue(colors);
                }
            });
        }
    }, []);

    const handleChange = (index: number) => (event: Event, newValue: number | number[]) => {
        const updateValue = [...value];
        updateValue[index] = Array.isArray(newValue) ? newValue : [newValue, newValue + 1];
        if (index < updateValue.length - 1) {
            updateValue[index + 1][0] = updateValue[index][1] + 1;
        }
        setValue(updateValue);
    };

    const handleInput = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        const colors = value.map((item: number[]) => item[1]);
        colorimeter.length === 0 ?
            dispatch(thunkAddColors({id_plan: props.id, colors: colors}))
            .unwrap()
            .then(() => {
                notify("Colorimetria guardados correctamente");
            })
        :  dispatch(thunkUpdateColors({id_plan: props.id, colors: colors}))
            .unwrap()
            .then(() => {
                notify("Colorimetria actualizados correctamente");
            });
    }

    return (
        <form className='tw-flex tw-flex-col md:tw-flex-row 
                        tw-flex-wrap 
                        tw-mb-2 tw-ml-4'>
            <ToastContainer />
            {value.map((value: number[], index: number) => {
                return (
                    <div className='tw-flex tw-mx-2'
                        key={index}>
                        <Box sx={{ width:100, display:'flex', alignItems:'center' }}>
                            <Slider min={0}
                                    max={100}
                                    value={value}
                                    onChange={handleChange(index)}
                                    valueLabelDisplay="auto"
                                    disableSwap/>
                        </Box>
                        <div className={`tw-w-12 tw-h-12 tw-ml-3
                                        ${index=== 0 ? 'tw-bg-redColory'   : 
                                        (index === 1 ? 'tw-bg-yellowColory': 
                                        (index === 2 ? 'tw-bg-greenColory' : 
                                        'tw-bg-blueColory'))}
                                        tw-rounded-full`}>
                            <p className='tw-mt-3 tw-font-bold tw-text-center tw-text-white'>
                                {value[1]}
                            </p>
                        </div>
                    </div>
                )
            })}
            <button className=' tw-bg-greenColory hover:tw-bg-green-400
                                tw-text-white hover:tw-text-black
                                tw-px-2
                                tw-rounded
                                tw-font-bold'
                    onClick={handleInput}>
                Guardar
            </button>
        </form>
    );
}