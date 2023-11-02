import React, { useState } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';
import { addColor } from '../../services/api';

interface Props {
    id: number;
    callback: (bool: boolean) => void;
}

export const ColorForm = ( props : Props ) => {

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
        <form className='tw-flex tw-flex-wrap tw-mb-2 tw-ml-4'>
            {value.map((value: number[], index: number) => {
                return (
                    <div className='tw-flex tw-mx-2'>
                        <Box sx={{ width:100 }}>
                            <Slider min={0}
                                    max={100}
                                    value={value}
                                    onChange={handleChange(index)}
                                    valueLabelDisplay="auto"
                                    disableSwap/>
                        </Box>
                        <div className={`tw-w-12 tw-h-12 tw-ml-2
                                        ${index=== 0 ? 'tw-bg-redColory'   : 
                                        (index === 1 ? 'tw-bg-yellowColory': 
                                        (index === 2 ? 'tw-bg-greenColory' : 
                                        'tw-bg-blueColory'))}
                                        tw-rounded-full`}>
                            <p className='tw-mt-3 tw-font-bold tw-text-center'>
                                {value[1]}
                            </p>
                        </div>
                    </div>
                )
            })}
            <button className=' tw-bg-greenColory
                                tw-px-2
                                tw-rounded
                                tw-font-bold'
                    onClick={handleInput}>
                Guardar
            </button>
        </form>
    )
}