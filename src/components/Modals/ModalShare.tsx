import { useState } from "react";
import Modal from 'react-modal';
import { Card, CardContent, CardActions,
    Button, Typography, Box } from '@mui/material';
import { Link } from '@mui/icons-material';

import { useAppSelector } from "@/store";

import { ShareBtn } from "@/components";
import { ModalProps, ModalShareProps } from "@/interfaces";
import { notify } from "@/utils";

export const ModalShare = (props: ModalShareProps) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div>
            {props['plan'] ? 
                <SharePlanView
                    modalIsOpen={isOpen}
                    callback={setIsOpen}/>
            : props['meta'] ?
                <ShareUnitView
                    modalIsOpen={isOpen}
                    callback={setIsOpen}/>
            : null
            }
            <ShareBtn
                id={-2}
                handle={()=>setIsOpen(true)}
            />
        </div>
    )
}

const SharePlanView = (props: ModalProps) => {
    const { plan } = useAppSelector(store => store.plan);

    const onClose = () => props.callback(false);

    const handleCopy = async () => {
        try {
            const host = window.location.origin;
            await navigator.clipboard.writeText(`${host}/plan/${plan?.uuid}`);
            notify('Texto copiado al portapapeles');
        } catch (error) {
            console.log('Error al copiar el enlace', error);
            notify('Error al copiar el enlace');
        }
    };

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>onClose()}
                contentLabel=''
                style={{
                    content: {
                        backgroundColor: 'background.paper',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        padding: 4,
                    }
                }}>
            <Box>
                <Card>
                    {plan === undefined ? 
                    <div>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                No hay un plan asignado
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={onClose}>Cerrar</Button>
                        </CardActions>
                    </div>
                    : <div>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Compartir "{plan.name}"
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Se generará un enlace para entrar a este plan indicativo como ciudadano
                            </Typography>
                        </CardContent>
                        <CardActions style={{ justifyContent: 'space-between' }}>
                            <Button 
                                variant="outlined" 
                                startIcon={<Link />} 
                                style={{ borderRadius: '20px' }}
                                onClick={handleCopy}>
                                Copiar enlace
                            </Button>

                            <Button 
                                variant="contained" 
                                color="primary" 
                                style={{ borderRadius: '20px' }}
                                onClick={onClose}>
                                Cerrar
                            </Button>
                        </CardActions>
                    </div>
                    }
                </Card>
            </Box>
        </Modal>
    );
}

const ShareUnitView = (props: ModalProps) => {
    const { plan } = useAppSelector(store => store.plan);
    const { unit } = useAppSelector(store => store.unit);

    const onClose = () => props.callback(false);

    const handleCopy = async () => {
        try {
            const host = window.location.origin;
            await navigator.clipboard.writeText(`${host}/meta/${plan?.uuid}?code=${unit.id_node}`);
            notify('Texto copiado al portapapeles');
        } catch (error) {
            console.log('Error al copiar el enlace', error);
            notify('Error al copiar el enlace');
        }
    };

    return (
        <Modal  isOpen={props.modalIsOpen}
                onRequestClose={()=>onClose()}
                contentLabel=''
                style={{
                    content: {
                        backgroundColor: 'background.paper',
                        position: 'absolute',
                        top: '50%',
                        left: '50%',
                        right: 'auto',
                        bottom: 'auto',
                        transform: 'translate(-50%, -50%)',
                        width: 400,
                        padding: 4,
                    }
                }}>
            <Box>
                <Card>
                    {unit.code === '' ? 
                    <div>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                No hay una meta asignada
                            </Typography>
                        </CardContent>
                        <CardActions>
                            <Button size="small" onClick={onClose}>Cerrar</Button>
                        </CardActions>
                    </div>
                    : <div>
                        <CardContent>
                            <Typography variant="h5" component="div">
                                Compartir "{unit.description}"
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Se generará un enlace para entrar a esta meta como ciudadano
                            </Typography>
                        </CardContent>
                        <CardActions style={{ justifyContent: 'space-between' }}>
                            <Button 
                                variant="outlined" 
                                startIcon={<Link />} 
                                style={{ borderRadius: '20px' }}
                                onClick={handleCopy}>
                                Copiar enlace
                            </Button>

                            <Button 
                                variant="contained" 
                                color="primary" 
                                style={{ borderRadius: '20px' }}
                                onClick={onClose}>
                                Cerrar
                            </Button>
                        </CardActions>
                    </div>
                    }
                </Card>
            </Box>
        </Modal>
    );
}