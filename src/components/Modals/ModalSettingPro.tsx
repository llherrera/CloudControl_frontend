import { useEffect, useState } from "react";
import Modal from 'react-modal';
import { Grid, List, ListItem, Typography, Box,
    styled, Paper, Button, CircularProgress } from '@mui/material';

import { useAppSelector } from "@/store";

import { SettingsBtn, LevelsSelect, CloseBtn } from "@/components";
import { ModalProps, NodeInterface } from "@/interfaces";
import { doProjectToNodes, getNodesProject } from "@/services/api";
import { notify } from "@/utils";

interface Props {
    index: number;
    id: number;
}

interface ModalProps2 extends ModalProps {
    index: number;
    id: number;
}

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

export const ModalSettingPro = ({index, id}: Props) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            <SettingView
                index={index}
                id={id}
                modalIsOpen={isOpen}
                callback={setIsOpen}/>
            <SettingsBtn
                id={-2}
                handle={()=>setIsOpen(true)}
            />
        </div>
    )
}

const SettingView = (props: ModalProps2) => {
    const { id_plan } = useAppSelector(store => store.content);
    const { projects } = useAppSelector(store => store.plan);
    const [selectedItems, setSelectedItems] = useState<NodeInterface[]>([]);
    const [loading, setLoading] = useState(false);

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
        const temp = selectedItems.map(item => item.id_node)
        if (!temp.includes(data.id_node)) {
            setSelectedItems(prevItems => [...prevItems, data]);
        } else {
            notify('No puede relacionar la misma meta mas de una vez', 'warning');
        }
    };

    const deleteItem = (index: number) => setSelectedItems(items => items.filter((item, i) => i !== index));

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

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>onClose()}
                contentLabel=''
                style={{
                    content: {
                        backgroundColor: 'black',
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
                        <Item style={{maxHeight: '80%', overflow: 'auto'}}>
                            <Typography variant="h6">Información del proyecto</Typography>
                            <p className="">
                                {projects![props.index].BPIM}
                            </p>
                            <p className="">
                                {projects![props.index].name}
                            </p>
                            <p className="">
                                {projects![props.index].entity}
                            </p>
                            <p className="">
                                {projects![props.index].year}
                            </p>
                        </Item>
                    </Grid>

                    <Grid item xs={4}>
                        <Item style={{maxHeight: '80%', overflow: 'auto'}}>
                            <Typography variant="h6">Escoger metas</Typography>
                            <LevelsSelect callback={handleSelectChange}/>
                        </Item>
                    </Grid>

                    <Grid item xs={4}>
                        <Item style={{maxHeight: '80%', overflow: 'auto'}}>
                            <Typography variant="h6">Elementos seleccionados</Typography>
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