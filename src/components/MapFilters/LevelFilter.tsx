import  React, { useState, useEffect } from 'react';
import { notify } from '@/utils';

import { useAppDispatch, useAppSelector } from '@/store';
import { setEvidences } from '@/store/evidence/evidenceSlice';
import { setCode, setLocs } from "@/store/content/contentSlice";

import { NodeInterface, EvidenceInterface, Codes, EvidencesLocs } from '@/interfaces';
import { getLevelNodes, getCodeEvidences, getLatLngs } from '@/services/api';

export const LevelsFilters = () => {
    const dispatch = useAppDispatch();

    const { levels } = useAppSelector(store => store.plan);
    const { id_plan, node_code, secretary, location } = useAppSelector(store => store.content);

    const [programs, setPrograms] = useState<NodeInterface[][]>([]);
    const [index_, setIndex_] = useState<number[]>([0, 0]);
    const [codes, setCodes] = useState<Codes[]>([]);

    useEffect(() => {
        const fetch = async () => {
            if (levels.length === 0) return;
            let parent: (string | null) = null;
            let response = [] as NodeInterface[][];
            const { id_level } = levels[0];
            if (id_level) {
                const res: NodeInterface[] = await getLevelNodes({id_level: id_level, parent: parent});
                if (res.length > 0) {
                    parent = res[index_[0]].id_node;
                    response.push(res);
                }
            }
            for (let i = 1; i < 2; i++) {
                const { id_level } = levels[i];
                if (id_level) {
                    const res: NodeInterface[] = await getLevelNodes({id_level: id_level, parent: parent});
                    if (res.length === 0) break;
                    parent = res[index_[i]].id_node;
                    response.push(res);
                }
            }
            response[0].push({
                id_node: '',
                name: 'Todas',
                description: '',
                parent: null,
                id_level: 0,
                weight: 0,
            })
            setPrograms(response);
            dispatch(setCode(programs[1][index_[1]].id_node));
        }
        fetch();
    }, [index_]);

    useEffect(() => {
        const fetch = async () => {
            if (programs.length === 0) return;
            if (programs.length === 1) {
                dispatch(setEvidences([]));
                return notify("No hay evidencias para mostrar");
            }
            await getCodeEvidences(programs[1][index_[1]].id_node, id_plan)
            .then((res) => {
                setCodes(res);
            });
        }
        fetch();
    }, [programs]);

    useEffect(() => {
        getLatLngs(node_code, secretary, location)
        .then(res => {
            dispatch(setLocs(res));
        });
    }, [node_code]);

    //obtiene los codigos de las metas del programa seleccionado
    /**
     * la idea es cruzar los codigos de las metas con las evidencias
     * y asi obtener las evidencias de la meta
     */
    useEffect(() => {
        if (codes.length === 0) {
            dispatch(setEvidences([]));
        } else {
            const tempCodes = codes.map(c => c.code);
            const evidencesLocal = localStorage.getItem('evidences');
            const evidens = JSON.parse(evidencesLocal as string) as EvidenceInterface[];
            let temp = [] as EvidenceInterface[];
            evidens.forEach((item: EvidenceInterface) => {
                if (tempCodes.includes(item.code)) {
                    const temp_ = codes.find(co => co.code === item.code)
                    temp.push({...item, name: temp_?.name, responsible: temp_?.responsible});
                }
            });
            dispatch(setEvidences(temp));
        }
    }, [codes]);

    const handleChangePrograms = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = event.target.selectedIndex;
        let newIndex_ = [...index_];
        if (newIndex === 0) {
            newIndex_[index] = newIndex;
            setIndex_(newIndex_);
        } else if (index === 0 && newIndex === programs[index].length -1) {
            const evidencesLocal = localStorage.getItem('evidences');
            const evidens = JSON.parse(evidencesLocal as string);
            dispatch(setEvidences(evidens));
        } else {
            newIndex_[index] = newIndex;
            for (let i = index+1; i < newIndex_.length; i++) {
                newIndex_[i] = 0;
            }
            setIndex_(newIndex_);
        }
    };
    
    return (
        <div className='tw-flex tw-justify-center tw-mb-3'>
            {programs.map((program, i) => (
                <div className='tw-flex tw-flex-col' key={program[i].name}>
                    <label className='tw-text-center tw-mb-3'>
                        <p className='  tw-inline-block tw-bg-white
                                        tw-p-1 tw-rounded tw-font-bold'>
                            {levels[i].name}
                        </p>
                    </label>
                    <select value={program[index_[i]].name}
                            onChange={(e)=>handleChangePrograms(i, e)}
                            className=" tw-border tw-border-gray-300
                                        tw-rounded
                                        tw-mr-3 tw-w-24">
                        {program.map((node) => (
                            <option value={node.name} key={node.name}>{node.name}</option>
                        ))}
                    </select>
                </div>
            ))}
        </div>
    )
}