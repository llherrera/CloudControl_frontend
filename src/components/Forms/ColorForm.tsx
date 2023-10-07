import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { addColor } from '../../services/api';
import { ColorProps } from '../../interfaces';

export const ColorForm = ( props : ColorProps ) => {

    const [value, setValue] = useState([[0, 24], [25, 49], [50, 74], [75, 100]]);

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
        const colors = value.map((item: number[]) => item[1])
        addColor(props.id, colors)
            .then((res) => {
                props.callback(true)
            })
            .catch((err) => {
                console.log(err);
            })
    }

    return (
        <form className='flex flex-wrap mb-2 ml-4'>
            {value.map((value: number[], index: number) => {
                return (
                    <div className='flex mx-2'>
                        <Box sx={{ width:100 }}>
                            <Slider min={0}
                                    max={100}
                                    value={value}
                                    onChange={handleChange(index)}
                                    valueLabelDisplay="auto"
                                    disableSwap/>
                        </Box>
                        <div className={`w-12 h-12 ml-2
                                        ${index=== 0 ? 'bg-red-400'   : 
                                        (index === 1 ? 'bg-yellow-400': 
                                        (index === 2 ? 'bg-green-400' : 
                                        'bg-blue-400'))}
                                        rounded-full`}>
                            <p className='mt-3 font-bold'>
                                {value[1]}
                            </p>
                        </div>
                    </div>
                )
            })}
            <button className='bg-green-300
                                px-2
                                rounded
                                font-bold'
                    onClick={handleInput}>
                Guardar
            </button>
        </form>
    )
}