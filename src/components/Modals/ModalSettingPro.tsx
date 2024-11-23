import React, { useEffect, useState } from "react";
import Modal from 'react-modal';
import { Grid, List, ListItem, Typography, Box,
    styled, Paper, Button, CircularProgress } from '@mui/material';

import { useAppSelector, useAppDispatch } from "@/store";
import { thunkUpdateProjects } from "@/store/plan/thunks";

import { SettingsBtn, LevelsSelect, SearchTerm, CloseBtn } from "@/components";
import { NodeInterface, Project, PropsModalSettingProy,
    ModalProps2, ListNode } from "@/interfaces";
import { doProjectToNodes, getNodesProject, getListNodes } from "@/services/api";
import { notify } from "@/utils";

import './styles.css';

const Item = styled(Paper)(({ theme }) => ({
    backgroundColor: '#fff',
    ...theme.typography.body2,
    padding: theme.spacing(1),
    textAlign: 'center',
    color: theme.palette.text.secondary,
    height: '100%',
}));

const TruncatedText = styled(Typography)({
    display: '-webkit-box',
    overflow: 'hidden',
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: 2,
    textOverflow: 'ellipsis',
});

export const ModalSettingPro = ({index, id}: PropsModalSettingProy) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <SettingView
                index={index}
                id={id}
                modalIsOpen={isOpen}
                callback={setIsOpen}/>
            <SettingsBtn
                id={-3}
                handle={()=>setIsOpen(true)}
            />
        </div>
    )
}

