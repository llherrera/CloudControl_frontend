import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { IconButton } from "@mui/material";
import { Settings } from '@mui/icons-material';

import { useAppSelector, useAppDispatch } from "@/store";
import { AddRootTree, setZeroLevelIndex } from "@/store/plan/planSlice";

import { decode } from "@/utils";
import { getUnitNodeResult } from "@/services/api";
import { BackBtn, DoubleBackBtn, UnitFrame,
    ModalShare, NodeResultForm, UnitResultInfo } from "@/components";
import { UnitNodeResultInterface } from "@/interfaces";

export const UnitNodeResultPage = () => {
    const dispatch = useAppDispatch();
    const navigate = useNavigate();

    const { rootTree, nodes } = useAppSelector(store => store.plan);
    const { token_info } = useAppSelector(store => store.auth);
    const { id_plan } = useAppSelector(store => store.content);

    const [listNodes, setListNodes] = useState<UnitNodeResultInterface[]>([]);
    const [data, setData] = useState<UnitNodeResultInterface | undefined>(undefined);
    const [showForm, setShowForm] = useState(false);
    const [num, setNm] = useState(0);

    const [rol, setRol] = useState("");
    const [id, setId] = useState(0);

    useEffect(() => {
        if (token_info?.token !== undefined) {
            const decoded = decode(token_info.token);
            setRol(decoded.rol);
            setId(decoded.id_plan);
        }
    }, []);

    useEffect(() => {
        getUnitNodeResult(nodes[0].id_node.split('.').slice(0, -1).join('.'))
        .then((res: UnitNodeResultInterface[]) => setListNodes(res))
        .catch(error => console.log(error));
    }, []);

    const handleStartReturn = () => {
        dispatch(AddRootTree([]));
        dispatch(setZeroLevelIndex());
        navigate(-1);
    };

    const handleBack = () => navigate(-1);

    const handleShowForm = () => {
        setData(undefined);
        setShowForm(prevShow => !showForm);
    };

    const handleNodeBtn = (i: number) => {
        setData(prevData => prevData === undefined ? listNodes[i] : undefined);
        setShowForm(prevShow => false);
    };

    const handleUpdateNode = (i: number) => {
        setData(prevData => prevData === undefined ? listNodes[i] : undefined);
        setShowForm(prevShow => true);
    };

    return (
        <UnitFrame>
            <div className="tw-flex tw-items-center">
                <DoubleBackBtn handle={handleStartReturn} id={id_plan}/>
                <BackBtn handle={handleBack} id={id_plan}/>
                {rol === 'admin' || ((rol === 'funcionario' || rol === 'planeacion') && id === id_plan) ?
                    <ModalShare meta/>
                    : null
                }
            </div>
            <ol className="tw-flex tw-justify-center tw-flex-wrap">
            {rootTree.map(name =>
                <li className="tw-flex tw-mx-3" key={name[0]}>
                    <p className="tw-text-green-600 tw-text-xl tw-font-bold">{name[1]}:</p>
                    <p className="tw-ml-1 tw-text-xl tw-font-bold">{name[0]}</p>
                </li>
            )}
            </ol>
            <div className={`tw-flex tw-gap-2 tw-my-4 tw-mx-2`}>
                <div className="tw-basis-1/3">
                    <button className=" tw-bg-cyan-400 hover:tw-bg-cyan-200
                                        tw-rounded tw-p-2"
                            onClick={() => handleShowForm()}>
                        Añadir Meta de Resultado
                    </button>
                    <ul className={`tw-flex tw-flex-col tw-items-start tw-gap-1 tw-mt-4`}>
                    {listNodes.map((n, i) =>
                    <li key={i} className="tw-flex tw-w-full">
                        <button className={`tw-flex tw-justify-between tw-w-full
                                            tw-mb-4 tw-p-2 tw-rounded tw-text-justify
                                            tw-border-4
                                            ${(!!data && n.code === data.code) ? 'tw-border-green-400 hover:tw-border-green-100' : 'tw-border-gray-400 hover:tw-border-gray-100'}
                                            `}
                                onClick={() => handleNodeBtn(i)}>
                            {n.indicator}
                        </button>
                        <IconButton
                            aria-label="delete"
                            type="button"
                            onClick={() => handleUpdateNode(i)}
                            title="Actualizar meta de resultado"
                            sx={{
                                display: 'flex',
                                alignItems: 'baseline',
                            }}
                        >
                            <Settings/>
                        </IconButton>
                    </li>
                    )}
                    </ul>
                </div>
                <div className="tw-basis-2/3">
                {showForm ? <NodeResultForm unit={data}/> : !!data ? <UnitResultInfo unit={data}/> : null}
                </div>
            </div>
        </UnitFrame>
    );
}