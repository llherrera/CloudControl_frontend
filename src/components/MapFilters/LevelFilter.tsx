import  React, { useState, useEffect } from 'react';
import { notify } from '@/utils';

import { useAppSelector } from '@/store';

import { NodeInterface, PropsCallback, ListNode } from '@/interfaces';
import { getLevelNodes, getListNodes } from '@/services/api';

export const LevelsSelect = ({callback}: PropsCallback) => {
    const { levels } = useAppSelector(store => store.plan);
    const [programs, setPrograms] = useState<NodeInterface[][]>([]);
    const [index_, setIndex_] = useState<number[]>(levels.map(() => 0));

    useEffect(() => {
        const fetch = async () => {
            if (levels.length === 0) return;
            let parent: (string | null) = null;
            let response = [] as NodeInterface[][];
            for (let i = 0; i < levels.length; i++) {
                const { id_level } = levels[i];
                if (id_level) {
                    const res: NodeInterface[] = await getLevelNodes({id_level: id_level, parent: parent});
                    parent = res[index_[i]].id_node;
                    response.push(res);
                }
            }
            response[levels.length - 1].splice(0, 0, {
                id_node: '',
                code: '',
                name: '',
                description: '',
                parent: null,
                id_level: 0,
                weight: 0,
            });
            setPrograms(response);
        }
        fetch();
    }, [index_]);

    const handleChangePrograms = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = event.target.selectedIndex;
        let newIndex_ = [...index_];
        if (newIndex === 0) {
            newIndex_[index] = newIndex;
        } else {
            newIndex_[index] = newIndex;
            for (let i = index+1; i < newIndex_.length; i++) {
                newIndex_[i] = 0;
            }
        }
        if (index == levels.length - 1 && newIndex > 0) callback(programs[index][newIndex]);
        setIndex_(newIndex_);
    };

    return (
        <div className='tw-flex tw-flex-col tw-m-auto tw-gap-2
                        tw-justify-center tw-items-center'>
            {programs.map((program, index) =>
                <div key={index}
                    className='tw-grid tw-grid-cols-2 tw-gap-4 tw-items-center'>
                    <label className='tw-text-right'>{levels[index].name}</label>
                    <select onChange={(e)=>handleChangePrograms(index, e)}
                            className=' tw-p-2 tw-rounded
                                        tw-border-2 tw-border-gray-400
                                        tw-mr-3 tw-w-24
                                        tw-col-span-1'>
                        {program.map((node, index) => (<option value={node.id_node} key={index}>{node.name}</option>))}
                    </select>
                </div>
            )}
        </div>
    );
}

export const LevelsSelectFilter = ({callback}: PropsCallback) => {
    const { levels } = useAppSelector(store => store.plan);
    const [programs, setPrograms] = useState<NodeInterface[][]>([]);
    const [index_, setIndex_] = useState<number[]>(levels.map(() => 0));

    useEffect(() => {
        const fetch = async () => {
            if (levels.length === 0) return;
            let parent: (string | null) = null;
            let response = [] as NodeInterface[][];
            for (let i = 0; i < levels.length; i++) {
                const { id_level } = levels[i];
                if (id_level) {
                    const res: NodeInterface[] = await getLevelNodes({id_level: id_level, parent: parent});
                    const emptyOption: NodeInterface = {
                        id_node: res[0].id_node.split('.').slice(0, -1).join('.'),
                        code: '',
                        name: `${levels[i].name}...`,
                        description: "",
                        parent: null,
                        id_level: id_level,
                        weight: 0,
                        responsible: null,
                    };
                    parent = res[index_[i] - 1 < 0 ? 0 : index_[i] - 1].id_node;
                    response.push([emptyOption, ...res]);
                }
            }
            setPrograms(response);
        }
        fetch();
    }, [index_]);

    const handleChangePrograms = (index: number, event: React.ChangeEvent<HTMLSelectElement>) => {
        const newIndex = event.target.selectedIndex;
        let newIndex_ = [...index_];
        if (newIndex === 0) {
            newIndex_[index] = newIndex;
        } else {
            newIndex_[index] = newIndex;
            for (let i = index+1; i < newIndex_.length; i++) {
                newIndex_[i] = 0;
            }
        }
        setIndex_(newIndex_);
        callback(event);
    };

    return (
        <div className='tw-flex tw-flex-wrap tw-mr-2'>
            {programs.map((program, index) =>
                <div key={index} className='tw-m-1'>
                    <select onChange={e => handleChangePrograms(index, e)}
                            className='tw-w-28 tw-border tw-border-black'>
                        {program.map((node, index) =>
                            <option value={node.id_node}
                                key={index}>
                                {node.name}
                            </option>
                        )}
                    </select>
                </div>
            )}
        </div>
    );
}

export const SearchTerm = ({callback}: PropsCallback) => {
    const { id_plan } = useAppSelector(store => store.content);
    const [stringSearch, setStringSearch] = useState('');
    const [listNodes, setListNodes] = useState<ListNode[]>([]);
    const [listNodesShow, setListNodesShow] = useState<ListNode[]>([]);

    useEffect(() => {
        if (listNodes.length != 0) return;
        getListNodes(id_plan)
        .then((res: ListNode[]) => {
            setListNodes(res);
        })
        .catch(err => {
            console.log(err);
        });
    }, []);

    useEffect(() => {
        if (listNodes.length == 0) return;
        setListNodesShow(listNodes);
    }, [listNodes]);

    useEffect(() => {
        if (stringSearch.length < 3) return setListNodesShow(listNodes);
        const filteredData = listNodes.filter(item =>
            item.name.toLowerCase().includes(stringSearch.toLowerCase()) ||
            item.code.toLowerCase().includes(stringSearch.toLowerCase()) ||
            item.responsible!.toLowerCase().includes(stringSearch.toLowerCase()) ||
            item.tree.toLowerCase().includes(stringSearch.toLowerCase())
        );
        setListNodesShow(filteredData);
    }, [stringSearch]);

    const handleStringSearch = (event: React.ChangeEvent<HTMLInputElement>) => {
        const { value } = event.target;
        setStringSearch(value);
    }

    const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>, i: number) => {
        e.preventDefault();
        callback(listNodesShow[i]);
    }

    return (
        <>
            <p className="tw-mt-2">Buscar palabra clave</p>
            <input
                type="text"
                className=' tw-p-2 tw-rounded
                            tw-border-2 tw-border-gray-400
                            tw-mr-3 tw-mb-2 tw-w-24
                            tw-col-span-1'
                onChange={handleStringSearch}
            />
            <ul className="itemGrid tw-overflow-y-scroll tw-flex tw-flex-col tw-gap-2">
                {listNodesShow.map((item, index) => 
                <button key={index}
                    onClick={e => handleClick(e, index)}
                    type='button'
                    title={item.tree.split(', ').join('\n')}
                    className={`tw-border-2 tw-border-gray-300
                                tw-rounded tw-text-left
                                tw-p-2`}>
                    <div className="tw-flex">
                        <p className="tw-font-bold">Código:</p>
                        <p>{item.code}</p>
                    </div>
                    <div className="tw-flex">
                        <p className="tw-font-bold">Nombre:</p>
                        <p>{item.name}</p>
                    </div>
                    <div className="tw-flex">
                        <p className="tw-font-bold">Secretaría:</p>
                        <p>{item.responsible}</p>
                    </div>
                </button>)}
            </ul>
        </>
    );
}