const SettingView = (props: ModalProps2) => {
    const dispatch = useAppDispatch();

    const { id_plan } = useAppSelector(store => store.content);
    const { projects, secretaries, years } = useAppSelector(store => store.plan);
    const [selectedItems, setSelectedItems] = useState<NodeInterface[]>([]);
    const [loading, setLoading] = useState(false);
    const [editProject, setEditProject] = useState(false);
    const [editProject_, setEditProject_] = useState(false);

    const [projectEdited, setProjectEdited] = useState<Project>(
        projects ? projects[props.index] :
        {
            id_project: 0,
            BPIM: 0,
            name: '',
            year: 0,
            entity: '',
            link: ''
        }
    );

    useEffect(() => {
        if (!props.modalIsOpen) return;
        if (projects == undefined) return;
        if (props.index < 0) return;
        if (projects[props.index] == undefined) return;
        const fetch = async () => {
            getNodesProject(projects[props.index].id_project)
            .then((res: NodeInterface[]) => {
                setSelectedItems(res);
            })
            .catch(err => {
                console.log(err);
            });
        }
        fetch();
    }, [props]);

    const onClose = () => props.callback(false);

    const handleSelectChange = (data: NodeInterface) => {
        const temp = selectedItems.map(item => item.id_node);
        if (!temp.includes(data.id_node)) {
            setSelectedItems(prevItems => [...prevItems, data]);
        } else {
            notify('No puede relacionar la misma meta mas de una vez', 'warning');
        }
    };

    const deleteItem = (index: number) => setSelectedItems(items => items.filter((item, i) => i !== index));

    const handleChangee = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        const numericFields = ['year', 'BPIM'];
        let parsedValue: string | number = value;
        if (numericFields.includes(name)) {
            parsedValue = parseFloat(value);
        }
        setEditProject_(true);
        setProjectEdited({ ...projectEdited, [name]: parsedValue });
    };

    const handleUpdateProject = () => {
        if (editProject) {
            if (editProject_) {
                dispatch(thunkUpdateProjects({ id_project: projectEdited.id_project, project: projectEdited}));
                setEditProject(!editProject);
            } else setEditProject(!editProject);
        } else setEditProject(!editProject);
    };

    const handleSave = () => {
        if (selectedItems.length == 0) return notify('Para relacionar los proyectos debe seleccionar al menos una meta', 'warning');
        setLoading(true);
        doProjectToNodes(id_plan, props.id, selectedItems)
            .then(() => {
                notify('Metas relacionadas', 'success');
            })
            .catch((err) => {
                console.log(err);
                notify('Ha ocurrido un error al cargas las metas', 'error');
            })
            .finally(() => {
                setLoading(false)
            });
    };

    if (secretaries == undefined) return null;

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>onClose()}
                contentLabel=''
                style={{
                    content: {
                        backgroundColor: '#D9D9D9',
                    }
                }}>
            <button className=" tw-absolute tw-cursor-pointer
                                tw-top-1 tw-right-2.5
                                tw-bg-none tw-font-bold
                                tw-text-xl tw-text-white
                                tw-border-none"
                    onClick={onClose}>
                X
            </button>
            <Box sx={{ flexGrow: 1, padding: 2, height: '100%' }}>
                <Grid container spacing={{ xs: 2, md: 3 }} sx={{ height: '100%' }}>
                    <Grid item xs={4}>
                        <Item style={{maxHeight: '100%', overflow: 'auto'}}>
                            <Typography variant="h6">Información del proyecto</Typography>
                            <div className="tw-relative tw-h-5/6">
                                {editProject ?
                                    <div className='tw-flex tw-flex-col tw-m-auto tw-gap-2
                                                    tw-justify-center tw-items-center'>
                                        <div className='tw-grid tw-grid-cols-3 tw-gap-4 tw-items-center'>
                                            <label className="tw-text-right tw-col-start-1">BPIM: </label>
                                            <input type='number' placeholder='BPIM' name="BPIM"
                                                className=" tw-m-2 tw-mr-3 tw-p-2 tw-rounded
                                                            tw-border-2 tw-border-gray-400
                                                            tw-col-span-2"
                                                value={projectEdited.BPIM}
                                                onChange={e => handleChangee(e)}
                                            />
                                        </div>
                                        <div className='tw-grid tw-grid-cols-3 tw-gap-4 tw-items-center'>
                                            <label className="tw-text-right tw-col-start-1">Nombre: </label>
                                            <input type='text' placeholder='Nombre' name="name"
                                                className=" tw-m-2 tw-mr-3 tw-p-2 tw-rounded
                                                            tw-border-2 tw-border-gray-400
                                                            tw-col-span-2"
                                                value={projectEdited.name}
                                                onChange={e => handleChangee(e)}
                                            />
                                        </div>
                                        <div className='tw-grid tw-grid-cols-3 tw-gap-4 tw-items-center'>
                                            <label className="tw-text-right tw-col-start-1">Entidad: </label>
                                            <select 
                                                className=" tw-m-2 tw-mr-3 tw-p-2 tw-rounded
                                                            tw-border-2 tw-border-gray-400
                                                            tw-col-span-2"
                                                name="entity"
                                                value={projectEdited.entity}
                                                onChange={e => handleChangee(e)}>
                                                {secretaries.map((s, i) => <option key={i}>{s.name}</option>)}
                                            </select>
                                        </div>
                                        <div className='tw-grid tw-grid-cols-3 tw-gap-4 tw-items-center'>
                                            <label className="tw-text-right tw-col-start-1">Año: </label>
                                            <select
                                                className=" tw-m-2 tw-mr-3 tw-p-2 tw-rounded
                                                            tw-border-2 tw-border-gray-400
                                                            tw-col-span-2"
                                                name="year"
                                                value={projectEdited.year}
                                                onChange={e => handleChangee(e)}>
                                                {years.map((y, i) => <option key={i}>{y}</option>)}
                                            </select>
                                        </div>
                                    </div> :
                                    <div className="tw-flex tw-flex-col tw-m-auto tw-gap-2
                                                    tw-justify-center tw-items-center">
                                        <p className="tw-my-2">
                                            {projects![props.index].BPIM}
                                        </p>
                                        <p className="tw-my-2">
                                            {projects![props.index].name}
                                        </p>
                                        <p className="tw-my-2">
                                            {projects![props.index].entity}
                                        </p>
                                        <p className="tw-my-2">
                                            {projects![props.index].year}
                                        </p>
                                    </div>
                                }
                                <button className=" tw-absolute tw-inset-x-0 tw-bottom-0
                                                    tw-bg-blue-500
                                                    hover:tw-bg-blue-300 
                                                    tw-text-white tw-font-bold
                                                    tw-rounded
                                                    tw-p-2 tw-mt-2"
                                        onClick={handleUpdateProject}>
                                    {editProject ? 'Regresar' : 'Editar'}
                                </button>
                            </div>
                        </Item>
                    </Grid>

                    <Grid item xs={4}>
                        <Item style={{maxHeight: '100%', overflow: 'auto'}}>
                            <Typography variant="h6">Escoger metas</Typography>
                            <LevelsSelect callback={handleSelectChange}/>
                            <SearchTerm callback={handleSelectChange}/>
                        </Item>
                    </Grid>

                    <Grid item xs={4}>
                        <Item style={{maxHeight: '100%', overflow: 'auto'}}>
                            <Typography variant="h6">Metas seleccionadas</Typography>
                            <List>
                                {selectedItems.map((item, index) =>
                                    <ListItem
                                        key={index}
                                        title={`${item.name}\n${item.responsible}`}
                                        secondaryAction={<CloseBtn handle={deleteItem} id={index}/>}
                                        className=" tw-border-2 tw-rounded
                                                    tw-my-1">
                                        <TruncatedText variant="body1">{item.name}</TruncatedText>
                                    </ListItem>
                                )}
                            </List>
                        </Item>
                    </Grid>
                </Grid>

                <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: 2 }}>
                    {loading ?
                    <Box sx={{ display: 'flex' }}>
                        <CircularProgress />
                    </Box> :
                    <Button variant="contained" color="primary" onClick={handleSave}>
                        Guardar
                    </Button>
                    }
                </Box>
            </Box>
        </Modal>
    );
}