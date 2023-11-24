import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from "@/store";
import { selectYear } from '@/store/plan/planSlice'; 

import { TimeLineProps } from '@/interfaces';

export const TimeLine = (props: TimeLineProps) => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { years, yearSelect, plan, colorimeter } = useAppSelector(store => store.plan);

    useEffect(() => {
        if (years.length !== 0) {
            dispatch(selectYear(years[0]))
        }
    }, [years])

    const handleAños = ( event: React.MouseEvent<HTMLButtonElement>, year: number ) => {
        event.preventDefault();
        dispatch(selectYear(year))
    }

    const handleBtnEvidence = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        event.preventDefault();
        if (plan) {
            const { id_plan } = plan
            navigate(`/PlanIndicativo/evidencias`, {state: {id: id_plan}})
        }
    }

    return (
        <ol className="tw-flex tw-justify-center tw-items-center tw-mx-4">
        {years.map((year: number, index: number) => (
            <li className="tw-grid tw-grid-rows-3 tw-w-full tw-justify-items-center"
                key={index}>
                <button className={`tw-rounded 
                                    tw-flex tw-justify-center tw-items-center
                                    ${
                                    parseInt( ((props.yearProgress[index]??0)*100).toString()) < 0 ? 'tw-border-gray-400' :
                                    parseInt( ((props.yearProgress[index]??0)*100).toString()) < colorimeter[0] ? 'tw-border-redColory'   : 
                                    parseInt( ((props.yearProgress[index]??0)*100).toString()) < colorimeter[1] ? 'tw-border-yellowColory':
                                    parseInt( ((props.yearProgress[index]??0)*100).toString()) < colorimeter[2] ? 'tw-border-greenColory' :
                                    'tw-border-blueColory'}
                                    ${yearSelect === year ? 'tw-ring-8' : null}
                                    ${index%2 === 0 ? 'tw-row-start-1' : 'tw-row-start-3'}
                                    tw-border-4
                                    tw-w-12 tw-h-12
                                    tw-font-bold`}
                        onClick={ (event) => handleAños(event, year)}
                        title={`Dar click para ver los porcentajes de ejecucion del año ${year}`}>
                    { parseInt ( ((props.yearProgress[index] === undefined || props.yearProgress[index] < 0 ? 0 : props.yearProgress[index])*100).toString())}%
                </button>
                <div className="tw-flex tw-items-center tw-w-full tw-relative tw-row-start-2">
                    <div className={`tw-w-full tw-h-2
                                    tw-px-3
                                    tw-z-10 tw-absolute 
                                    ${
                                    parseInt ( ((props.yearProgress[index]??0)*100).toString()) < 0 ? 'tw-bg-gray-400' :
                                    parseInt ( ((props.yearProgress[index]??0)*100).toString()) < colorimeter[0] ? 'tw-bg-redColory'   : 
                                    parseInt ( ((props.yearProgress[index]??0)*100).toString()) < colorimeter[1] ? 'tw-bg-yellowColory':
                                    parseInt ( ((props.yearProgress[index]??0)*100).toString()) < colorimeter[2] ? 'tw-bg-greenColory' :
                                    'tw-bg-blueColory'}`}>
                    </div>
                    <div className={`tw-h-full
                                    tw-grow
                                    tw-flex tw-flex-col`}>
                        {index%2 === 0 ? 
                            <button className={`tw-grow tw-self-center
                                                tw-h-1/4 tw-w-2
                                                ${
                                                (props.yearProgress[index]??0)*100 < 0 ? 'tw-bg-gray-400' :
                                                (props.yearProgress[index]??0)*100 < colorimeter[0] ? 'tw-bg-redColory'   : 
                                                (props.yearProgress[index]??0)*100 < colorimeter[1] ? 'tw-bg-yellowColory':
                                                (props.yearProgress[index]??0)*100 < colorimeter[2] ? 'tw-bg-greenColory' :
                                                'tw-bg-blueColory'}`}
                                    onClick={ (event) => handleAños(event, year)}>
                            </button>
                        : null}
                        <button className={`tw-self-center tw-font-bold tw-font-montserrat tw-text-[#222222]
                                            ${
                                            (props.yearProgress[index]??0)*100 < 0 ? 'tw-text-gray-400' :
                                            (props.yearProgress[index]??0)*100 < colorimeter[0] ? 'tw-text-redColory'   : 
                                            (props.yearProgress[index]??0)*100 < colorimeter[1] ? 'tw-text-yellowColory':
                                            (props.yearProgress[index]??0)*100 < colorimeter[2] ? 'tw-text-greenColory' :
                                            'tw-text-blueColory'}`}
                                onClick={ (event) => handleAños(event, year)}>
                            {year}
                        </button>
                        {index%2 === 1 ? 
                            <button className={`tw-grow tw-self-center
                                                tw-h-1/4 tw-w-2
                                                ${
                                                (props.yearProgress[index]??0)*100 < 0 ? 'tw-bg-gray-400' :
                                                (props.yearProgress[index]??0)*100 < colorimeter[0] ? 'tw-bg-redColory'   : 
                                                (props.yearProgress[index]??0)*100 < colorimeter[1] ? 'tw-bg-yellowColory':
                                                (props.yearProgress[index]??0)*100 < colorimeter[2] ? 'tw-bg-greenColory' :
                                                'tw-bg-blueColory'}`}
                                    onClick={ (event) => handleAños(event, year)}>
                            </button>
                        : null}
                    </div>
                </div>
            </li>
        ))}
        <button className={`tw-rounded 
                            tw-flex tw-justify-center tw-items-center
                            tw-border-4
                            tw-self-center
                            tw-w-12 tw-h-12
                            ${
                            props.yearsProgress < 0 ? 'tw-border-gray-400' :
                            props.yearsProgress < colorimeter[0] ? 'tw-border-redColory'   : 
                            props.yearsProgress < colorimeter[1] ? 'tw-border-yellowColory':
                            props.yearsProgress < colorimeter[2] ? 'tw-border-greenColory' :
                            'tw-border-blueColory'}
                            tw-ml-3 tw-px-2`}
                onClick={handleBtnEvidence}>
            <p className="tw-break-words tw-font-bold">
                {props.yearsProgress == undefined || props.yearsProgress < 0 ? 0 : props.yearsProgress}%
            </p>
        </button>
        </ol>
    );
}