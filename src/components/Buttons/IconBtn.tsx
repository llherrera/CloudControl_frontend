import IconButton from "@mui/material/IconButton";
import { ArrowBackIos, Settings, Close,
    EditNote, Share } from '@mui/icons-material';

import { BackBtnProps } from "@/interfaces";

export const BackBtn = ({handle, id, className}: BackBtnProps) => {
    return (
        <IconButton aria-label="delete"
                    size="small"
                    color="secondary"
                    onClick={handle}
                    title="Regresar"
                    key={id}>
            <ArrowBackIos className={className}/>
        </IconButton>
    );
}

export const DoubleBackBtn = ({handle, id}: BackBtnProps) => {
    return (
        <IconButton aria-label="delete"
                    size="small"
                    color="secondary"
                    onClick={handle}
                    title="Regresar al inicio"
                    key={id}>
            <ArrowBackIos/>
            <ArrowBackIos className="tw--translate-x-4"/>
        </IconButton>
    );
}

export const SettingsBtn = ({handle, id}: BackBtnProps) => {
    return (
        <IconButton aria-label="delete"
                    size="small"
                    color="inherit"
                    onClick={handle}
                    title="Configuración"
                    key={id}>
            <Settings/>
        </IconButton>
    );
}

export const HvBtn = ({link}:{link:string}) => {
    return (
        <IconButton aria-label="delete"
                    size="large"
                    color="success"
                    onClick={()=>(window.open(link, '_blank'))}
                    title="Ver Hoja de vida">
            <EditNote/>
        </IconButton>
    );
}

export const ShareBtn = ({handle, id, className}: BackBtnProps) => {
    return (
        <IconButton aria-label="delete"
                    size="small"
                    color="inherit"
                    onClick={handle}
                    title="Compartir"
                    key={id}>
            <Share className={className}/>
        </IconButton>
    );
}

export const CloseBtn = ({handle, id}: BackBtnProps) => {
    return (
        <IconButton edge="end"
                    aria-label="delete"
                    title="Cerrar"
                    onClick={() => handle(id)}>
            <Close />
        </IconButton>
    );
}