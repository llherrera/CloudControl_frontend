import IconButton from "@mui/material/IconButton";
import { ArrowBackIos, Settings, Close,
    EditNote, Share } from '@mui/icons-material';

import { BackBtnProps } from "@/interfaces";
export const BackBtn = ({ handle, id, className }: BackBtnProps) => {
    return (
      <IconButton
        aria-label="regresar"
        size="small"
        onClick={handle}
        title="Regresar"
        key={id}
        className={`tw-bg-grey tw-border tw-border-grey tw-rounded hover:tw-bg-gray-100 ${className}`}
      >
        <ArrowBackIos className="tw-text-grey" />
      </IconButton>
    );
  };
  
  export const DoubleBackBtn = ({ handle, id }: BackBtnProps) => {
    return (
      <IconButton
        aria-label="regresar al inicio"
        size="small"
        onClick={handle}
        title="Regresar al inicio"
        key={id}
        className="tw-bg-white tw-border tw-border-white tw-rounded hover:tw-bg-gray-100"
      >
        <ArrowBackIos className="tw-text-white" />
        <ArrowBackIos className="tw-text-white tw--translate-x-4" />
      </IconButton>
    );
  };
  
  export const SettingsBtn = ({ handle, id, color = "white" }: BackBtnProps) => {
    return (
      <IconButton
        aria-label="configuración"
        size="small"
        onClick={handle}
        title="Configuración"
        key={id}
        className="tw-bg-white tw-border tw-border-white tw-rounded hover:tw-bg-gray-100"
      >
        <Settings className={`tw-text-${color}`} />
      </IconButton>
    );
  };
  
  

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

export const ShareBtn = ({ handle, id, className }: BackBtnProps) => {
    return (
      <IconButton
        aria-label="share"
        size="small"
        onClick={handle}
        title="Compartir"
        key={id}
        className={`tw-bg-white tw-border tw-border-white tw-rounded hover:tw-bg-gray-100 ${className}`}
      >
        <Share className="tw-text-white" />
      </IconButton>
    );
  };

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