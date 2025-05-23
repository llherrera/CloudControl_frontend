import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { useAppSelector, useAppDispatch } from "@/store";
import { selectYear, setCalcDone } from '@/store/plan/planSlice';

import { NodesWeight } from '@/interfaces';
import { decode } from "@/utils";

export const TimeLine = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { token_info } = useAppSelector(store => store.auth);
    const { years, yearSelect, plan, colorimeter, calcDone,
            parent, nodes } = useAppSelector(store => store.plan);

    const [yearProgress, setYearProgress] = useState<number[]>([]);
    const [yearsProgress, setYearsProgress] = useState(0);

    const [rol, setRol] = useState("");

    if (plan == undefined) return <>Plan no definido</>;

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
        }
    }, []);

    useEffect(() => {
        if (years.length !== 0) dispatch(selectYear(years[0]));
    }, [years]);

    useEffect(() => {
        if (!calcDone) return;
        getYearProgress();
    }, [yearSelect, nodes, calcDone]);

    const getYearProgress = () => {
        let pesosStr = localStorage.getItem('UnitNode');
        if (pesosStr == undefined) pesosStr = '[]';

        let pesosNodo = JSON.parse(pesosStr);
        let progreso = [] as number[];
        const nodoss = pesosNodo.filter((item: NodesWeight) => item.parent === parent);

        if (nodoss.length === 0) {
            setYearsProgress(-1);
            setYearProgress([-1,-1,-1,-1]);
            return;
        }
        for (let i = 0; i < years.length; i++) {
            let temp = 0;
            nodoss.forEach((item: NodesWeight) => {
                const { percents } = item;
                if (percents) {
                    percents.sort((a,b)=>a.year - b.year);
                    temp += (percents[i].progress > 0 ? percents[i].progress : 0)*(item.weight/100);
                }
            });
            temp = Math.round(temp*100)/100;
            progreso.push(temp);
        }
        let temp = progreso.reduce((a, b) => a + b, 0);
        temp = Math.round(temp*100/years.length);
        setYearsProgress(temp);
        setYearProgress(progreso);
    };

    const handleYears = ( event: React.MouseEvent<HTMLButtonElement>, year: number ) => {
        event.preventDefault();
        dispatch(selectYear(year));
    };

    const handleBtnEvidence = ( event: React.MouseEvent<HTMLButtonElement> ) => {
        event.preventDefault();
        if (rol === '') return;
        if (plan) {
            dispatch(setCalcDone(false));
            navigate(`/PlanIndicativo/evidencias`);
        }
    };

    const colorClass = (index: number) => (
        parseInt( ((yearProgress[index]??0)*100).toString()) < 0 ?
        'tw-border-gray-400 hover:tw-ring-4 hover:tw-ring-gray-200' :
        parseInt( ((yearProgress[index]??0)*100).toString()) < colorimeter[0] ?
        'tw-border-redColory hover:tw-ring-4 hover:tw-ring-red-200' :
        parseInt( ((yearProgress[index]??0)*100).toString()) < colorimeter[1] ?
        'tw-border-yellowColory hover:tw-ring-4 hover:tw-ring-yellow-200' :
        parseInt( ((yearProgress[index]??0)*100).toString()) < colorimeter[2] ?
        'tw-border-greenColory hover:tw-ring-4 hover:tw-ring-green-200' :
        'tw-border-blueColory hover:tw-ring-4 hover:tw-ring-blue-200'
    );

    const colorYearCla = (index: number) => (
        (yearProgress[index]??0)*100 < 0 ? 'tw-bg-gray-400' :
        (yearProgress[index]??0)*100 < colorimeter[0] ? 'tw-bg-redColory' :
        (yearProgress[index]??0)*100 < colorimeter[1] ? 'tw-bg-yellowColory' :
        (yearProgress[index]??0)*100 < colorimeter[2] ? 'tw-bg-greenColory' :
        'tw-bg-blueColory'
    );

    const colorTextCla = (index: number) => (
        (yearProgress[index]??0)*100 < 0 ? 'tw-text-gray-400' :
        (yearProgress[index]??0)*100 < colorimeter[0] ? 'tw-text-redColory' :
        (yearProgress[index]??0)*100 < colorimeter[1] ? 'tw-text-yellowColory' :
        (yearProgress[index]??0)*100 < colorimeter[2] ? 'tw-text-greenColory' :
        'tw-text-blueColory'
    );

    const colorYearsCla = () => (
        yearsProgress < 0 ?
        'tw-border-gray-400 hover:tw-ring-4 hover:tw-ring-gray-200' :
        yearsProgress < colorimeter[0] ?
        'tw-border-redColory hover:tw-ring-4 hover:tw-ring-red-200' :
        yearsProgress < colorimeter[1] ?
        'tw-border-yellowColory hover:tw-ring-4 hover:tw-ring-yellow-200' :
        yearsProgress < colorimeter[2] ?
        'tw-border-greenColory hover:tw-ring-4 hover:tw-ring-green-200' :
        'tw-border-blueColory hover:tw-ring-4 hover:tw-ring-blue-200'
    );

    const colorYearsCla_ = () => (
        yearsProgress < 0 ? 'tw-bg-gray-400 group-hover:tw-bg-gray-200' :
        yearsProgress < colorimeter[0] ? 'tw-bg-redColory group-hover:tw-bg-red-200' :
        yearsProgress < colorimeter[1] ? 'tw-bg-yellowColory group-hover:tw-bg-yellow-200' :
        yearsProgress < colorimeter[2] ? 'tw-bg-greenColory group-hover:tw-bg-green-200' :
        'tw-bg-blueColory group-hover:tw-bg-blue-200'
    );

    return (
        <ol className="tw-flex tw-justify-center tw-items-center tw-mx-4">
        {years.map((year: number, index: number) =>
            <li className="tw-grid tw-grid-rows-3 tw-w-full tw-justify-items-center"
                key={year}>
                <button className={`${plan.shape === 'radial' ? 'tw-rounded' : 'tw-rounded-full tw-overflow-hidden'} tw-border-4
                                    tw-flex tw-justify-center tw-items-center
                                    tw-transition hover:tw-scale-110
                                    ${colorClass(index)}
                                    ${yearSelect === year ? 'tw-ring-8' : null}
                                    ${index%2 === 0 ?
                                        'tw-row-start-1 hover:tw--translate-y-1' :
                                        'tw-row-start-3 hover:tw-translate-y-1'}
                                    tw-w-12 tw-h-12
                                    tw-font-bold
                                    tw-relative`}
                        onClick={event => handleYears(event, year)}
                        title={`Dar click para ver los porcentajes de ejecucion del año ${year}`}>
                    <div className='tw-absolute tw-inset-0 tw-z-20
                                    tw-rounded-full tw-bg-transparent tw-text-black
                                    tw-flex tw-justify-center tw-items-center'>
                        { parseInt ( ((yearProgress[index] === undefined || yearProgress[index] < 0 ? 0 : yearProgress[index])*100).toString())}%
                    </div>
                    {plan.fill === 'vertical' ?
                        <div className={`tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-transition-all ${colorYearCla(index)}`}
                            style={{
                                height: `${ parseInt( ((yearProgress[index] === undefined || yearProgress[index] < 0 ? 0 : yearProgress[index])*100).toString())}%`,
                            }}
                        /> :
                    plan.fill === 'radial' ?
                        <div className={`tw-absolute tw-inset-0
                                        ${colorYearCla(index)}
                                        tw-text-black tw-z-10`}
                            style={{
                                maskImage: `conic-gradient(from 0deg at 50% 50%, blue 0deg,
                                            blue ${parseInt(((yearProgress[index] === undefined || yearProgress[index] < 0 ? 0 : yearProgress[index])*100).toString())/100*360}deg,
                                            transparent 0deg)`,
                            }}
                        /> :
                    plan.fill === 'completo' ?
                        <div className={`tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-h-full tw-transition-all ${colorYearCla(index)}`}/>
                    : null
                    }
                </button>
                <div className="tw-flex tw-items-center tw-w-full tw-relative tw-row-start-2">
                    <button className={`tw-w-full tw-h-2 tw-px-3
                                        tw-absolute
                                        tw-transition hover:tw-scale-110
                                        ${index%2 === 1 ? 'hover:tw-translate-y-1' : 'hover:tw--translate-y-1'}
                                        ${colorClass(index)}
                                        ${colorYearCla(index)}`}>
                    </button>
                    <div className={`tw-h-full tw-grow
                                    tw-flex tw-flex-col`}>
                        {index%2 === 0 ?
                            <button className={`tw-grow tw-self-center
                                                tw-h-1/4 tw-w-2
                                                ${colorYearCla(index)}`}
                                    onClick={event => handleYears(event, year)}>
                            </button>
                        : null}
                        <button className={`tw-self-center
                                            tw-font-bold tw-font-montserrat
                                            tw-text-[#222222]
                                            tw-transition
                                            ${index%2 === 0 ?
                                                'hover:tw-translate-y-1' :
                                                'hover:tw--translate-y-1'}
                                            hover:tw-scale-110
                                            ${colorTextCla(index)}`}
                                onClick={event => handleYears(event, year)}>
                            {year}
                        </button>
                        {index%2 === 1 ?
                            <button className={`tw-grow tw-self-center
                                                tw-h-1/4 tw-w-2
                                                ${colorYearCla(index)}`}
                                    onClick={event => handleYears(event, year)}>
                            </button>
                        : null}
                    </div>
                </div>
            </li>
        )}
        <button className={`${plan.shape === 'radial' ? 'tw-rounded' : 'tw-rounded-full tw-overflow-hidden tw-w-[6vw]'} tw-border-4
                            tw-flex tw-justify-center tw-items-center
                            tw-self-center
                            tw-w-12 tw-h-12
                            tw-transition
                            hover:tw--translate-y-1 hover:tw-scale-110
                            ${colorYearsCla()}
                            tw-ml-3 tw-px-2
                            tw-relative`}
                title='Dar click para ver las evidencias del plan indicativo'
                onClick={handleBtnEvidence}>
            <p className="tw-break-words tw-font-bold tw-z-20">
                {yearsProgress == undefined || yearsProgress < 0 ? 0 : yearsProgress}%
            </p>
            {plan.fill === 'vertical' ?
                <div className={`tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-transition-all ${colorYearsCla_()}`}
                    style={{
                        height: `${yearsProgress}%`,
                    }}
                /> :
            plan.fill === 'radial' ?
                <div className={`tw-absolute tw-inset-0
                                ${colorYearsCla_()}
                                tw-text-black tw-z-10`}
                    style={{
                        maskImage: `conic-gradient(from 0deg at 50% 50%, blue 0deg,
                                    blue ${yearsProgress/100*360}deg,
                                    transparent 0deg)`,
                    }}
                /> :
            plan.fill === 'completo' ?
                <div className={`tw-absolute tw-bottom-0 tw-left-0 tw-w-full tw-h-full tw-transition-all ${colorYearsCla_()}`}/>
            : null
            }
        </button>
        </ol>
    );
}