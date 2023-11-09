import React, { useState, useEffect } from 'react';
import { useAppSelector } from "@/store";

interface Props {
    progresoAño: number[];
    año: number;
}

export const TimeLine = (props: Props) => {
    const { plan } = useAppSelector(store => store.plan)
    const { color } = useAppSelector(store => store.plan)
    const { colorimeter } = useAppSelector(store => store.plan)

    const [años, setAños] = useState<number[]>([])
    const [colors, setColors] = useState<number[]>([]);
    const [bool, setBool] = useState(false)

    const {Fecha_inicio} = plan
    
    if (!bool) {
        setBool(true)
        console.log(new Date(Fecha_inicio).getUTCFullYear());
        
        setAños([
            new Date(Fecha_inicio).getUTCFullYear(),
            new Date(Fecha_inicio).getUTCFullYear()+1, 
            new Date(Fecha_inicio).getUTCFullYear()+2, 
            new Date(Fecha_inicio).getUTCFullYear()+3
        ])
        if (color) {
            setColors(colorimeter)
        }
    }

    const [añoSelect, setAñoSelect] = useState<number>(props.año);
    const [progresoAño, setProgresoAño] = useState<number[]>(props.progresoAño);

    useEffect(() => {
        setProgresoAño(props.progresoAño)
    }, [props.progresoAño])

    const handleAños = ( event: React.MouseEvent<HTMLButtonElement>, año: number ) => {
        event.preventDefault();
        setAñoSelect(año);
    }

    return (
        <ol className="tw-flex tw-h-4/5 tw-justify-center tw-items-center tw-mx-4">
        {años.map((año: number, index: number) => (
            <li className="tw-grid tw-grid-rows-3 tw-w-full tw-justify-items-center"
                key={index}>
                <button className={`tw-rounded 
                                    tw-flex tw-justify-center tw-items-center
                                    ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-border-redColory'   : 
                                      (progresoAño[index]??0)*100 < colors[1] ? 'tw-border-yellowColory':
                                      (progresoAño[index]??0)*100 < colors[2] ? 'tw-border-greenColory' : 'tw-border-blueColory'}
                                    ${añoSelect === año ? 'tw-ring-8' : null}
                                    ${index%2 === 0 ? 'tw-row-start-1' : 'tw-row-start-3'}
                                    tw-border-4
                                    tw-w-12 tw-h-12
                                    tw-font-bold`}
                        onClick={ (event) => handleAños(event, año)}>
                    {(progresoAño[index]*100)}%
                </button>
                <div className="tw-flex tw-items-center tw-w-full tw-relative tw-row-start-2">
                    <div className={`tw-w-full tw-h-2
                                    tw-px-3
                                    tw-z-10 tw-absolute 
                                    ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-bg-redColory'   : 
                                      (progresoAño[index]??0)*100 < colors[1] ? 'tw-bg-yellowColory':
                                      (progresoAño[index]??0)*100 < colors[2] ? 'tw-bg-greenColory' : 'tw-bg-blueColory'}`}>
                    </div>
                    <div className={`tw-h-full
                                    tw-grow
                                    tw-flex tw-flex-col`}>
                        {index%2 === 0 ? 
                            <button className={`tw-grow tw-self-center
                                                tw-h-1/4 tw-w-2
                                                ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-bg-redColory'   : 
                                                  (progresoAño[index]??0)*100 < colors[1] ? 'tw-bg-yellowColory':
                                                  (progresoAño[index]??0)*100 < colors[2] ? 'tw-bg-greenColory' : 'tw-bg-blueColory'}`}
                                    onClick={ (event) => handleAños(event, año)}>
                            </button>
                        : null}
                        <button className={`tw-self-center tw-font-bold tw-font-montserrat tw-text-[#222222]
                                            ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-text-redColory'   : 
                                            (progresoAño[index]??0)*100 < colors[1] ? 'tw-text-yellowColory':
                                            (progresoAño[index]??0)*100 < colors[2] ? 'tw-text-greenColory' : 'tw-text-blueColory'}`}
                                onClick={ (event) => handleAños(event, año)}>
                            {año}
                        </button>
                        {index%2 === 1 ? 
                            <button className={`tw-grow tw-self-center
                                                tw-h-1/4 tw-w-2
                                                ${(progresoAño[index]??0)*100 < colors[0] ? 'tw-bg-redColory'   : 
                                                  (progresoAño[index]??0)*100 < colors[1] ? 'tw-bg-yellowColory':
                                                  (progresoAño[index]??0)*100 < colors[2] ? 'tw-bg-greenColory' : 'tw-bg-blueColory'}`}
                                    onClick={ (event) => handleAños(event, año)}>
                            </button>
                        : null}
                    </div>
                </div>
            </li>
        ))}
        </ol>
    );
}