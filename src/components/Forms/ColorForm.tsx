import React, { useState, useEffect } from 'react';
import Slider from '@mui/material/Slider';
import Box from '@mui/material/Box';

import { notify } from '@/utils';
import { IdProps } from '@/interfaces';

import { useAppDispatch, useAppSelector } from '@/store';
import {
    thunkAddColors,
    thunkGetColors,
    thunkUpdateColors,
    thunkupdatePDTFill } from '@/store/plan/thunks';

export const ColorForm = ( {id} : IdProps ) => {
    const dispatch = useAppDispatch();
    const { colorimeter, plan } = useAppSelector(store => store.plan);
    const { id_plan } = useAppSelector(store => store.content);

    const [value, setValue] = useState(
        colorimeter.length === 0 ? [[0, 24], [25, 49], [50, 74], [75, 100]] :
        colorimeter.map((item: number, index) => [index === 0 ? 0 : colorimeter[index-1]+1, item])
    );
    const [radioBtn, setRadioBtn] = useState<string>(plan == undefined ? 'vacio' : plan.fill == null ? 'vacio' : plan.fill);
    const [shapeBtn, setShapeBtn] = useState<'radial' | 'square'>('radial');

    useEffect(() => {
        if (colorimeter.length === 0) {
            dispatch(thunkGetColors(id_plan))
            .unwrap()
            .then((res: number[]) => {
                if (res) {
                    const colors = res.map((item: number, index) => [index === 0 ? 0 : res[index-1]+1, item]);
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
            dispatch(thunkAddColors({id_plan: id, colors: colors}))
        :  dispatch(thunkUpdateColors({id_plan: id, colors: colors}))
    };

    const handleUpdateFill = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault();
        dispatch(thunkupdatePDTFill({
            id: id,
            fill: radioBtn,
            shape: shapeBtn,
        }));
    };
    
    const handleShape = (event: React.ChangeEvent<HTMLInputElement>) => {
        setShapeBtn(event.target.value as 'radial' | 'square');
    };


    const handleRadio = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setRadioBtn(value);
    };

    const colorClass = (index: number) => (
        index=== 0 ? 'tw-border-redColory'   :
        index === 1 ? 'tw-border-yellowColory':
        index === 2 ? 'tw-border-greenColory' :
        'tw-border-blueColory'
    );

    const colorClass_ = (index: number) => (
        index=== 0 ? 'tw-bg-redColory'   :
        index === 1 ? 'tw-bg-yellowColory':
        index === 2 ? 'tw-bg-greenColory' :
        'tw-bg-blueColory'
    );


    return (
        <div className='tw-pb-4'>
            <p className='tw-font-bold tw-text-xl tw-text-center tw-pt-2'>
                Colorimetría
            </p>
            <form className='tw-flex tw-flex-col md:tw-flex-row
                            tw-justify-center 
                            tw-flex-wrap tw-gap-2
                            tw-mb-4 tw-ml-4'>
                {value.map((value: number[], index: number) =>
                    <div className='tw-flex'
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
                                        tw-border-4 tw-mt-3
                                        ${colorClass(index)}
                                        ${shapeBtn === 'radial' ? 'tw-rounded-full' : ''}
                                        tw-self-center
                                        tw-overflow-hidden
                                        tw-relative`}>
                            <p className="tw-absolute tw-inset-0 tw-z-20
                                            ${shapeBtn === 'radial' ? 'tw-rounded-full' : ''}
                                            tw-bg-transparent tw-font-bold
                                            tw-flex tw-justify-center tw-items-center">
                                {value[1]}
                            </p>
                            <>
                                {radioBtn == 'vacio' ? <></>
                                    : radioBtn == 'vertical' ?
                                        <div className={`tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-transition-all ${colorClass_(index)}`}
                                            style={{ height: `${value[1]}%` }}
                                        />
                                    : radioBtn == 'radial' ?
                                        <div className={`tw-absolute tw-inset-0
                                                        ${colorClass_(index)}
                                                        ${shapeBtn === 'radial' ? 'tw-rounded-full' : ''}
                                                        tw-text-black tw-z-10`}
                                            style={{
                                                maskImage: `conic-gradient(from 0deg at 50% 50%, blue 0deg,
                                                            blue ${value[1] / 100 * 360}deg,
                                                            transparent 0deg)`
                                            }}
                                        />
                                    : radioBtn == 'completo' ?
                                        <div className={`tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-h-full tw-transition-all ${colorClass_(index)}`} />
                                    : null}
                            </>
                        </div>
                    </div>
                )}
                <button className=' tw-bg-greenColory hover:tw-bg-green-400
                                    tw-text-white hover:tw-text-black
                                    tw-rounded
                                    tw-px-2 tw-my-2
                                    tw-font-bold'
                        onClick={handleInput}>
                    Guardar
                </button>
            </form>
            <form className='tw-flex tw-flex-col md:tw-flex-row tw-justify-center tw-items-center tw-gap-8'>
                <div>
                    <p className='tw-font-bold tw-text-xl tw-text-center'>Llenado</p>
                    <ul className='tw-flex tw-gap-4'>
                        {['vacio', 'vertical', 'radial', 'completo'].map((item) => (
                            <div key={item}>
                                <input
                                    type="radio"
                                    id={item}
                                    value={item}
                                    className='tw-mr-2'
                                    onChange={handleRadio}
                                    checked={radioBtn === item}
                                />
                                <label htmlFor={item}>{item.charAt(0).toUpperCase() + item.slice(1)}</label>
                            </div>
                        ))}
                    </ul>
                </div>
                
                <div>
                    <p className='tw-font-bold tw-text-xl tw-text-center'>Forma</p>
                    <ul className='tw-flex tw-gap-4'>
                        <div>
                            <input
                                type="radio"
                                id='forma-radial'
                                value='radial'
                                className='tw-mr-2'
                                onChange={handleShape}
                                checked={shapeBtn === 'radial'}
                            />
                            <label htmlFor="forma-radial">Radial</label>
                        </div>
                        <div>
                            <input
                                type="radio"
                                id='forma-cubo'
                                value='square'
                                className='tw-mr-2'
                                onChange={handleShape}
                                checked={shapeBtn === 'square'}
                            />
                            <label htmlFor="forma-cubo">Cubo</label>
                        </div>
                    </ul>
                </div>
                <button className='tw-bg-greenColory hover:tw-bg-green-400
                                   tw-text-white hover:tw-text-black
                                   tw-px-2 tw-my-2 tw-font-bold tw-rounded'
                    onClick={handleUpdateFill}>
                    Guardar
                </button>
            </form>
        </div>
    );
}