import IconButton from "@mui/material/IconButton";
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import SettingsIcon from '@mui/icons-material/Settings';
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