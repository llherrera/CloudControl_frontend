import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SettingsIcon from '@mui/icons-material/Settings';
import EditNoteIcon from '@mui/icons-material/EditNote';
import { BackBtnProps } from "@/interfaces";

export const BackBtn = ({handle, id}: BackBtnProps) => {
    return (
        <IconButton aria-label="delete"
                    size="small"
                    color="secondary"
                    onClick={handle}
                    title="Regresar"
                    key={id}>
            <ArrowBackIosIcon/>
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
            <SettingsIcon/>
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
            <EditNoteIcon/>
        </IconButton>
    );
}
